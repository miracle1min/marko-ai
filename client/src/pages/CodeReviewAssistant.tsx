import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Code,
  FileCode,
  Shield,
  RefreshCw,
  Copy,
  Check,
  Download,
  BookOpen,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  List,
  FileText,
  Award,
  Lock,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeReviewRequest, CodeReviewResponse } from "@/lib/types";
import { apiRequest, getQueryFn } from "@/lib/queryClient";

// Daftar bahasa pemrograman yang didukung
const programmingLanguages = [
  { value: "javascript", label: "JavaScript", extension: "js" },
  { value: "typescript", label: "TypeScript", extension: "ts" },
  { value: "python", label: "Python", extension: "py" },
  { value: "java", label: "Java", extension: "java" },
  { value: "csharp", label: "C#", extension: "cs" },
  { value: "cpp", label: "C++", extension: "cpp" },
  { value: "php", label: "PHP", extension: "php" },
  { value: "go", label: "Go", extension: "go" },
  { value: "ruby", label: "Ruby", extension: "rb" },
  { value: "swift", label: "Swift", extension: "swift" },
  { value: "rust", label: "Rust", extension: "rs" },
  { value: "kotlin", label: "Kotlin", extension: "kt" },
  { value: "sql", label: "SQL", extension: "sql" }
];

// Jenis review
const reviewTypes = [
  { value: "quality", label: "Kualitas Kode" },
  { value: "security", label: "Keamanan" },
  { value: "best-practices", label: "Best Practices" },
  { value: "all", label: "Semua Aspek" }
];

// Mapping untuk severity badges
const severityBadges = {
  low: { component: <Badge className="bg-blue-500">Rendah</Badge>, icon: <Info className="h-4 w-4 text-blue-500" /> },
  medium: { component: <Badge className="bg-yellow-500">Sedang</Badge>, icon: <AlertCircle className="h-4 w-4 text-yellow-500" /> },
  high: { component: <Badge className="bg-orange-500">Tinggi</Badge>, icon: <AlertTriangle className="h-4 w-4 text-orange-500" /> },
  critical: { component: <Badge className="bg-red-500">Kritis</Badge>, icon: <XCircle className="h-4 w-4 text-red-500" /> }
};

