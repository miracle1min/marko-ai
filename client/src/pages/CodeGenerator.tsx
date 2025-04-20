import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Code,
  FileCode,
  Terminal,
  RefreshCw,
  Copy,
  Check,
  Download,
  Settings,
  Tag,
  Package,
  Sparkles,
  AlignLeft,
  LayoutTemplate
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { generateCode } from "@/lib/geminiApi";
import { CodeGenerationRequest } from "@/lib/types";

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
  { value: "html", label: "HTML", extension: "html" },
  { value: "css", label: "CSS", extension: "css" },
  { value: "sql", label: "SQL", extension: "sql" }
];

// Daftar jenis kode yang bisa dibuat
const codeTypes = [
  { value: "function", label: "Function / Method" },
  { value: "class", label: "Class / Object" },
  { value: "api", label: "API Endpoint" },
  { value: "algorithm", label: "Algorithm" },
  { value: "data_structure", label: "Data Structure" },
  { value: "boilerplate", label: "Boilerplate / Starter Code" },
  { value: "utility", label: "Utility" },
  { value: "database", label: "Database Query" },
  { value: "form", label: "Form Validation" },
  { value: "auth", label: "Authentication" },
  { value: "component", label: "UI Component" }
];

// Daftar frameworks/libraries
const frameworks = [
  // JavaScript/TypeScript
  { value: "react", label: "React", language: "javascript" },
  { value: "vue", label: "Vue.js", language: "javascript" },
  { value: "angular", label: "Angular", language: "typescript" },
  { value: "nextjs", label: "Next.js", language: "typescript" },
  { value: "express", label: "Express.js", language: "javascript" },
  { value: "nestjs", label: "NestJS", language: "typescript" },
  
  // Python
  { value: "django", label: "Django", language: "python" },
  { value: "flask", label: "Flask", language: "python" },
  { value: "fastapi", label: "FastAPI", language: "python" },
  
  // Java
  { value: "spring", label: "Spring", language: "java" },
  { value: "springboot", label: "Spring Boot", language: "java" },
  
  // C#
  { value: "aspnet", label: "ASP.NET", language: "csharp" },
  { value: "blazor", label: "Blazor", language: "csharp" },
  
  // PHP
  { value: "laravel", label: "Laravel", language: "php" },
  { value: "symfony", label: "Symfony", language: "php" },
  
  // Ruby
  { value: "rails", label: "Ruby on Rails", language: "ruby" },
  
  // Go
  { value: "gin", label: "Gin", language: "go" },
  { value: "echo", label: "Echo", language: "go" },
  
  // None
  { value: "none", label: "None (Standard Library)", language: "all" }
];

