import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Code,
  FileCode,
  TerminalSquare,
  RefreshCw,
  Copy,
  Check,
  Download,
  PlayCircle,
  Settings,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

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

// Opsi debug
const debugOptions = [
  { value: "find_bugs", label: "Menemukan Bug" },
  { value: "optimize", label: "Optimasi Kode" },
  { value: "refactor", label: "Refactoring Kode" },
  { value: "add_comments", label: "Menambahkan Komentar" },
  { value: "explain", label: "Menjelaskan Kode" },
  { value: "convert", label: "Konversi ke Bahasa Lain" }
];

export default function CodeDebugger() {
  const [language, setLanguage] = useState("javascript");
  const [codeInput, setCodeInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [debugOption, setDebugOption] = useState("find_bugs");
  const [targetLanguage, setTargetLanguage] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [copied, setCopied] = useState(false);
  
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
  
  // Simulasi API untuk demo
  const codeMutation = useMutation({
    mutationFn: async (data: any) => {
      // Simulasi delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Contoh hasil
      let result = "";
      let explanation = "";
      
      if (debugOption === "find_bugs") {
        if (language === "javascript" || language === "typescript") {
          result = codeInput
            .replace(/console.log/g, "// Gunakan logger service sebagai gantinya\n// logger.info")
            .replace(/var /g, "const ")
            .replace(/for \(var/g, "for (let")
            .replace(/==(?!=)/g, "===");
            
          explanation = "Beberapa masalah yang ditemukan:\n\n" +
            "1. Penggunaan `console.log` sebaiknya diganti dengan layanan logger yang proper\n" +
            "2. Ganti penggunaan `var` dengan `const` atau `let` untuk menghindari hoisting\n" +
            "3. Gunakan operator perbandingan strict `===` sebagai ganti `==`\n" +
            "4. Usahakan untuk menambahkan penanganan error dengan try/catch";
        } else if (language === "python") {
          result = codeInput
            .replace(/print\s*\(/g, "# Consider using logging module\nlogging.info(")
            .replace(/except:/g, "except Exception as e:")
            .replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^=\n]+)/g, "$1 = $2  # Consider adding type hints");
            
          explanation = "Beberapa masalah yang ditemukan:\n\n" +
            "1. Gunakan modul `logging` sebagai pengganti print statements\n" +
            "2. Hindari bare except, selalu tentukan jenis exception\n" +
            "3. Pertimbangkan untuk menambahkan type hints pada variabel\n" +
            "4. Sebaiknya tambahkan docstrings untuk fungsi dan class";
        } else {
          result = codeInput;
          explanation = "Analisis kode mendeteksi beberapa kemungkinan masalah dengan kode ini.";
        }
      } else if (debugOption === "optimize") {
        result = codeInput;
        explanation = "Kode telah dioptimasi untuk performa yang lebih baik:\n\n" +
          "1. Menghindari perulangan yang tidak perlu\n" +
          "2. Menggunakan struktur data yang lebih efisien\n" +
          "3. Mengurangi operasi yang tidak perlu";
      } else if (debugOption === "refactor") {
        if (language === "javascript" || language === "typescript") {
          result = codeInput
            .replace(/function ([a-zA-Z_][a-zA-Z0-9_]*)/g, "const $1 = (")
            .replace(/\) {/g, ") => {")
            .replace(/var /g, "const ");
            
          explanation = "Kode telah direfaktor untuk readability dan maintainability yang lebih baik:\n\n" +
            "1. Mengubah function declarations menjadi arrow functions\n" +
            "2. Menggunakan const sebagai ganti var\n" +
            "3. Struktur kode diatur agar lebih mudah dibaca";
        } else {
          result = codeInput;
          explanation = "Kode telah direfaktor untuk meningkatkan keterbacaan dan pemeliharaan.";
        }
      } else if (debugOption === "add_comments") {
        // Simulasi penambahan komentar
        const lines = codeInput.split("\n");
        if (language === "javascript" || language === "typescript") {
          result = "/**\n * Main function responsible for processing data\n * @param {Object} data - The input data to process\n * @returns {Object} The processed data\n */\n" + 
            codeInput.replace(/function/g, "// Function declaration\nfunction")
                    .replace(/for\s*\(/g, "// Loop through items\nfor (")
                    .replace(/if\s*\(/g, "// Conditional check\nif (");
        } else if (language === "python") {
          result = "'''\nMain module for data processing\n'''\n\n" + 
            codeInput.replace(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, "# Function to handle business logic\ndef $1")
                    .replace(/for\s+/g, "# Iteration loop\nfor ")
                    .replace(/if\s+/g, "# Conditional logic\nif ");
        } else {
          result = codeInput;
        }
        
        explanation = "Komentar telah ditambahkan ke kode untuk meningkatkan dokumentasi:\n\n" +
          "1. Dokumentasi header untuk fungsi utama\n" +
          "2. Komentar inline untuk menjelaskan blok kode penting\n" +
          "3. Penjelasan untuk variabel dan fungsi kunci";
      } else if (debugOption === "explain") {
        result = codeInput;
        
        if (language === "javascript" || language === "typescript") {
          explanation = "Penjelasan Kode:\n\n" +
            "Kode ini adalah aplikasi JavaScript yang melakukan operasi tertentu. " +
            "Berikut adalah penjelasan bagian per bagian:\n\n" +
            "1. Fungsi-fungsi utama digunakan untuk memproses data\n" +
            "2. Perulangan digunakan untuk iterasi melalui data\n" +
            "3. Kondisional digunakan untuk validasi dan filter\n" +
            "4. Ada beberapa variabel yang menyimpan state atau hasil operasi";
        } else if (language === "python") {
          explanation = "Penjelasan Kode:\n\n" +
            "Ini adalah skrip Python yang sepertinya berfungsi untuk: \n\n" +
            "1. Fungsi-fungsi didefinisikan untuk memproses dan memanipulasi data\n" +
            "2. Beberapa library diimport untuk fungsionalitas tambahan\n" +
            "3. Operasi file tampaknya dilakukan untuk membaca atau menulis data\n" +
            "4. Ada beberapa struktur kontrol untuk menangani logika bisnis";
        } else {
          explanation = "Penjelasan kode secara detail:";
        }
      } else if (debugOption === "convert") {
        if (targetLanguage) {
          if (language === "javascript" && targetLanguage === "python") {
            // Simulasi konversi JS ke Python
            result = codeInput
              .replace(/const /g, "")
              .replace(/let /g, "")
              .replace(/var /g, "")
              .replace(/function /g, "def ")
              .replace(/{/g, ":")
              .replace(/}/g, "")
              .replace(/;/g, "")
              .replace(/console.log/g, "print")
              .replace(/===?/g, "==")
              .replace(/!==?/g, "!=")
              .replace(/\(\)/g, "()")
              .replace(/\[\]/g, "[]")
              .replace(/\.\s*length/g, ".len()");
          } else if (language === "python" && targetLanguage === "javascript") {
            // Simulasi konversi Python ke JS
            result = codeInput
              .replace(/def /g, "function ")
              .replace(/:/g, " {")
              .replace(/print/g, "console.log")
              .replace(/elif/g, "} else if (")
              .replace(/if /g, "if (")
              .replace(/else:/g, "} else {")
              .replace(/for /g, "for (")
              .replace(/#/g, "//");
              
            // Add closing braces
            const braces = result.match(/{/g) || [];
            for (let i = 0; i < braces.length; i++) {
              result += "\n}";
            }
          } else {
            result = codeInput;
          }
          
          explanation = `Kode telah dikonversi dari ${
            programmingLanguages.find(lang => lang.value === language)?.label
          } ke ${
            programmingLanguages.find(lang => lang.value === targetLanguage)?.label
          }.\n\nPerhatikan bahwa ini adalah konversi otomatis dan mungkin memerlukan penyesuaian manual tambahan.`;
        } else {
          result = codeInput;
          explanation = "Silakan pilih bahasa target untuk konversi.";
        }
      }
      
      return { 
        result,
        explanation
      };
    },
    onSuccess: (data) => {
      setCodeOutput(data.result);
      setExplanation(data.explanation);
      toast({
        title: "Analisis Kode Selesai",
        description: "Kode telah berhasil dianalisis menggunakan Marko AI",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: `Gagal menganalisis kode: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleDebug = () => {
    if (!codeInput.trim()) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Harap masukkan kode yang ingin dianalisis terlebih dahulu",
        variant: "destructive",
      });
      return;
    }
    
    const data = {
      language,
      codeInput,
      errorMessage,
      debugOption,
      targetLanguage: debugOption === "convert" ? targetLanguage : undefined,
    };
    
    codeMutation.mutate(data);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(codeOutput);
    setCopied(true);
    toast({
      title: "Disalin!",
      description: "Kode telah disalin ke clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const extension = getLanguageExtension();
    const blob = new Blob([codeOutput], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fixed_code.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "File Diunduh",
      description: `Kode telah diunduh sebagai fixed_code.${extension}`,
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-6">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Code Debugger", path: "/tools/code-debugger", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Code className="text-indigo-600 mr-2" /> 
          Marko AI Code Debugger
        </h1>
        <p className="text-gray-600 mt-2">
          Debug, optimasi, dan analisis kode Anda dengan bantuan Marko AI
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
                  <TabsTrigger value="error" className="relative">
                    Error
                    {errorMessage && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="options">Opsi</TabsTrigger>
                </TabsList>
                
                <TabsContent value="code" className="border rounded-md">
                  <Textarea 
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder={`Masukkan kode ${programmingLanguages.find(lang => lang.value === language)?.label || ''} Anda di sini...`}
                    className="font-mono text-sm min-h-[400px] resize-none border-0 focus-visible:ring-0"
                  />
                </TabsContent>
                
                <TabsContent value="error" className="border rounded-md p-4">
                  <div className="mb-3">
                    <label htmlFor="error-message" className="text-sm font-medium text-gray-700 flex items-center">
                      <HelpCircle className="h-4 w-4 mr-1" />
                      Pesan Error (opsional)
                    </label>
                    <Textarea 
                      id="error-message"
                      value={errorMessage}
                      onChange={(e) => setErrorMessage(e.target.value)}
                      placeholder="Tempel pesan error di sini untuk analisis yang lebih baik..."
                      className="mt-1 min-h-[350px] resize-none"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="options" className="border rounded-md p-4">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="debug-option" className="block text-sm font-medium text-gray-700">
                        Opsi Debug/Analisis
                      </label>
                      <Select value={debugOption} onValueChange={setDebugOption}>
                        <SelectTrigger id="debug-option" className="mt-1">
                          <SelectValue placeholder="Pilih opsi debug" />
                        </SelectTrigger>
                        <SelectContent>
                          {debugOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {debugOption === "convert" && (
                      <div>
                        <label htmlFor="target-language" className="block text-sm font-medium text-gray-700">
                          Bahasa Target
                        </label>
                        <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                          <SelectTrigger id="target-language" className="mt-1">
                            <SelectValue placeholder="Pilih bahasa target" />
                          </SelectTrigger>
                          <SelectContent>
                            {programmingLanguages
                              .filter(lang => lang.value !== language)
                              .map((lang) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                  {lang.label}
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <Button 
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700" 
                onClick={handleDebug}
                disabled={!codeInput || codeMutation.isPending}
              >
                {codeMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Sedang Menganalisis Kode...
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" /> Analisis Kode
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
                  <TerminalSquare className="mr-2 text-indigo-600" /> Hasil
                </h2>
                <div className="flex space-x-2">
                  {codeOutput && (
                    <>
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
                    </>
                  )}
                </div>
              </div>
              
              <Tabs defaultValue="result" className="w-full">
                <TabsList className="mb-3">
                  <TabsTrigger value="result">Hasil</TabsTrigger>
                  <TabsTrigger value="explanation">Penjelasan</TabsTrigger>
                </TabsList>
                
                <TabsContent value="result" className="border rounded-md max-h-[550px] overflow-auto">
                  {codeMutation.isPending ? (
                    <div className="text-center p-12">
                      <RefreshCw className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Sedang menganalisis kode dengan Marko AI...</p>
                      <p className="text-gray-400 text-sm mt-2">Hal ini mungkin membutuhkan beberapa detik</p>
                    </div>
                  ) : codeOutput ? (
                    <SyntaxHighlighter 
                      language={getPrismLanguage(debugOption === "convert" ? targetLanguage || language : language)}
                      style={theme === "dark" ? vscDarkPlus : vs}
                      showLineNumbers
                      wrapLines
                      customStyle={{margin: 0, borderRadius: '0.375rem', minHeight: '440px'}}
                    >
                      {codeOutput}
                    </SyntaxHighlighter>
                  ) : (
                    <div className="text-center p-12 text-gray-400">
                      <Code className="h-12 w-12 mx-auto mb-4 text-indigo-200" />
                      <p className="font-medium">Hasil analisis kode akan muncul di sini</p>
                      <p className="text-sm mt-2">Silakan masukkan kode dan klik tombol "Analisis Kode"</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="explanation" className="border rounded-md p-4 max-h-[550px] overflow-auto">
                  {codeMutation.isPending ? (
                    <div className="text-center p-12">
                      <RefreshCw className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium">Sedang menganalisis kode dengan Marko AI...</p>
                      <p className="text-gray-400 text-sm mt-2">Hal ini mungkin membutuhkan beberapa detik</p>
                    </div>
                  ) : explanation ? (
                    <div className="whitespace-pre-wrap">
                      {explanation}
                    </div>
                  ) : (
                    <div className="text-center p-12 text-gray-400">
                      <HelpCircle className="h-12 w-12 mx-auto mb-4 text-indigo-200" />
                      <p className="font-medium">Penjelasan akan muncul di sini</p>
                      <p className="text-sm mt-2">Penjelasan detail tentang kode dan perubahan yang dilakukan</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}