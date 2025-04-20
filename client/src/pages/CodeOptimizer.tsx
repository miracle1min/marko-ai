import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Code,
  FileCode,
  Zap,
  RefreshCw,
  Copy,
  Check,
  Download,
  Activity,
  Settings,
  Sliders,
  Database,
  FileText,
  Lock,
  BarChart2,
  HelpCircle,
  BookOpen
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
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { optimizeCode } from "@/lib/geminiApi";
import { CodeOptimizationRequest, CodeOptimizationResponse } from "@/lib/types";

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

// Optimization types
const optimizationTypes = [
  { value: "performance", label: "Optimasi Performa" },
  { value: "readability", label: "Keterbacaan Kode" },
  { value: "memory", label: "Efisiensi Memori" },
  { value: "security", label: "Keamanan Kode" },
  { value: "all", label: "Semua Aspek" }
];

export default function CodeOptimizer() {
  const [language, setLanguage] = useState("javascript");
  const [codeInput, setCodeInput] = useState("");
  const [optimizationType, setOptimizationType] = useState("all");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [includeBenchmarks, setIncludeBenchmarks] = useState(true);
  const [includeExplanations, setIncludeExplanations] = useState(true);
  
  const [optimizedCode, setOptimizedCode] = useState("");
  const [improvements, setImprovements] = useState<string[]>([]);
  const [benchmarks, setBenchmarks] = useState<any>(null);
  const [explanation, setExplanation] = useState("");
  
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("code");
  
  const { toast } = useToast();
  
  // Get language extension
  const getLanguageExtension = () => {
    const lang = programmingLanguages.find(lang => lang.value === language);
    return lang ? lang.extension : "txt";
  };
  
  // Convert to Prism language format if needed
  const getPrismLanguage = (lang: string) => {
    switch (lang) {
      case 'csharp': return 'cs';
      default: return lang;
    }
  };
  
  // API call for optimizing code
  const optimizeMutation = useMutation({
    mutationFn: async (request: CodeOptimizationRequest) => {
      return optimizeCode(request);
    },
    onSuccess: (data: CodeOptimizationResponse) => {
      setOptimizedCode(data.optimizedCode);
      setImprovements(data.improvements);
      setBenchmarks(data.benchmarks);
      setExplanation(data.explanation || "");
      
      // Show the results tab
      setActiveTab("results");
      
      toast({
        title: "Kode Berhasil Dioptimasi",
        description: "Kode telah berhasil dioptimasi menggunakan Marko AI",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Gagal mengoptimasi kode: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleOptimize = () => {
    if (!codeInput.trim()) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Harap masukkan kode yang ingin dioptimasi terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    
    const request: CodeOptimizationRequest = {
      language,
      code: codeInput,
      optimizationType,
      additionalInstructions: additionalInstructions.trim() || undefined,
      includeBenchmarks,
      includeExplanations
    };
    
    optimizeMutation.mutate(request);
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Disalin!",
      description: "Kode telah disalin ke clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const extension = getLanguageExtension();
    const blob = new Blob([optimizedCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `optimized_code.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "File Diunduh",
      description: `Kode optimasi telah diunduh sebagai optimized_code.${extension}`,
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Code Optimizer", path: "/tools/code-optimizer", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Zap className="text-emerald-600 mr-2" /> 
          Code Optimizer
        </h1>
        <p className="text-gray-600 mt-2">
          Optimalkan kode yang sudah ada untuk performa lebih baik, keterbacaan, dan keamanan dengan bantuan Marko AI
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card className="h-full">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileCode className="mr-2 text-emerald-600" /> Kode Input
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
                  <TabsTrigger value="options">Opsi Optimasi</TabsTrigger>
                </TabsList>
                
                <TabsContent value="code" className="border rounded-md">
                  <Textarea 
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder={`Masukkan kode ${programmingLanguages.find(lang => lang.value === language)?.label || ''} yang ingin dioptimasi di sini...`}
                    className="font-mono text-sm min-h-[400px] resize-none border-0 focus-visible:ring-0"
                  />
                </TabsContent>
                
                <TabsContent value="options" className="border rounded-md p-4 space-y-4">
                  <div>
                    <Label htmlFor="optimization-type" className="flex items-center">
                      <Sliders className="h-4 w-4 mr-2" /> Jenis Optimasi
                    </Label>
                    <Select value={optimizationType} onValueChange={setOptimizationType}>
                      <SelectTrigger id="optimization-type">
                        <SelectValue placeholder="Pilih jenis optimasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {optimizationTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      Fokus optimasi yang akan dilakukan oleh AI
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
                      placeholder="Masukkan instruksi khusus untuk optimasi kode Anda, misalnya: fokus pada optimasi loop atau penggunaan memori"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-benchmarks" className="flex items-center">
                      <BarChart2 className="h-4 w-4 mr-2" /> Sertakan Analisis Kompleksitas
                    </Label>
                    <Switch
                      id="include-benchmarks"
                      checked={includeBenchmarks}
                      onCheckedChange={setIncludeBenchmarks}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-explanations" className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" /> Sertakan Penjelasan
                    </Label>
                    <Switch
                      id="include-explanations"
                      checked={includeExplanations}
                      onCheckedChange={setIncludeExplanations}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleOptimize}
                  disabled={optimizeMutation.isPending || !codeInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {optimizeMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sedang Mengoptimasi...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Optimasi Kode
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
                  <Zap className="mr-2 text-emerald-600" /> Hasil Optimasi
                </h2>
                <div className="flex space-x-2">
                  {optimizedCode && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopy(optimizedCode)}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 mr-2" />
                        ) : (
                          <Copy className="h-4 w-4 mr-2" />
                        )}
                        {copied ? "Disalin" : "Salin"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownload}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Unduh
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-3">
                  <TabsTrigger value="results">Kode Optimasi</TabsTrigger>
                  <TabsTrigger value="improvements">
                    Perbaikan {improvements.length > 0 ? `(${improvements.length})` : ""}
                  </TabsTrigger>
                  {includeBenchmarks && benchmarks && (
                    <TabsTrigger value="benchmarks">Kompleksitas</TabsTrigger>
                  )}
                  {includeExplanations && explanation && (
                    <TabsTrigger value="explanation">Penjelasan</TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="results" className="border rounded-md">
                  {optimizedCode ? (
                    <SyntaxHighlighter
                      language={getPrismLanguage(language)}
                      style={theme === "dark" ? vscDarkPlus : vs}
                      showLineNumbers
                      customStyle={{
                        margin: 0,
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem',
                        minHeight: '400px',
                        maxHeight: '400px'
                      }}
                    >
                      {optimizedCode}
                    </SyntaxHighlighter>
                  ) : (
                    <div className="flex items-center justify-center h-[400px] text-gray-500 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="text-center">
                        <Code className="h-16 w-16 mx-auto text-gray-400" />
                        <p className="mt-2">Kode yang dioptimasi akan muncul di sini</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="improvements" className="border rounded-md p-4">
                  {improvements.length > 0 ? (
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium mb-3">Perbaikan yang Dilakukan:</h3>
                      <ul className="space-y-2">
                        {improvements.map((improvement, index) => (
                          <li key={index} className="flex">
                            <div className="flex-shrink-0 bg-emerald-100 text-emerald-600 w-6 h-6 rounded-full flex items-center justify-center mr-3">
                              <Check className="h-4 w-4" />
                            </div>
                            <span>{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[400px] text-gray-500">
                      <p>Daftar perbaikan akan muncul setelah kode dioptimasi</p>
                    </div>
                  )}
                </TabsContent>
                
                {includeBenchmarks && (
                  <TabsContent value="benchmarks" className="border rounded-md p-4">
                    {benchmarks ? (
                      <div className="space-y-6">
                        <h3 className="text-lg font-medium">Analisis Kompleksitas:</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border-2 border-gray-200">
                            <CardContent className="pt-6">
                              <h4 className="text-base font-medium mb-4 flex items-center">
                                <Code className="mr-2 text-gray-600" /> Kode Asli
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Kompleksitas Waktu:</span>
                                  <span className="font-mono font-medium">{benchmarks.original.timeComplexity}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Kompleksitas Ruang:</span>
                                  <span className="font-mono font-medium">{benchmarks.original.spaceComplexity}</span>
                                </div>
                                {benchmarks.original.performance && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Performa:</span>
                                    <span>{benchmarks.original.performance}</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card className="border-2 border-emerald-200">
                            <CardContent className="pt-6">
                              <h4 className="text-base font-medium mb-4 flex items-center">
                                <Zap className="mr-2 text-emerald-600" /> Kode Dioptimasi
                              </h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Kompleksitas Waktu:</span>
                                  <span className="font-mono font-medium">{benchmarks.optimized.timeComplexity}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Kompleksitas Ruang:</span>
                                  <span className="font-mono font-medium">{benchmarks.optimized.spaceComplexity}</span>
                                </div>
                                {benchmarks.optimized.performance && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Performa:</span>
                                    <span>{benchmarks.optimized.performance}</span>
                                  </div>
                                )}
                                {benchmarks.optimized.improvement && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Peningkatan:</span>
                                    <span className="text-emerald-600 font-medium">{benchmarks.optimized.improvement}</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[400px] text-gray-500">
                        <p>Analisis kompleksitas akan muncul setelah kode dioptimasi</p>
                      </div>
                    )}
                  </TabsContent>
                )}
                
                {includeExplanations && (
                  <TabsContent value="explanation" className="border rounded-md p-4">
                    {explanation ? (
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Penjelasan Optimasi:</h3>
                        <div className="prose prose-sm max-w-none">
                          {explanation.split('\n').map((paragraph, idx) => (
                            <p key={idx}>{paragraph}</p>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-[400px] text-gray-500">
                        <p>Penjelasan akan muncul setelah kode dioptimasi</p>
                      </div>
                    )}
                  </TabsContent>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}