export default function CodeGenerator() {
  const [language, setLanguage] = useState("javascript");
  const [codeType, setCodeType] = useState("function");
  const [framework, setFramework] = useState("none");
  const [description, setDescription] = useState("");
  const [functionName, setFunctionName] = useState("");
  const [parameters, setParameters] = useState("");
  const [includeComments, setIncludeComments] = useState(true);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeTests, setIncludeTests] = useState(false);
  
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  
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
  
  // Get available frameworks for the selected language
  const getAvailableFrameworks = () => {
    return frameworks.filter(fw => fw.language === language || fw.language === "all");
  };
  
  // Menggunakan API Gemini untuk menghasilkan kode
  const codeMutation = useMutation({
    mutationFn: async (data: CodeGenerationRequest) => {
      return generateCode(data);
    },
    onSuccess: (data) => {
      // Periksa apakah data.code itu string atau objek
      const codeContent = typeof data === 'object' && data !== null
        ? (typeof data.code === 'string' 
           ? data.code 
           : ((data.code as any)?.code || "// Error dalam memproses kode"))
        : "// Error dalam memproses kode";
        
      // Hapus markdown backticks jika ada
      const cleanedCode = codeContent.replace(/^```[\w]*\n|```$/g, '');
      
      setGeneratedCode(cleanedCode);
      toast({
        title: "Kode Berhasil Dibuat",
        description: "Kode telah berhasil digenerate menggunakan Marko AI",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Gagal membuat kode: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleGenerateCode = () => {
    if (!codeType) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Harap pilih jenis kode terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    
    if (!description.trim()) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Harap isi deskripsi kode yang ingin dibuat",
        variant: "destructive",
      });
      return;
    }
    
    const data: CodeGenerationRequest = {
      language,
      codeType,
      framework,
      description,
      functionName: functionName || undefined,
      parameters: parameters || undefined,
      includeComments,
      includeExamples, 
      includeTests
    };
    
    codeMutation.mutate(data);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast({
      title: "Disalin!",
      description: "Kode telah disalin ke clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const extension = getLanguageExtension();
    const blob = new Blob([generatedCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${functionName || 'generated_code'}.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "File Diunduh",
      description: `Kode telah diunduh sebagai ${functionName || 'generated_code'}.${extension}`,
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Code Generator", path: "/tools/code-generator", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Code className="text-blue-700 mr-2" /> 
          Code Generator
        </h1>
        <p className="text-gray-600 mt-2">
          Buat kode berkualitas tinggi dari berbagai bahasa pemrograman dengan bantuan Marko AI
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FileCode className="mr-2 text-blue-700" /> Spesifikasi Kode
                </h2>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="mb-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="options">Options</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div>
                    <Label htmlFor="language" className="flex items-center">
                      <Terminal className="h-4 w-4 mr-2" /> Bahasa Pemrograman
                    </Label>
                    <Select 
                      value={language} 
                      onValueChange={(value) => {
                        setLanguage(value);
                        // Reset framework when language changes
                        setFramework("none");
                      }}
                    >
                      <SelectTrigger id="language">
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
                  </div>
                  
                  <div>
                    <Label htmlFor="code-type" className="flex items-center">
                      <LayoutTemplate className="h-4 w-4 mr-2" /> Jenis Kode
                    </Label>
                    <Select value={codeType} onValueChange={setCodeType}>
                      <SelectTrigger id="code-type">
                        <SelectValue placeholder="Pilih jenis kode" />
                      </SelectTrigger>
                      <SelectContent>
                        {codeTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="framework" className="flex items-center">
                      <Package className="h-4 w-4 mr-2" /> Framework/Library
                    </Label>
                    <Select 
                      value={framework} 
                      onValueChange={setFramework}
                      disabled={getAvailableFrameworks().length <= 1}
                    >
                      <SelectTrigger id="framework">
                        <SelectValue placeholder="Pilih framework/library" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableFrameworks().map((fw) => (
                          <SelectItem key={fw.value} value={fw.value}>
                            {fw.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="flex items-center">
                      <AlignLeft className="h-4 w-4 mr-2" /> Deskripsi
                    </Label>
                    <Textarea 
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Jelaskan apa yang ingin Anda buat, misalnya: Function untuk mengkonversi string menjadi JSON"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4">
                  <div>
                    <Label htmlFor="function-name" className="flex items-center">
                      <Tag className="h-4 w-4 mr-2" /> Nama {codeType === "class" ? "Class" : "Function"}
                    </Label>
                    <Input 
                      id="function-name"
                      value={functionName}
                      onChange={(e) => setFunctionName(e.target.value)}
                      placeholder={codeType === "class" ? "MyClass" : "myFunction"}
                    />
                  </div>
                  
                  {codeType === "function" && (
                    <div>
                      <Label htmlFor="parameters" className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" /> Parameter (pisahkan dengan koma)
                      </Label>
                      <Input 
                        id="parameters"
                        value={parameters}
                        onChange={(e) => setParameters(e.target.value)}
                        placeholder="param1, param2, param3"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {language === "typescript" || language === "java" ? 
                          "Anda dapat menentukan tipe data, misalnya: string name, int age" : 
                          "Masukkan nama parameter, pisahkan dengan koma"}
                      </p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="options" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-comments" className="flex items-center">
                      <AlignLeft className="h-4 w-4 mr-2" /> Sertakan Komentar
                    </Label>
                    <Switch
                      id="include-comments"
                      checked={includeComments}
                      onCheckedChange={setIncludeComments}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-examples" className="flex items-center">
                      <Code className="h-4 w-4 mr-2" /> Sertakan Contoh Penggunaan
                    </Label>
                    <Switch
                      id="include-examples"
                      checked={includeExamples}
                      onCheckedChange={setIncludeExamples}
                    />
                  </div>
                  
                  {codeType !== "api" && codeType !== "class" && (
                    <div className="flex items-center justify-between">
                      <Label htmlFor="include-tests" className="flex items-center">
                        <Code className="h-4 w-4 mr-2" /> Sertakan Unit Test
                      </Label>
                      <Switch
                        id="include-tests"
                        checked={includeTests}
                        onCheckedChange={setIncludeTests}
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <Button 
                className="w-full mt-0 bg-blue-700 hover:bg-blue-800" 
                onClick={handleGenerateCode}
                disabled={codeMutation.isPending}
              >
                {codeMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Sedang Membuat Kode...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" /> Generate Kode
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <Terminal className="mr-2 text-blue-700" /> Hasil Kode
                </h2>
                {generatedCode && (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={handleCopy} className="flex items-center">
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" /> Disalin
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" /> Salin
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={handleDownload} className="flex items-center">
                      <Download className="h-4 w-4 mr-2" /> Unduh
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="relative rounded-md border min-h-[500px] max-h-[700px] overflow-auto">
                {codeMutation.isPending ? (
                  <div className="text-center p-12">
                    <RefreshCw className="h-12 w-12 animate-spin text-blue-700 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Sedang membuat kode dengan Marko AI...</p>
                    <p className="text-gray-400 text-sm mt-2">Hal ini mungkin membutuhkan beberapa detik</p>
                  </div>
                ) : generatedCode ? (
                  <SyntaxHighlighter 
                    language={getPrismLanguage(language)}
                    style={theme === "dark" ? vscDarkPlus : vs}
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      borderRadius: '0.375rem',
                      minHeight: '500px',
                      maxHeight: '700px',
                    }}
                  >
                    {generatedCode}
                  </SyntaxHighlighter>
                ) : (
                  <div className="text-center p-12 text-gray-400">
                    <Code className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                    <p className="font-medium">Kode akan muncul di sini</p>
                    <p className="text-sm mt-2">Tentukan spesifikasi kode dan klik "Generate Kode"</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}