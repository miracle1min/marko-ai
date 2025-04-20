import { useState, useEffect } from "react";
import { Copy, ArrowUpDown, Trash, Upload, Download, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";

export default function Base64Tool() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [activeTab, setActiveTab] = useState<"encode" | "decode">("encode");
  const [isFile, setIsFile] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const { toast } = useToast();

  // Process input text whenever it changes or mode changes
  useEffect(() => {
    processText();
  }, [inputText, activeTab]);

  // Function to handle text processing (encode or decode)
  const processText = () => {
    if (!inputText) {
      setOutputText("");
      return;
    }

    try {
      if (activeTab === "encode") {
        // For files, we need to handle them differently
        if (isFile) {
          // File content is already in inputText as base64
          // Just set it as output
          setOutputText(inputText);
        } else {
          // For text, use standard btoa
          setOutputText(btoa(unescape(encodeURIComponent(inputText))));
        }
      } else {
        // Decoding
        try {
          // For text decoding
          const decoded = decodeURIComponent(escape(atob(inputText)));
          setOutputText(decoded);
          // Check if it might be a file (binary content)
          const isProbablyBinary = containsBinaryData(decoded);
          if (isProbablyBinary && !isFile) {
            setOutputText("Data terlihat seperti file biner. Gunakan tombol 'Download' untuk mengunduh.");
          }
        } catch (e) {
          setOutputText("Error: Input bukan Base64 yang valid.");
        }
      }
    } catch (error) {
      if (activeTab === "encode") {
        setOutputText("Error: Tidak dapat meng-encode teks.");
      } else {
        setOutputText("Error: Input bukan Base64 yang valid.");
      }
    }
  };

  // Check if a string likely contains binary data
  const containsBinaryData = (str: string): boolean => {
    // Simple heuristic: check for a high percentage of non-printable characters
    let nonPrintableCount = 0;
    for (let i = 0; i < Math.min(str.length, 100); i++) {
      const code = str.charCodeAt(i);
      if (code < 32 || code > 126) {
        nonPrintableCount++;
      }
    }
    return nonPrintableCount > 10; // If more than 10% of first 100 chars are non-printable
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileType(file.type);
    setIsFile(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      // Remove the prefix from data URL to get the raw base64
      const base64String = result.split(',')[1];
      setInputText(base64String);
      setActiveTab("encode"); // Switch to encode mode for files
    };
    reader.readAsDataURL(file);

    toast({
      title: "File uploaded",
      description: `${file.name} telah siap untuk dikonversi.`,
    });
  };

  // Download file from base64
  const handleDownload = () => {
    if (!outputText) return;

    try {
      let downloadData, fileExt;

      if (activeTab === "encode") {
        // Download as .txt file with the base64 content
        downloadData = `data:text/plain;base64,${outputText}`;
        fileExt = "txt";
      } else {
        // For decode, try to reconstruct the original file
        if (isFile && fileType) {
          downloadData = `data:${fileType};base64,${inputText}`;
          fileExt = fileName.split('.').pop() || "bin";
        } else {
          // Just a text file with the decoded content
          const blob = new Blob([outputText], { type: 'text/plain' });
          downloadData = URL.createObjectURL(blob);
          fileExt = "txt";
        }
      }

      const link = document.createElement('a');
      link.href = downloadData;
      link.download = `base64_${activeTab === "encode" ? "encoded" : "decoded"}.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "File downloaded",
        description: `Base64 ${activeTab === "encode" ? "encoded" : "decoded"} file telah diunduh.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Tidak dapat mengunduh file. Periksa input Anda.",
        variant: "destructive",
      });
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Disalin!",
      description: "Teks telah disalin ke clipboard.",
    });
  };

  // Clear input and output
  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setIsFile(false);
    setFileName("");
    setFileType("");
  };

  // Switch between encode and decode
  const handleSwitch = () => {
    setActiveTab(activeTab === "encode" ? "decode" : "encode");
    // Also swap input and output
    setInputText(outputText);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-0 dark:bg-slate-900">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Base64 Encoder/Decoder", path: "/tools/base64", isActive: true }
        ]} 
      />
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-2">
          Base64 Encoder/Decoder
        </h1>
        <p className="text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
          Tool gratis untuk mengkonversi teks atau file ke format Base64 dan sebaliknya. 
          Proses encoding dan decoding dilakukan di browser Anda, data Anda aman.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-slate-50">
                {activeTab === "encode" ? "Teks Original" : "Base64 Input"}
              </h2>
              <div className="flex space-x-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <Button size="sm" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </Button>
                </label>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!inputText}
                  onClick={handleClear}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
            
            {isFile && (
              <Alert className="mb-4 bg-blue-50 dark:bg-slate-800 border-blue-200 dark:border-blue-800">
                <AlertDescription className="text-sm">
                  File: <span className="font-semibold">{fileName}</span> siap untuk di{activeTab === "encode" ? "encode" : "decode"}
                </AlertDescription>
              </Alert>
            )}
            
            <Textarea
              placeholder={activeTab === "encode" 
                ? "Masukkan teks yang ingin dikonversi ke Base64..." 
                : "Masukkan Base64 yang ingin didekode..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[300px] font-mono text-sm dark:bg-slate-800"
            />
            
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                className="mx-auto dark:border-slate-700 dark:text-slate-300"
                onClick={handleSwitch}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Tukar {activeTab === "encode" ? "Encode" : "Decode"}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Output Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-slate-50">
                {activeTab === "encode" ? "Hasil Base64" : "Hasil Decoded"}
              </h2>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={!outputText}
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  disabled={!outputText}
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
            
            <Textarea
              readOnly
              value={outputText}
              className="min-h-[300px] font-mono text-sm dark:bg-slate-800"
            />
            
            <div className="flex justify-center mt-4">
              <Tabs defaultValue={activeTab} className="w-fit" onValueChange={(value) => setActiveTab(value as "encode" | "decode")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="encode">Encode</TabsTrigger>
                  <TabsTrigger value="decode">Decode</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Information Section */}
      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-slate-50">Tentang Base64 Encoding</h2>
            <div className="text-gray-700 dark:text-slate-300 space-y-3">
              <p>
                <strong>Apa itu Base64?</strong> Base64 adalah skema pengkodean biner-ke-teks yang merepresentasikan data biner dalam format ASCII dengan menerjemahkan data ke dalam representasi base64.
              </p>
              <p>
                <strong>Kasus Penggunaan:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Mengirim data biner melalui media yang hanya mendukung teks</li>
                <li>Menyematkan gambar dalam dokumen HTML atau CSS</li>
                <li>Mengkodekan email lampiran</li>
                <li>Menyimpan data biner dalam format JSON</li>
                <li>Menambahkan data dalam URL (data URI)</li>
              </ul>
              <p>
                <strong>Catatan Penting:</strong> Base64 <em>bukan</em> metode enkripsi, melainkan hanya pengkodean. Ini tidak menyediakan keamanan apa pun.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}