export default function CodeReviewAssistant() {
  const [language, setLanguage] = useState("javascript");
  const [codeInput, setCodeInput] = useState("");
  const [reviewType, setReviewType] = useState("all");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [includeCodeExamples, setIncludeCodeExamples] = useState(true);
  const [includeSuggestions, setIncludeSuggestions] = useState(true);
  
  const [reviewResult, setReviewResult] = useState<CodeReviewResponse | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [copied, setCopied] = useState(false);
  
  const { toast } = useToast();
  
  // Convert to Prism language format if needed
  const getPrismLanguage = (lang: string) => {
    switch (lang) {
      case 'csharp': return 'cs';
      default: return lang;
    }
  };
  
  // API call for code review
  const reviewMutation = useMutation({
    mutationFn: async (request: CodeReviewRequest) => {
      try {
        const response = await fetch('/api/gemini/code-review', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(request)
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        return await response.json() as CodeReviewResponse;
      } catch (error) {
        console.error('Error during code review:', error);
        throw error;
      }
    },
    onSuccess: (data: CodeReviewResponse) => {
      setReviewResult(data);
      
      // Show the results tab
      setActiveTab("summary");
      
      toast({
        title: "Kode Berhasil Direview",
        description: "Kode telah berhasil dianalisis menggunakan Marko AI",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Gagal melakukan code review: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleReview = () => {
    if (!codeInput.trim()) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Harap masukkan kode yang ingin direview terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    
    const request: CodeReviewRequest = {
      language,
      code: codeInput,
      reviewType,
      additionalInstructions: additionalInstructions.trim() || undefined,
      includeCodeExamples,
      includeSuggestions
    };
    
    reviewMutation.mutate(request);
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Disalin!",
      description: "Teks telah disalin ke clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Generate quality score icon and color
  const getQualityIndicator = (score: number) => {
    if (score >= 80) {
      return { icon: <CheckCircle className="text-green-500" />, color: "text-green-500", progressColor: "bg-green-500" };
    } else if (score >= 60) {
      return { icon: <AlertCircle className="text-yellow-500" />, color: "text-yellow-500", progressColor: "bg-yellow-500" };
    } else {
      return { icon: <XCircle className="text-red-500" />, color: "text-red-500", progressColor: "bg-red-500" };
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-6">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Code Review Assistant", path: "/tools/code-review-assistant", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Shield className="text-indigo-600 mr-2" /> 
          Code Review Assistant
        </h1>
        <p className="text-gray-600 mt-2">
          Analisis kualitas kode, keamanan, dan best practices untuk meningkatkan kualitas perangkat lunak Anda
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="h-full">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileCode className="mr-2 text-indigo-600" /> Kode Input
                </h2>
                <div className="flex items-center space-x-2">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Pilih bahasa" />
                    </SelectTrigger>
                    <SelectContent>
                      {programmingLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="code" className="w-full">
                <TabsList className="mb-3">
                  <TabsTrigger value="code">Input Kode</TabsTrigger>
                  <TabsTrigger value="options">Opsi Review</TabsTrigger>
                </TabsList>
                
                <TabsContent value="code" className="border rounded-md">
                  <Textarea 
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder={`Masukkan kode ${programmingLanguages.find(lang => lang.value === language)?.label || ''} yang ingin direview di sini...`}
                    className="font-mono text-sm min-h-[400px] resize-none border-0 focus-visible:ring-0"
                  />
                </TabsContent>
                
                <TabsContent value="options" className="border rounded-md p-4 space-y-4">
                  <div>
                    <Label htmlFor="review-type" className="flex items-center">
                      <Shield className="h-4 w-4 mr-2" /> Jenis Review
                    </Label>
                    <Select value={reviewType} onValueChange={setReviewType}>
                      <SelectTrigger id="review-type">
                        <SelectValue placeholder="Pilih jenis review" />
                      </SelectTrigger>
                      <SelectContent>
                        {reviewTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Fokus review yang akan dilakukan oleh AI
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="additional-instructions" className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" /> Instruksi Tambahan (Opsional)
                    </Label>
                    <Textarea 
                      id="additional-instructions"
                      value={additionalInstructions}
                      onChange={(e) => setAdditionalInstructions(e.target.value)}
                      placeholder="Masukkan instruksi khusus untuk code review, misalnya: fokus pada security vulnerabilities atau periksa sesuai coding standard tertentu"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-code-examples" className="flex items-center">
                      <Code className="h-4 w-4 mr-2" /> Sertakan Contoh Kode
                    </Label>
                    <Switch
                      id="include-code-examples"
                      checked={includeCodeExamples}
                      onCheckedChange={setIncludeCodeExamples}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-suggestions" className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" /> Sertakan Rekomendasi
                    </Label>
                    <Switch
                      id="include-suggestions"
                      checked={includeSuggestions}
                      onCheckedChange={setIncludeSuggestions}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleReview}
                  disabled={reviewMutation.isPending || !codeInput.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {reviewMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sedang Melakukan Review...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Review Kode
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Shield className="mr-2 text-indigo-600" /> Hasil Review
                </h2>
                {reviewResult && (
                  <div className="flex items-center">
                    <span className="mr-2 font-semibold">Skor Kualitas:</span>
                    <div className="flex items-center">
                      {getQualityIndicator(reviewResult.qualityScore).icon}
                      <span className={`ml-1 font-bold ${getQualityIndicator(reviewResult.qualityScore).color}`}>
                        {reviewResult.qualityScore}/100
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {reviewResult ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-3">
                    <TabsTrigger value="summary">Ringkasan</TabsTrigger>
                    <TabsTrigger value="issues">
                      Masalah {reviewResult.issues.length > 0 ? `(${reviewResult.issues.length})` : ""}
                    </TabsTrigger>
                    
                    <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
                    
                    {reviewResult.securityIssues && reviewResult.securityIssues.length > 0 && (
                      <TabsTrigger value="security">
                        Keamanan ({reviewResult.securityIssues.length})
                      </TabsTrigger>
                    )}
                    
                    {reviewResult.suggestions && reviewResult.suggestions.length > 0 && (
                      <TabsTrigger value="suggestions">Saran</TabsTrigger>
                    )}
                  </TabsList>
                  
                  <TabsContent value="summary" className="border rounded-md p-4">
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">Ringkasan Analisis</h3>
                      <p className="text-gray-700">{reviewResult.summary}</p>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Skor Kualitas</h4>
                      <div className="flex items-center mb-2">
                        <Progress 
                          value={reviewResult.qualityScore} 
                          className={`h-2 ${getQualityIndicator(reviewResult.qualityScore).progressColor}`} 
                        />
                        <span className="ml-2 font-bold">{reviewResult.qualityScore}%</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Distribusi Masalah</h4>
                      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                        {["critical", "high", "medium", "low"].map((severity) => {
                          const count = reviewResult.issues.filter(issue => issue.severity === severity).length;
                          return (
                            <div key={severity} className="flex items-center justify-between border rounded p-2">
                              <div className="flex items-center">
                                {severityBadges[severity as keyof typeof severityBadges].icon}
                                <span className="ml-2 text-sm">{severity.charAt(0).toUpperCase() + severity.slice(1)}</span>
                              </div>
                              <span className="font-bold">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Rekomendasi Keseluruhan</h4>
                      <p className="p-3 bg-gray-50 rounded border text-gray-700">{reviewResult.overallRecommendation}</p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="issues" className="border rounded-md p-4">
                    {reviewResult.issues.length > 0 ? (
                      <div className="space-y-4">
                        {reviewResult.issues.map((issue, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <Badge variant="outline" className="mr-2">{issue.type}</Badge>
                                {severityBadges[issue.severity].component}
                              </div>
                              {issue.line && (
                                <Badge variant="outline">Baris {issue.line}</Badge>
                              )}
                            </div>
                            <p className="text-gray-700 mb-3">{issue.description}</p>
                            
                            {issue.suggestion && (
                              <div className="mb-3">
                                <h5 className="text-sm font-semibold mb-1 flex items-center">
                                  <Info className="h-4 w-4 mr-1" /> Saran Perbaikan
                                </h5>
                                <p className="text-gray-600 text-sm pl-5">{issue.suggestion}</p>
                              </div>
                            )}
                            
                            {issue.codeExample && (
                              <div>
                                <h5 className="text-sm font-semibold mb-1 flex items-center">
                                  <Code className="h-4 w-4 mr-1" /> Contoh Perbaikan
                                </h5>
                                <SyntaxHighlighter
                                  language={getPrismLanguage(language)}
                                  style={theme === "dark" ? vscDarkPlus : vs}
                                  customStyle={{
                                    fontSize: '0.875rem',
                                    borderRadius: '0.375rem',
                                  }}
                                >
                                  {issue.codeExample}
                                </SyntaxHighlighter>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                        <p className="text-xl font-medium text-gray-700">Tidak Ada Masalah Ditemukan!</p>
                        <p className="text-gray-500">Kode Anda telah melewati review tanpa masalah yang terdeteksi.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="best-practices" className="border rounded-md p-4">
                    {reviewResult.bestPractices.length > 0 ? (
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium mb-3">Best Practices</h3>
                        <ul className="space-y-2">
                          {reviewResult.bestPractices.map((practice, index) => (
                            <li key={index} className="flex">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mr-2 mt-0.5" />
                              <span>{practice}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-xl font-medium text-gray-700">Tidak Ada Best Practices</p>
                        <p className="text-gray-500">Tidak ada best practices yang ditemukan untuk kode ini.</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  {reviewResult.securityIssues && (
                    <TabsContent value="security" className="border rounded-md p-4">
                      {reviewResult.securityIssues.length > 0 ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium mb-3">Masalah Keamanan</h3>
                          {reviewResult.securityIssues.map((issue, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-red-50">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                  <Lock className="h-5 w-5 text-red-600 mr-2" />
                                  <h4 className="font-medium text-red-800">{issue.vulnerability}</h4>
                                </div>
                                {severityBadges[issue.severity].component}
                              </div>
                              <p className="text-gray-700 mb-3">{issue.description}</p>
                              <div className="bg-white p-3 rounded border">
                                <h5 className="text-sm font-semibold mb-1">Solusi:</h5>
                                <p className="text-gray-600">{issue.remediation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Shield className="h-12 w-12 mx-auto text-green-500 mb-3" />
                          <p className="text-xl font-medium text-gray-700">Tidak Ada Masalah Keamanan</p>
                          <p className="text-gray-500">Tidak ada masalah keamanan yang terdeteksi dalam kode Anda.</p>
                        </div>
                      )}
                    </TabsContent>
                  )}
                  
                  {reviewResult.suggestions && (
                    <TabsContent value="suggestions" className="border rounded-md p-4">
                      {reviewResult.suggestions.length > 0 ? (
                        <div className="space-y-2">
                          <h3 className="text-lg font-medium mb-3">Saran Peningkatan</h3>
                          <ul className="space-y-3">
                            {reviewResult.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex p-3 bg-blue-50 rounded-lg">
                                <Award className="h-5 w-5 text-blue-600 flex-shrink-0 mr-2 mt-0.5" />
                                <span>{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Award className="h-12 w-12 mx-auto text-blue-400 mb-3" />
                          <p className="text-xl font-medium text-gray-700">Tidak Ada Saran Tambahan</p>
                          <p className="text-gray-500">Tidak ada saran tambahan untuk kode ini.</p>
                        </div>
                      )}
                    </TabsContent>
                  )}
                  
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-md">
                  <div className="text-center">
                    <Shield className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl font-medium text-gray-700 mb-2">Review Kode Anda</p>
                    <p className="text-gray-500 max-w-md mx-auto">Masukkan kode Anda di panel kiri dan klik tombol "Review Kode" untuk melakukan analisis kualitas kode, keamanan, dan best practices.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}