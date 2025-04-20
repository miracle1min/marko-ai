import React, { useState, useEffect } from "react";
import { 
  FileText, Search, ArrowRight, HelpCircle, 
  FileDown, ClipboardCopy, Wand2, Pencil, 
  RefreshCcw, AlertCircle
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogDescription, 
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Badge 
} from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger
} from "@/components/ui/tooltip";
import { generateContract } from "@/lib/geminiApi";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";

export default function ContractGenerator() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [selectedClauses, setSelectedClauses] = useState<string[]>([]);
  const [contractTitle, setContractTitle] = useState("");
  const [placeholderValues, setPlaceholderValues] = useState<{[key: string]: string}>({});
  const [generatedContract, setGeneratedContract] = useState("");
  const [isGeneratingWithAI, setIsGeneratingWithAI] = useState(false);
  
  // AI Contract Generation States
  const [aiContractType, setAiContractType] = useState("");
  const [aiContractDetails, setAiContractDetails] = useState("");
  const [aiParty1, setAiParty1] = useState("");
  const [aiParty2, setAiParty2] = useState("");
  const [aiAdditionalClauses, setAiAdditionalClauses] = useState("");
  const [aiSpecificRequirements, setAiSpecificRequirements] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Filter templates based on search query
  const filteredTemplates = searchQuery.length > 0 
    ? contractTemplates.filter(template => {
        const searchLower = searchQuery.toLowerCase();
        return (
          template.name.toLowerCase().includes(searchLower) ||
          template.description.toLowerCase().includes(searchLower) ||
          template.category.toLowerCase().includes(searchLower) ||
          searchQuery === template.category // Exact match for category filtering
        );
      })
    : contractTemplates;

  // Set initial selected clauses when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      const requiredClauses = selectedTemplate.clauses
        .filter(clause => clause.isRequired)
        .map(clause => clause.id);
      
      setSelectedClauses(requiredClauses);
    }
  }, [selectedTemplate]);

  // Handle template selection
  const handleSelectTemplate = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    
    // Find required clauses
    const requiredClauses = template.clauses
      .filter(clause => clause.isRequired)
      .map(clause => clause.id);
    
    setSelectedClauses(requiredClauses);
    setStep(2);
  };

  // Handle clause selection toggle
  const handleToggleClause = (clauseId: string) => {
    // Find the clause
    const clause = selectedTemplate?.clauses.find(c => c.id === clauseId);
    
    // If the clause is required, cannot be toggled off
    if (clause?.isRequired) {
      return;
    }
    
    // Toggle the clause selection
    if (selectedClauses.includes(clauseId)) {
      setSelectedClauses(selectedClauses.filter(id => id !== clauseId));
    } else {
      setSelectedClauses([...selectedClauses, clauseId]);
    }
  };

  // Update placeholders
  const handleUpdatePlaceholder = (key: string, value: string) => {
    setPlaceholderValues({
      ...placeholderValues,
      [key]: value
    });
  };

  // Generate contract from selected template and placeholder values
  const generateContractFromTemplate = () => {
    if (!selectedTemplate) return;
    
    // Get selected clauses content
    const selectedClausesContent = selectedTemplate.clauses
      .filter(clause => selectedClauses.includes(clause.id))
      .map(clause => {
        let content = clause.content;
        
        // Replace placeholders with their values
        selectedTemplate.placeholders.forEach(placeholder => {
          const value = placeholderValues[placeholder] || `[${placeholder}]`;
          const regex = new RegExp(`\\{${placeholder}\\}`, "g");
          content = content.replace(regex, value);
        });
        
        return content;
      })
      .join("\n\n");
    
    const formattedTitle = contractTitle 
      ? contractTitle.toUpperCase() 
      : selectedTemplate.name.toUpperCase();
    
    // Create contract text with title and content
    const contractText = `${formattedTitle}\n\n${selectedClausesContent}`;
    
    setGeneratedContract(contractText);
    setStep(4);
  };

  // Fill placeholders with sample data for testing
  const fillWithSampleData = () => {
    if (!selectedTemplate) return;
    
    const sampleData: {[key: string]: string} = {
      NAMA_PERUSAHAAN_1: "PT ABC Teknologi",
      ALAMAT_PERUSAHAAN_1: "Jl. Sudirman No. 123, Jakarta",
      NPWP_PERUSAHAAN_1: "01.234.567.8-123.000",
      NAMA_DIREKTUR_1: "Budi Santoso",
      JABATAN_1: "Direktur Utama",
      
      NAMA_PERUSAHAAN_2: "CV XYZ Digital",
      ALAMAT_PERUSAHAAN_2: "Jl. Gatot Subroto No. 456, Jakarta",
      NPWP_PERUSAHAAN_2: "98.765.432.1-456.000",
      NAMA_DIREKTUR_2: "Dewi Suryani",
      JABATAN_2: "Direktur",
      
      JANGKA_WAKTU: "12 (dua belas) bulan",
      TANGGAL_MULAI: "1 Januari 2023",
      TANGGAL_BERAKHIR: "31 Desember 2023",
      NILAI_KONTRAK: "Rp 150.000.000,- (seratus lima puluh juta Rupiah)",
      METODE_PEMBAYARAN: "transfer bank",
      NOMOR_REKENING: "123456789",
      NAMA_BANK: "Bank XYZ",
      ATAS_NAMA: "PT ABC Teknologi",
      TANGGAL_EFEKTIF: "1 Januari 2023",
      LOKASI_PENANDATANGANAN: "Jakarta",
      TANGGAL_PENANDATANGANAN: "20 Desember 2022",
    };
    
    // Only set values for placeholders that exist in the template
    const filteredData: {[key: string]: string} = {};
    selectedTemplate.placeholders.forEach(placeholder => {
      if (sampleData[placeholder]) {
        filteredData[placeholder] = sampleData[placeholder];
      }
    });
    
    setPlaceholderValues(filteredData);
  };

  // Clear all placeholder values
  const clearPlaceholderValues = () => {
    setPlaceholderValues({});
  };

  // Copy contract text to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContract);
    toast({
      title: "Teks disalin",
      description: "Teks kontrak telah disalin ke clipboard",
    });
  };

  // Download contract as PDF
  const downloadAsPdf = () => {
    const doc = new jsPDF();
    
    // Split text into lines for better wrapping
    const lines = generatedContract.split("\n");
    
    let y = 20; // Starting y position
    let pageHeight = doc.internal.pageSize.height - 20; // Available height
    
    // Add title centered and bold
    const title = lines[0];
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text(title, doc.internal.pageSize.width / 2, y, { align: 'center' });
    y += 15;
    
    // Reset to normal font for the rest of the text
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    
    // Add rest of the lines
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if need to add a new page
      if (y > pageHeight) {
        doc.addPage();
        y = 20; // Reset y position for new page
      }
      
      if (line.trim() === '') {
        y += 8; // Add space for empty lines
      } else {
        const splitText = doc.splitTextToSize(line, 170);
        doc.text(splitText, 20, y);
        y += 8 * splitText.length;
      }
    }
    
    // Save the PDF
    doc.save(`kontrak_${new Date().getTime()}.pdf`);
    
    toast({
      title: "PDF diunduh",
      description: "Dokumen kontrak telah diunduh sebagai file PDF",
    });
  };

  // Group placeholders by their prefix (before first underscore)
  const groupPlaceholders = (placeholders: string[]) => {
    const groups: {[key: string]: string[]} = {
      "Pihak Pertama": [],
      "Pihak Kedua": [],
      "Informasi Kontrak": [],
      "Lainnya": []
    };
    
    placeholders.forEach(placeholder => {
      if (placeholder.includes("PERUSAHAAN_1") || placeholder.includes("DIREKTUR_1") || placeholder.includes("_1")) {
        groups["Pihak Pertama"].push(placeholder);
      } else if (placeholder.includes("PERUSAHAAN_2") || placeholder.includes("DIREKTUR_2") || placeholder.includes("_2")) {
        groups["Pihak Kedua"].push(placeholder);
      } else if (placeholder.includes("KONTRAK") || placeholder.includes("WAKTU") || placeholder.includes("TANGGAL") || 
                placeholder.includes("NILAI") || placeholder.includes("PEMBAYARAN")) {
        groups["Informasi Kontrak"].push(placeholder);
      } else {
        groups["Lainnya"].push(placeholder);
      }
    });
    
    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });
    
    return groups;
  };

  // Reset the form
  const resetForm = () => {
    setStep(1);
    setSelectedTemplate(null);
    setSelectedClauses([]);
    setContractTitle("");
    setPlaceholderValues({});
    setGeneratedContract("");
    setAiContractType("");
    setAiContractDetails("");
    setAiParty1("");
    setAiParty2("");
    setAiAdditionalClauses("");
    setAiSpecificRequirements("");
    setIsAiGenerating(false);
    setIsGeneratingWithAI(false);
  };

  return (
    <div className="container max-w-5xl py-8">
      <div className="space-y-2 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Contract Generator</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Buat dokumen kontrak profesional sesuai kebutuhan Anda
        </p>
      </div>
      
      {/* Steps indicator */}
      <div className="mb-8">
        <div className="flex justify-center gap-1 sm:gap-2">
          {[1, 2, 3, 4].map((i) => (
            <React.Fragment key={i}>
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step === i
                    ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-100"
                    : step > i
                    ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-900/50 dark:text-green-100"
                    : "border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400"
                }`}
              >
                {step > i ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  i
                )}
              </div>
              {i < 4 && (
                <div 
                  className={`hidden sm:flex w-12 h-0.5 mt-5 ${
                    step > i ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-center gap-1 sm:gap-2 mt-2">
          <div className={`text-xs sm:text-sm font-medium ${step === 1 ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`} style={{ width: "80px", textAlign: "center" }}>
            Pilih Template
          </div>
          <div className={`text-xs sm:text-sm font-medium ${step === 2 ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`} style={{ width: "80px", textAlign: "center" }}>
            Pilih Klausa
          </div>
          <div className={`text-xs sm:text-sm font-medium ${step === 3 ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`} style={{ width: "80px", textAlign: "center" }}>
            Isi Informasi
          </div>
          <div className={`text-xs sm:text-sm font-medium ${step === 4 ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`} style={{ width: "80px", textAlign: "center" }}>
            Hasil Kontrak
          </div>
        </div>
      </div>
      
      {/* Step 1: Template Selection */}
      {step === 1 && (
        <div>
          {/* Tabs for selection method */}
          <Tabs defaultValue="manual" className="mb-6" onValueChange={(value) => setIsGeneratingWithAI(value === "ai")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="manual">
                <FileText className="w-4 h-4 mr-2" />
                Template Manual
              </TabsTrigger>
              <TabsTrigger value="ai">
                <Wand2 className="w-4 h-4 mr-2" />
                Buat dengan AI
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="manual">
              <div className="mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="flex-grow">
                    <Label htmlFor="searchQuery" className="mb-2 block">Cari Template</Label>
                    <div className="relative">
                      <Input
                        id="searchQuery"
                        placeholder="Cari berdasarkan nama, deskripsi, atau kategori..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                  </div>
                
                  <div className="w-full md:w-48">
                    <Label htmlFor="categoryFilter" className="mb-2 block">Kategori</Label>
                    <Select onValueChange={(value) => setSearchQuery(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Semua kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua kategori</SelectItem>
                        {templateCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category === "employment" && "Ketenagakerjaan"}
                            {category === "property" && "Properti"}
                            {category === "business" && "Bisnis"}
                            {category === "legal" && "Hukum"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-blue-500" />
                        {template.name}
                      </CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge className="mb-2">
                        {template.category === "employment" && "Ketenagakerjaan"}
                        {template.category === "property" && "Properti"}
                        {template.category === "business" && "Bisnis"}
                        {template.category === "legal" && "Hukum"}
                      </Badge>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {template.clauses.length} klausa tersedia
                      </p>
                    </CardContent>
                    <CardFooter className="border-t pt-4 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          
                          // Find the DialogTrigger element instead of using native dialog API
                          const dialogTrigger = document.getElementById(`dialog-${template.id}`);
                          if (dialogTrigger) {
                            dialogTrigger.click();
                          }
                        }}
                      >
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Detail
                      </Button>
                      <Button size="sm">
                        Pilih Template
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {filteredTemplates.length === 0 && (
                  <div className="col-span-3 text-center p-8">
                    <AlertCircle className="mx-auto h-10 w-10 text-gray-400" />
                    <p className="mt-2 text-lg font-medium">Template tidak ditemukan</p>
                    <p className="mt-1 text-gray-500 dark:text-gray-400">Coba kata kunci lain atau reset pencarian</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="ai">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wand2 className="mr-2 h-5 w-5 text-purple-500" />
                    Buat Kontrak dengan AI
                  </CardTitle>
                  <CardDescription>
                    Masukkan informasi kontrak dan biarkan AI membuatkan dokumen legal untuk Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="aiContractType">Jenis Kontrak</Label>
                      <Select 
                        value={aiContractType} 
                        onValueChange={setAiContractType}
                      >
                        <SelectTrigger id="aiContractType">
                          <SelectValue placeholder="Pilih jenis kontrak" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employment">Perjanjian Kerja</SelectItem>
                          <SelectItem value="rental">Perjanjian Sewa</SelectItem>
                          <SelectItem value="service">Perjanjian Jasa</SelectItem>
                          <SelectItem value="sale">Perjanjian Jual Beli</SelectItem>
                          <SelectItem value="nda">Perjanjian Kerahasiaan (NDA)</SelectItem>
                          <SelectItem value="loan">Perjanjian Pinjaman</SelectItem>
                          <SelectItem value="partnership">Perjanjian Kemitraan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aiContractDetails">Detail Kontrak</Label>
                      <Textarea 
                        id="aiContractDetails"
                        placeholder="Jelaskan rincian utama kontrak, termasuk tujuan, jangka waktu, nilai, dan informasi penting lainnya"
                        value={aiContractDetails}
                        onChange={(e) => setAiContractDetails(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="aiParty1">Informasi Pihak Pertama</Label>
                        <Textarea 
                          id="aiParty1"
                          placeholder="Nama, alamat, dan detail pihak pertama"
                          value={aiParty1}
                          onChange={(e) => setAiParty1(e.target.value)}
                          rows={3}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="aiParty2">Informasi Pihak Kedua</Label>
                        <Textarea 
                          id="aiParty2"
                          placeholder="Nama, alamat, dan detail pihak kedua"
                          value={aiParty2}
                          onChange={(e) => setAiParty2(e.target.value)}
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aiAdditionalClauses">Klausa Tambahan (Opsional)</Label>
                      <Textarea 
                        id="aiAdditionalClauses"
                        placeholder="Klausa khusus atau tambahan yang ingin disertakan"
                        value={aiAdditionalClauses}
                        onChange={(e) => setAiAdditionalClauses(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aiSpecificRequirements">Persyaratan Khusus (Opsional)</Label>
                      <Textarea 
                        id="aiSpecificRequirements"
                        placeholder="Persyaratan atau instruksi khusus untuk kontrak ini"
                        value={aiSpecificRequirements}
                        onChange={(e) => setAiSpecificRequirements(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    disabled={!aiContractType || !aiContractDetails || !aiParty1 || !aiParty2 || isAiGenerating}
                    onClick={async () => {
                      try {
                        setIsAiGenerating(true);
                        
                        const result = await generateContract({
                          contractType: aiContractType,
                          details: aiContractDetails,
                          party1: aiParty1,
                          party2: aiParty2,
                          additionalClauses: aiAdditionalClauses,
                          specificRequirements: aiSpecificRequirements
                        });
                        
                        if (result && result.content) {
                          setGeneratedContract(result.content);
                          setStep(4);
                          toast({
                            title: "Kontrak Berhasil Dibuat",
                            description: "Kontrak telah dibuat menggunakan AI sesuai dengan informasi yang Anda berikan.",
                          });
                        } else {
                          toast({
                            title: "Gagal Membuat Kontrak",
                            description: "Terjadi kesalahan saat membuat kontrak. Silakan coba lagi.",
                            variant: "destructive",
                          });
                        }
                      } catch (error) {
                        console.error("Error generating contract:", error);
                        toast({
                          title: "Gagal Membuat Kontrak",
                          description: "Terjadi kesalahan saat membuat kontrak. Silakan coba lagi.",
                          variant: "destructive",
                        });
                      } finally {
                        setIsAiGenerating(false);
                      }
                    }}
                  >
                    {isAiGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sedang Membuat Kontrak...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Buat Kontrak dengan AI
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Template preview dialogs */}
          {contractTemplates.map((template) => (
            <Dialog key={template.id}>
              <DialogTrigger id={`dialog-${template.id}`} className="hidden">
                Preview
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{template.name}</DialogTitle>
                  <DialogDescription>{template.description}</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                  <h3 className="font-medium mb-2">Klausa dalam template ini:</h3>
                  <Accordion type="multiple" className="w-full">
                    {template.clauses.map((clause) => (
                      <AccordionItem key={clause.id} value={clause.id}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center">
                            {clause.title}
                            {clause.isRequired && (
                              <Badge variant="secondary" className="ml-2">Wajib</Badge>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-300">
                            {clause.content}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
                <DialogFooter>
                  <Button onClick={() => handleSelectTemplate(template)}>
                    Gunakan Template Ini
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
      
      {/* Step 2: Clause Selection */}
      {step === 2 && selectedTemplate && (
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-500" />
                {selectedTemplate.name}
              </CardTitle>
              <CardDescription>{selectedTemplate.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Label htmlFor="contractTitle">Judul Kontrak (Opsional)</Label>
                <Input
                  id="contractTitle"
                  placeholder="Contoh: PERJANJIAN KERJA SAMA ANTARA PT XYZ DAN PT ABC"
                  value={contractTitle}
                  onChange={(e) => setContractTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium">Pilih Klausa yang Akan Dimasukkan</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Klausa dengan tanda <Badge variant="secondary" className="ml-1">Wajib</Badge> tidak dapat dihapus dari kontrak
                </p>
                
                <div className="space-y-4">
                  {selectedTemplate.clauses.map((clause) => (
                    <div 
                      key={clause.id}
                      className={`p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                        ${selectedClauses.includes(clause.id) ? 'border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                    >
                      <div className="flex items-start">
                        <div className="flex items-center h-5 mt-1">
                          <input
                            type="checkbox"
                            checked={selectedClauses.includes(clause.id)}
                            onChange={() => handleToggleClause(clause.id)}
                            disabled={clause.isRequired}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                          />
                        </div>
                        <div className="ml-3">
                          <div className="flex items-center">
                            <span className="font-medium">{clause.title}</span>
                            {clause.isRequired && (
                              <Badge variant="secondary" className="ml-2">Wajib</Badge>
                            )}
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="sm" className="mt-1 h-7 text-xs">
                                  Lihat isi
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="bottom" className="max-w-lg">
                                <p className="whitespace-pre-line text-sm">
                                  {clause.content.length > 300 
                                    ? clause.content.substring(0, 300) + "..." 
                                    : clause.content}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedTemplate(null);
                  setSelectedClauses([]);
                  setStep(1);
                }}
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Kembali
              </Button>
              <Button 
                onClick={() => setStep(3)}
                disabled={selectedClauses.length === 0}
              >
                Lanjutkan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Step 3: Fill Placeholders */}
      {step === 3 && selectedTemplate && (
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Lengkapi Informasi Kontrak</CardTitle>
              <CardDescription>
                Isi semua bidang berikut untuk menggantikan placeholder dalam template kontrak
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <Button variant="outline" size="sm" onClick={fillWithSampleData}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Isi dengan Data Contoh
                </Button>
                <Button variant="outline" size="sm" onClick={clearPlaceholderValues}>
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  Reset Semua Nilai
                </Button>
              </div>
              
              <Tabs defaultValue="form" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="form">Form</TabsTrigger>
                  <TabsTrigger value="table">Tabel</TabsTrigger>
                </TabsList>
                
                <TabsContent value="form">
                  {Object.entries(groupPlaceholders(selectedTemplate.placeholders)).map(([groupName, placeholders]) => (
                    <div key={groupName} className="mb-6">
                      <h3 className="text-lg font-medium mb-4">{groupName}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {placeholders.map((placeholder) => (
                          <div key={placeholder} className="space-y-2">
                            <Label htmlFor={placeholder}>
                              {placeholder.replace(/_/g, " ")}
                            </Label>
                            <Input
                              id={placeholder}
                              placeholder={`Masukkan ${placeholder.toLowerCase().replace(/_/g, " ")}`}
                              value={placeholderValues[placeholder] || ""}
                              onChange={(e) => handleUpdatePlaceholder(placeholder, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="table">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-1/3">Placeholder</TableHead>
                          <TableHead className="w-2/3">Nilai</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedTemplate.placeholders.map((placeholder) => (
                          <TableRow key={placeholder}>
                            <TableCell className="font-medium">
                              {placeholder.replace(/_/g, " ")}
                            </TableCell>
                            <TableCell>
                              <Input
                                placeholder={`Masukkan ${placeholder.toLowerCase().replace(/_/g, " ")}`}
                                value={placeholderValues[placeholder] || ""}
                                onChange={(e) => handleUpdatePlaceholder(placeholder, e.target.value)}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
              <Button 
                variant="outline" 
                onClick={() => setStep(2)}
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                Kembali
              </Button>
              <Button 
                onClick={generateContractFromTemplate}
              >
                Buat Kontrak
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Step 4: Generated Contract */}
      {step === 4 && generatedContract && (
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Kontrak Siap Digunakan</CardTitle>
              <CardDescription>
                Dokumen kontrak sudah siap digunakan. Anda dapat menyalin teks atau mengunduh sebagai PDF.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-6 whitespace-pre-line bg-white dark:bg-gray-900">
                {generatedContract}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0">
              <div>
                <Button 
                  variant="outline" 
                  onClick={resetForm}
                >
                  <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                  Buat Kontrak Baru
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                >
                  <ClipboardCopy className="h-4 w-4 mr-2" />
                  Salin Teks
                </Button>
                <Button
                  onClick={downloadAsPdf}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Unduh PDF
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
      
      {/* Information Section */}
      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 dark:text-slate-50">Tentang Contract Generator</h2>
            <div className="text-gray-700 dark:text-slate-300 space-y-3">
              <p>
                <strong>Apa itu Contract Generator?</strong> Contract Generator adalah tool yang membantu pengguna untuk membuat kontrak dan perjanjian hukum dengan cepat dan mudah berdasarkan template yang telah disiapkan.
              </p>
              <p>
                <strong>Cara Penggunaan:</strong>
              </p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Pilih template kontrak yang sesuai dengan kebutuhan Anda</li>
                <li>Sesuaikan klausa-klausa yang ingin disertakan dalam kontrak</li>
                <li>Isi informasi yang diperlukan untuk melengkapi dokumen</li>
                <li>Hasilkan dokumen kontrak dan unduh atau salin sesuai kebutuhan</li>
              </ol>
              <p>
                <strong>Catatan Penting:</strong> Tool ini dimaksudkan sebagai bantuan untuk membuat draft kontrak dan tidak menggantikan nasihat hukum profesional. Kami menyarankan agar dokumen yang dihasilkan diperiksa oleh ahli hukum sebelum ditandatangani dan digunakan.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Template categories available
const templateCategories = ["employment", "property", "business", "legal"];

// Mock contract templates data
interface ContractClause {
  id: string;
  title: string;
  content: string;
  isRequired?: boolean;
}

interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  clauses: ContractClause[];
  placeholders: string[];
}

// Mock templates for development
const contractTemplates: ContractTemplate[] = [
  {
    id: "employment-1",
    name: "Perjanjian Kerja Karyawan Tetap",
    description: "Template standar untuk perjanjian kerja karyawan tetap sesuai dengan UU Ketenagakerjaan",
    category: "employment",
    clauses: [
      {
        id: "emp-1-clause-1",
        title: "Identitas Para Pihak",
        content: "PERJANJIAN KERJA INI dibuat pada {TANGGAL_EFEKTIF} oleh dan antara:\n\n1. {NAMA_PERUSAHAAN_1}, sebuah perusahaan yang didirikan berdasarkan hukum Republik Indonesia, berkedudukan di {ALAMAT_PERUSAHAAN_1}, dalam hal ini diwakili oleh {NAMA_DIREKTUR_1} selaku {JABATAN_1}, selanjutnya disebut sebagai \"PIHAK PERTAMA\";\n\ndan\n\n2. {NAMA_KARYAWAN}, Warga Negara Indonesia, pemegang KTP nomor {NOMOR_KTP}, bertempat tinggal di {ALAMAT_KARYAWAN}, selanjutnya disebut sebagai \"PIHAK KEDUA\".",
        isRequired: true
      },
      {
        id: "emp-1-clause-2",
        title: "Lingkup Pekerjaan",
        content: "Dengan ini PIHAK PERTAMA mempekerjakan PIHAK KEDUA dan PIHAK KEDUA menerima untuk dipekerjakan oleh PIHAK PERTAMA dengan posisi sebagai {POSISI_JABATAN} dengan tugas dan tanggung jawab sebagai berikut:\n\n{DESKRIPSI_TUGAS}",
        isRequired: true
      },
      {
        id: "emp-1-clause-3",
        title: "Jangka Waktu Perjanjian",
        content: "PIHAK KEDUA akan mulai bekerja pada tanggal {TANGGAL_MULAI_KERJA}. Perjanjian Kerja ini berlaku untuk jangka waktu yang tidak ditentukan (karyawan tetap), dengan masa percobaan selama {MASA_PERCOBAAN} bulan terhitung sejak tanggal mulai bekerja.",
        isRequired: true
      },
      {
        id: "emp-1-clause-4",
        title: "Gaji dan Tunjangan",
        content: "a. PIHAK PERTAMA akan membayar kepada PIHAK KEDUA gaji pokok sebesar Rp. {GAJI_POKOK} (terbilang: {GAJI_TERBILANG}) per bulan.\n\nb. Selain gaji pokok, PIHAK KEDUA berhak atas tunjangan sebagai berikut:\n   - Tunjangan Makan: Rp. {TUNJANGAN_MAKAN} per hari kerja\n   - Tunjangan Transport: Rp. {TUNJANGAN_TRANSPORT} per hari kerja\n   - Tunjangan Kesehatan: Sesuai dengan program BPJS Kesehatan dan Ketenagakerjaan\n   - Tunjangan lainnya sesuai dengan kebijakan PIHAK PERTAMA\n\nc. Pembayaran gaji akan dilakukan setiap tanggal {TANGGAL_PEMBAYARAN_GAJI} setiap bulannya melalui transfer ke rekening bank PIHAK KEDUA.",
        isRequired: true
      },
      {
        id: "emp-1-clause-5",
        title: "Jam Kerja dan Lembur",
        content: "a. Jam kerja normal adalah 8 (delapan) jam sehari dan 40 (empat puluh) jam seminggu, dengan 5 (lima) hari kerja dalam seminggu dari hari Senin hingga Jumat.\n\nb. Jam kerja normal adalah sebagai berikut:\n   - Senin - Jumat: {JAM_KERJA}\n   - Istirahat: {JAM_ISTIRAHAT}\n\nc. PIHAK KEDUA dapat diminta untuk bekerja melebihi jam kerja normal (lembur) sesuai dengan kebutuhan operasional perusahaan. Upah lembur akan dihitung sesuai dengan peraturan ketenagakerjaan yang berlaku.",
        isRequired: false
      },
      {
        id: "emp-1-clause-6",
        title: "Cuti dan Izin",
        content: "a. PIHAK KEDUA berhak atas cuti tahunan sebanyak {JUMLAH_CUTI_TAHUNAN} hari kerja setelah bekerja selama 12 (dua belas) bulan terus menerus.\n\nb. Cuti melahirkan bagi karyawan wanita diberikan selama 3 (tiga) bulan sesuai dengan peraturan ketenagakerjaan.\n\nc. Cuti sakit diberikan dengan menyertakan keterangan dokter.\n\nd. Izin untuk tidak masuk kerja karena alasan penting (menikah, anggota keluarga inti meninggal, dll) akan diberikan sesuai dengan kebijakan perusahaan dan peraturan ketenagakerjaan yang berlaku.",
        isRequired: false
      },
      {
        id: "emp-1-clause-7",
        title: "Kerahasiaan",
        content: "a. PIHAK KEDUA wajib menjaga kerahasiaan semua informasi bisnis, teknis, atau data lainnya yang dimiliki oleh PIHAK PERTAMA dan dianggap rahasia oleh PIHAK PERTAMA.\n\nb. Kewajiban menjaga kerahasiaan ini tetap berlaku selama masa kerja dan setelah pemutusan hubungan kerja, tanpa batasan waktu.",
        isRequired: false
      },
      {
        id: "emp-1-clause-8",
        title: "Pengakhiran Hubungan Kerja",
        content: "a. Selama masa percobaan, kedua belah pihak dapat mengakhiri hubungan kerja tanpa pemberitahuan terlebih dahulu.\n\nb. Setelah masa percobaan, pengakhiran hubungan kerja harus dilakukan sesuai dengan ketentuan dalam Undang-Undang Ketenagakerjaan yang berlaku.\n\nc. PIHAK KEDUA yang mengundurkan diri wajib memberikan pemberitahuan tertulis kepada PIHAK PERTAMA minimal 30 (tiga puluh) hari sebelum tanggal efektif pengunduran diri.",
        isRequired: true
      },
      {
        id: "emp-1-clause-9",
        title: "Perselisihan dan Penyelesaian",
        content: "Apabila terjadi perselisihan antara kedua belah pihak terkait dengan pelaksanaan Perjanjian Kerja ini, maka penyelesaian akan dilakukan secara musyawarah terlebih dahulu. Jika tidak tercapai kesepakatan, maka penyelesaian akan dilakukan sesuai dengan peraturan perundang-undangan yang berlaku.",
        isRequired: true
      },
      {
        id: "emp-1-clause-10",
        title: "Hukum yang Berlaku",
        content: "Perjanjian Kerja ini dibuat berdasarkan hukum Negara Republik Indonesia dan tunduk pada Undang-Undang Ketenagakerjaan yang berlaku.",
        isRequired: true
      },
      {
        id: "emp-1-clause-11",
        title: "Tanda Tangan Para Pihak",
        content: "Dengan ini, kedua belah pihak menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan dalam Perjanjian Kerja ini dengan menandatangani perjanjian ini dibuat dalam rangkap 2 (dua) yang memiliki kekuatan hukum yang sama.\n\n{LOKASI_PENANDATANGANAN}, {TANGGAL_PENANDATANGANAN}\n\nPIHAK PERTAMA\n\n\n\n{NAMA_DIREKTUR_1}\n{JABATAN_1}\n\nPIHAK KEDUA\n\n\n\n{NAMA_KARYAWAN}",
        isRequired: true
      }
    ],
    placeholders: [
      "TANGGAL_EFEKTIF",
      "NAMA_PERUSAHAAN_1",
      "ALAMAT_PERUSAHAAN_1",
      "NAMA_DIREKTUR_1",
      "JABATAN_1",
      "NAMA_KARYAWAN",
      "NOMOR_KTP",
      "ALAMAT_KARYAWAN",
      "POSISI_JABATAN",
      "DESKRIPSI_TUGAS",
      "TANGGAL_MULAI_KERJA",
      "MASA_PERCOBAAN",
      "GAJI_POKOK",
      "GAJI_TERBILANG",
      "TUNJANGAN_MAKAN",
      "TUNJANGAN_TRANSPORT",
      "TANGGAL_PEMBAYARAN_GAJI",
      "JAM_KERJA",
      "JAM_ISTIRAHAT",
      "JUMLAH_CUTI_TAHUNAN",
      "LOKASI_PENANDATANGANAN",
      "TANGGAL_PENANDATANGANAN"
    ]
  },
  {
    id: "property-1",
    name: "Perjanjian Sewa Properti",
    description: "Template untuk perjanjian sewa properti yang komprehensif dan legal",
    category: "property",
    clauses: [
      {
        id: "prop-1-clause-1",
        title: "Identitas Para Pihak",
        content: "PERJANJIAN SEWA MENYEWA INI dibuat pada tanggal {TANGGAL_EFEKTIF} oleh dan antara:\n\n1. {NAMA_PEMILIK}, {JENIS_IDENTITAS}: {NOMOR_IDENTITAS_PEMILIK}, bertempat tinggal di {ALAMAT_PEMILIK}, selanjutnya disebut sebagai \"PIHAK PERTAMA\";\n\ndan\n\n2. {NAMA_PENYEWA}, {JENIS_IDENTITAS}: {NOMOR_IDENTITAS_PENYEWA}, bertempat tinggal di {ALAMAT_PENYEWA}, selanjutnya disebut sebagai \"PIHAK KEDUA\".",
        isRequired: true
      },
      {
        id: "prop-1-clause-2",
        title: "Objek Sewa",
        content: "PIHAK PERTAMA dengan ini menyewakan kepada PIHAK KEDUA dan PIHAK KEDUA menyewa dari PIHAK PERTAMA suatu properti dengan rincian sebagai berikut:\n\nJenis properti: {JENIS_PROPERTI}\nAlamat: {ALAMAT_PROPERTI}\nLuas bangunan: {LUAS_BANGUNAN} m²\nLuas tanah: {LUAS_TANAH} m²\nDilengkapi dengan: {KELENGKAPAN_PROPERTI}\n\nSelanjutnya disebut sebagai \"Objek Sewa\".",
        isRequired: true
      },
      {
        id: "prop-1-clause-3",
        title: "Jangka Waktu Sewa",
        content: "Jangka waktu sewa adalah {JANGKA_WAKTU_SEWA} terhitung sejak tanggal {TANGGAL_MULAI_SEWA} hingga tanggal {TANGGAL_BERAKHIR_SEWA}.",
        isRequired: true
      },
      {
        id: "prop-1-clause-4",
        title: "Harga Sewa dan Cara Pembayaran",
        content: "a. Harga sewa Objek Sewa adalah sebesar Rp. {HARGA_SEWA} (terbilang: {HARGA_SEWA_TERBILANG}) untuk keseluruhan jangka waktu sewa.\n\nb. Pembayaran sewa akan dilakukan dengan jadwal sebagai berikut:\n   {JADWAL_PEMBAYARAN}\n\nc. Seluruh pembayaran akan dilakukan melalui transfer ke rekening PIHAK PERTAMA dengan detail sebagai berikut:\n   Nama Bank: {NAMA_BANK}\n   Nomor Rekening: {NOMOR_REKENING}\n   Atas Nama: {ATAS_NAMA_REKENING}",
        isRequired: true
      },
      {
        id: "prop-1-clause-5",
        title: "Deposit",
        content: "a. PIHAK KEDUA wajib membayar deposit sebesar Rp. {JUMLAH_DEPOSIT} (terbilang: {DEPOSIT_TERBILANG}) pada saat penandatanganan perjanjian ini.\n\nb. Deposit akan dikembalikan kepada PIHAK KEDUA setelah masa sewa berakhir, dikurangi biaya perbaikan atas kerusakan yang mungkin terjadi selama masa sewa di luar kerusakan akibat penggunaan normal.",
        isRequired: false
      },
      {
        id: "prop-1-clause-6",
        title: "Penggunaan Objek Sewa",
        content: "a. PIHAK KEDUA akan menggunakan Objek Sewa untuk tujuan {TUJUAN_PENGGUNAAN} dan tidak akan menggunakannya untuk tujuan lain tanpa persetujuan tertulis dari PIHAK PERTAMA.\n\nb. PIHAK KEDUA tidak diperkenankan mengubah bentuk atau melakukan renovasi pada Objek Sewa tanpa persetujuan tertulis dari PIHAK PERTAMA.\n\nc. PIHAK KEDUA tidak diperkenankan menyewakan kembali Objek Sewa kepada pihak lain (sub-lease).",
        isRequired: true
      },
      {
        id: "prop-1-clause-7",
        title: "Tanggung Jawab Pemeliharaan",
        content: "a. PIHAK PERTAMA bertanggung jawab atas perbaikan kerusakan struktur bangunan yang bukan disebabkan oleh PIHAK KEDUA.\n\nb. PIHAK KEDUA bertanggung jawab atas pemeliharaan rutin dan perbaikan kecil pada Objek Sewa, termasuk namun tidak terbatas pada perbaikan peralatan listrik, sanitasi dan perlengkapan lainnya yang rusak akibat penggunaan oleh PIHAK KEDUA.",
        isRequired: false
      },
      {
        id: "prop-1-clause-8",
        title: "Biaya Utilitas dan Pemeliharaan",
        content: "PIHAK KEDUA bertanggung jawab atas pembayaran semua biaya utilitas dan pemeliharaan rutin selama jangka waktu sewa, termasuk namun tidak terbatas pada:\n\na. Biaya listrik\nb. Biaya air\nc. Biaya telepon dan internet\nd. Biaya gas\ne. Biaya kebersihan dan sampah\nf. Biaya keamanan lingkungan (jika ada)",
        isRequired: false
      },
      {
        id: "prop-1-clause-9",
        title: "Perpanjangan Sewa",
        content: "a. Apabila PIHAK KEDUA bermaksud untuk memperpanjang jangka waktu sewa, PIHAK KEDUA wajib memberitahukan kepada PIHAK PERTAMA secara tertulis minimal {PERIODE_PEMBERITAHUAN_PERPANJANGAN} sebelum berakhirnya jangka waktu sewa.\n\nb. Perpanjangan sewa akan diatur dalam perjanjian sewa yang baru dengan syarat dan ketentuan yang disepakati oleh kedua belah pihak.",
        isRequired: false
      },
      {
        id: "prop-1-clause-10",
        title: "Pengakhiran Perjanjian",
        content: "a. Perjanjian ini akan berakhir secara otomatis pada tanggal {TANGGAL_BERAKHIR_SEWA}, kecuali diperpanjang oleh kedua belah pihak.\n\nb. PIHAK PERTAMA berhak mengakhiri perjanjian secara sepihak apabila PIHAK KEDUA melanggar ketentuan dalam perjanjian ini dan tidak memperbaiki pelanggaran tersebut dalam waktu 14 (empat belas) hari setelah menerima pemberitahuan tertulis dari PIHAK PERTAMA.\n\nc. Jika PIHAK KEDUA bermaksud mengakhiri perjanjian sebelum jangka waktu sewa berakhir, maka PIHAK KEDUA tetap berkewajiban membayar sewa untuk keseluruhan jangka waktu sewa atau hingga PIHAK PERTAMA mendapatkan penyewa pengganti.",
        isRequired: true
      },
      {
        id: "prop-1-clause-11",
        title: "Kondisi Pengembalian Objek Sewa",
        content: "Pada saat berakhirnya jangka waktu sewa, PIHAK KEDUA wajib mengembalikan Objek Sewa kepada PIHAK PERTAMA dalam kondisi baik sebagaimana saat Objek Sewa diterima oleh PIHAK KEDUA, dengan memperhatikan keausan wajar akibat penggunaan normal.",
        isRequired: true
      },
      {
        id: "prop-1-clause-12",
        title: "Force Majeure",
        content: "Jika terjadi keadaan force majeure seperti bencana alam, kebakaran, atau kerusuhan yang mengakibatkan Objek Sewa tidak dapat digunakan, maka kedua belah pihak sepakat untuk membebaskan satu sama lain dari kewajiban dalam perjanjian ini.",
        isRequired: false
      },
      {
        id: "prop-1-clause-13",
        title: "Penyelesaian Perselisihan",
        content: "Segala perselisihan yang timbul dari perjanjian ini akan diselesaikan secara musyawarah untuk mufakat. Apabila tidak tercapai kesepakatan, maka kedua belah pihak sepakat untuk menyelesaikannya melalui {CARA_PENYELESAIAN_SENGKETA}.",
        isRequired: true
      },
      {
        id: "prop-1-clause-14",
        title: "Penutup",
        content: "Perjanjian Sewa Menyewa ini dibuat dan ditandatangani oleh PIHAK PERTAMA dan PIHAK KEDUA dalam keadaan sadar dan tanpa paksaan dari pihak manapun, dalam rangkap 2 (dua) yang masing-masing mempunyai kekuatan hukum yang sama.\n\n{LOKASI_PENANDATANGANAN}, {TANGGAL_PENANDATANGANAN}\n\nPIHAK PERTAMA\n\n\n\n{NAMA_PEMILIK}\n\nPIHAK KEDUA\n\n\n\n{NAMA_PENYEWA}",
        isRequired: true
      }
    ],
    placeholders: [
      "TANGGAL_EFEKTIF",
      "NAMA_PEMILIK",
      "JENIS_IDENTITAS",
      "NOMOR_IDENTITAS_PEMILIK",
      "ALAMAT_PEMILIK",
      "NAMA_PENYEWA",
      "NOMOR_IDENTITAS_PENYEWA",
      "ALAMAT_PENYEWA",
      "JENIS_PROPERTI",
      "ALAMAT_PROPERTI",
      "LUAS_BANGUNAN",
      "LUAS_TANAH",
      "KELENGKAPAN_PROPERTI",
      "JANGKA_WAKTU_SEWA",
      "TANGGAL_MULAI_SEWA",
      "TANGGAL_BERAKHIR_SEWA",
      "HARGA_SEWA",
      "HARGA_SEWA_TERBILANG",
      "JADWAL_PEMBAYARAN",
      "NAMA_BANK",
      "NOMOR_REKENING",
      "ATAS_NAMA_REKENING",
      "JUMLAH_DEPOSIT",
      "DEPOSIT_TERBILANG",
      "TUJUAN_PENGGUNAAN",
      "PERIODE_PEMBERITAHUAN_PERPANJANGAN",
      "CARA_PENYELESAIAN_SENGKETA",
      "LOKASI_PENANDATANGANAN",
      "TANGGAL_PENANDATANGANAN"
    ]
  },
  {
    id: "business-1",
    name: "Perjanjian Kerjasama Bisnis",
    description: "Template untuk perjanjian kerjasama bisnis antara dua entitas",
    category: "business",
    clauses: [
      {
        id: "bus-1-clause-1",
        title: "Para Pihak",
        content: "PERJANJIAN KERJASAMA BISNIS INI dibuat dan ditandatangani pada tanggal {TANGGAL_EFEKTIF} oleh dan antara:\n\n1. {NAMA_PERUSAHAAN_1}, sebuah perusahaan yang didirikan berdasarkan hukum Republik Indonesia, berkedudukan di {ALAMAT_PERUSAHAAN_1}, dengan NPWP {NPWP_PERUSAHAAN_1}, dalam hal ini diwakili oleh {NAMA_DIREKTUR_1} selaku {JABATAN_1}, selanjutnya disebut sebagai \"PIHAK PERTAMA\";\n\ndan\n\n2. {NAMA_PERUSAHAAN_2}, sebuah perusahaan yang didirikan berdasarkan hukum Republik Indonesia, berkedudukan di {ALAMAT_PERUSAHAAN_2}, dengan NPWP {NPWP_PERUSAHAAN_2}, dalam hal ini diwakili oleh {NAMA_DIREKTUR_2} selaku {JABATAN_2}, selanjutnya disebut sebagai \"PIHAK KEDUA\".\n\nPIHAK PERTAMA dan PIHAK KEDUA selanjutnya secara bersama-sama disebut sebagai \"Para Pihak\" dan secara sendiri-sendiri disebut sebagai \"Pihak\".",
        isRequired: true
      },
      {
        id: "bus-1-clause-2",
        title: "Latar Belakang",
        content: "a. PIHAK PERTAMA adalah perusahaan yang bergerak di bidang {BIDANG_USAHA_PIHAK_PERTAMA}.\n\nb. PIHAK KEDUA adalah perusahaan yang bergerak di bidang {BIDANG_USAHA_PIHAK_KEDUA}.\n\nc. Para Pihak bermaksud untuk menjalin kerjasama bisnis dalam hal {RUANG_LINGKUP_KERJASAMA}.\n\nd. Para Pihak sepakat untuk menuangkan kerjasama tersebut dalam Perjanjian Kerjasama ini.",
        isRequired: true
      },
      {
        id: "bus-1-clause-3",
        title: "Tujuan Kerjasama",
        content: "Perjanjian Kerjasama ini bertujuan untuk {TUJUAN_KERJASAMA}.",
        isRequired: true
      },
      {
        id: "bus-1-clause-4",
        title: "Ruang Lingkup Kerjasama",
        content: "a. Para Pihak sepakat untuk melakukan kerjasama dalam bidang {RUANG_LINGKUP_KERJASAMA} dengan rincian sebagai berikut:\n\n   {RINCIAN_KERJASAMA}\n\nb. Kerjasama ini tidak mencakup bidang-bidang lain di luar yang telah disepakati tanpa persetujuan tertulis dari kedua belah pihak.",
        isRequired: true
      },
      {
        id: "bus-1-clause-5",
        title: "Jangka Waktu Kerjasama",
        content: "a. Perjanjian Kerjasama ini berlaku untuk jangka waktu {JANGKA_WAKTU} terhitung sejak tanggal {TANGGAL_MULAI} hingga tanggal {TANGGAL_BERAKHIR}.\n\nb. Perjanjian ini dapat diperpanjang berdasarkan kesepakatan tertulis Para Pihak yang harus dibuat paling lambat {WAKTU_PEMBERITAHUAN_PERPANJANGAN} sebelum berakhirnya Perjanjian ini.",
        isRequired: true
      },
      {
        id: "bus-1-clause-6",
        title: "Hak dan Kewajiban PIHAK PERTAMA",
        content: "PIHAK PERTAMA memiliki hak dan kewajiban sebagai berikut:\n\na. Hak PIHAK PERTAMA:\n   {HAK_PIHAK_PERTAMA}\n\nb. Kewajiban PIHAK PERTAMA:\n   {KEWAJIBAN_PIHAK_PERTAMA}",
        isRequired: true
      },
      {
        id: "bus-1-clause-7",
        title: "Hak dan Kewajiban PIHAK KEDUA",
        content: "PIHAK KEDUA memiliki hak dan kewajiban sebagai berikut:\n\na. Hak PIHAK KEDUA:\n   {HAK_PIHAK_KEDUA}\n\nb. Kewajiban PIHAK KEDUA:\n   {KEWAJIBAN_PIHAK_KEDUA}",
        isRequired: true
      },
      {
        id: "bus-1-clause-8",
        title: "Nilai Kerjasama dan Pembayaran",
        content: "a. Nilai kerjasama ini adalah sebesar Rp. {NILAI_KONTRAK} (terbilang: {NILAI_KONTRAK_TERBILANG}).\n\nb. Pembayaran akan dilakukan dengan ketentuan sebagai berikut:\n   {KETENTUAN_PEMBAYARAN}\n\nc. Seluruh pembayaran akan dilakukan melalui transfer ke rekening:\n   Nama Bank: {NAMA_BANK}\n   Nomor Rekening: {NOMOR_REKENING}\n   Atas Nama: {ATAS_NAMA}",
        isRequired: false
      },
      {
        id: "bus-1-clause-9",
        title: "Bagi Hasil",
        content: "Para Pihak sepakat bahwa pembagian hasil dari kerjasama ini adalah sebagai berikut:\n\na. PIHAK PERTAMA: {PERSENTASE_BAGI_HASIL_PIHAK_PERTAMA}%\nb. PIHAK KEDUA: {PERSENTASE_BAGI_HASIL_PIHAK_KEDUA}%\n\nDengan ketentuan dan mekanisme bagi hasil sebagai berikut:\n{MEKANISME_BAGI_HASIL}",
        isRequired: false
      },
      {
        id: "bus-1-clause-10",
        title: "Kerahasiaan",
        content: "a. Para Pihak sepakat untuk menjaga kerahasiaan seluruh informasi yang diperoleh dalam pelaksanaan Perjanjian Kerjasama ini.\n\nb. Informasi rahasia mencakup namun tidak terbatas pada data keuangan, data pelanggan, strategi bisnis, know-how, dan informasi lain yang dianggap rahasia.\n\nc. Kewajiban menjaga kerahasiaan ini tetap berlaku selama {JANGKA_WAKTU_KERAHASIAAN} setelah berakhirnya Perjanjian Kerjasama ini.",
        isRequired: false
      },
      {
        id: "bus-1-clause-11",
        title: "Hak Kekayaan Intelektual",
        content: "a. Masing-masing Pihak tetap memiliki hak atas Kekayaan Intelektual yang dimilikinya sebelum Perjanjian Kerjasama ini.\n\nb. Hak Kekayaan Intelektual yang dihasilkan selama pelaksanaan Perjanjian Kerjasama ini akan menjadi milik {KEPEMILIKAN_HAKI}.\n\nc. Penggunaan Hak Kekayaan Intelektual milik salah satu Pihak oleh Pihak lainnya harus mendapatkan persetujuan tertulis terlebih dahulu.",
        isRequired: false
      },
      {
        id: "bus-1-clause-12",
        title: "Force Majeure",
        content: "a. Para Pihak dibebaskan dari tanggung jawab atas keterlambatan atau kegagalan dalam memenuhi kewajiban yang tercantum dalam Perjanjian ini yang disebabkan oleh kejadian yang berada di luar kendali Para Pihak (Force Majeure).\n\nb. Kejadian Force Majeure meliputi namun tidak terbatas pada bencana alam, perang, huru-hara, epidemic, pandemi, kebakaran, dan kebijakan pemerintah yang menyebabkan tidak dapat dilaksanakannya Perjanjian ini.\n\nc. Pihak yang mengalami Force Majeure wajib memberitahukan kepada Pihak lainnya paling lambat {JANGKA_WAKTU_PEMBERITAHUAN_FORCE_MAJEURE} sejak terjadinya Force Majeure.\n\nd. Apabila Force Majeure berlangsung lebih dari {JANGKA_WAKTU_FORCE_MAJEURE}, maka Para Pihak akan melakukan perundingan kembali terkait kelanjutan Perjanjian ini.",
        isRequired: true
      },
      {
        id: "bus-1-clause-13",
        title: "Pengakhiran Perjanjian",
        content: "a. Perjanjian ini berakhir apabila:\n   1. Jangka waktu Perjanjian telah berakhir dan tidak diperpanjang;\n   2. Para Pihak sepakat untuk mengakhiri Perjanjian;\n   3. Salah satu Pihak melakukan pelanggaran material terhadap Perjanjian ini dan tidak memperbaikinya dalam waktu {JANGKA_WAKTU_PERBAIKAN} setelah menerima pemberitahuan tertulis dari Pihak lainnya;\n   4. Salah satu Pihak dinyatakan pailit atau dalam proses likuidasi.\n\nb. Dalam hal pengakhiran Perjanjian, para Pihak tetap berkewajiban untuk menyelesaikan hak dan kewajiban yang masih harus dipenuhi.",
        isRequired: true
      },
      {
        id: "bus-1-clause-14",
        title: "Penyelesaian Perselisihan",
        content: "a. Segala perselisihan yang timbul dari Perjanjian ini akan diselesaikan secara musyawarah untuk mufakat.\n\nb. Apabila penyelesaian secara musyawarah tidak tercapai dalam waktu {JANGKA_WAKTU_MUSYAWARAH}, maka Para Pihak sepakat untuk menyelesaikan perselisihan melalui {FORUM_PENYELESAIAN_SENGKETA}.",
        isRequired: true
      },
      {
        id: "bus-1-clause-15",
        title: "Hukum yang Berlaku",
        content: "Perjanjian Kerjasama ini tunduk pada dan ditafsirkan berdasarkan hukum Negara Republik Indonesia.",
        isRequired: true
      },
      {
        id: "bus-1-clause-16",
        title: "Penutup",
        content: "a. Segala perubahan atas Perjanjian ini harus dibuat secara tertulis dan ditandatangani oleh Para Pihak.\n\nb. Perjanjian ini menggantikan semua kesepakatan atau perjanjian sebelumnya, baik lisan maupun tertulis, antara Para Pihak mengenai hal yang sama.\n\nc. Apabila terdapat ketentuan dalam Perjanjian ini yang dinyatakan batal atau tidak berlaku berdasarkan hukum yang berlaku, maka ketentuan lainnya tetap berlaku dan mengikat Para Pihak.\n\nDemikian Perjanjian Kerjasama ini dibuat dan ditandatangani oleh Para Pihak dalam rangkap 2 (dua) yang masing-masing mempunyai kekuatan hukum yang sama, pada tanggal sebagaimana disebutkan di awal Perjanjian ini.\n\n{LOKASI_PENANDATANGANAN}, {TANGGAL_PENANDATANGANAN}\n\nPIHAK PERTAMA\n\n\n\n{NAMA_DIREKTUR_1}\n{JABATAN_1}\n{NAMA_PERUSAHAAN_1}\n\nPIHAK KEDUA\n\n\n\n{NAMA_DIREKTUR_2}\n{JABATAN_2}\n{NAMA_PERUSAHAAN_2}",
        isRequired: true
      }
    ],
    placeholders: [
      "TANGGAL_EFEKTIF",
      "NAMA_PERUSAHAAN_1",
      "ALAMAT_PERUSAHAAN_1",
      "NPWP_PERUSAHAAN_1",
      "NAMA_DIREKTUR_1",
      "JABATAN_1",
      "NAMA_PERUSAHAAN_2",
      "ALAMAT_PERUSAHAAN_2",
      "NPWP_PERUSAHAAN_2",
      "NAMA_DIREKTUR_2",
      "JABATAN_2",
      "BIDANG_USAHA_PIHAK_PERTAMA",
      "BIDANG_USAHA_PIHAK_KEDUA",
      "RUANG_LINGKUP_KERJASAMA",
      "TUJUAN_KERJASAMA",
      "RINCIAN_KERJASAMA",
      "JANGKA_WAKTU",
      "TANGGAL_MULAI",
      "TANGGAL_BERAKHIR",
      "WAKTU_PEMBERITAHUAN_PERPANJANGAN",
      "HAK_PIHAK_PERTAMA",
      "KEWAJIBAN_PIHAK_PERTAMA",
      "HAK_PIHAK_KEDUA",
      "KEWAJIBAN_PIHAK_KEDUA",
      "NILAI_KONTRAK",
      "NILAI_KONTRAK_TERBILANG",
      "KETENTUAN_PEMBAYARAN",
      "NAMA_BANK",
      "NOMOR_REKENING",
      "ATAS_NAMA",
      "PERSENTASE_BAGI_HASIL_PIHAK_PERTAMA",
      "PERSENTASE_BAGI_HASIL_PIHAK_KEDUA",
      "MEKANISME_BAGI_HASIL",
      "JANGKA_WAKTU_KERAHASIAAN",
      "KEPEMILIKAN_HAKI",
      "JANGKA_WAKTU_PEMBERITAHUAN_FORCE_MAJEURE",
      "JANGKA_WAKTU_FORCE_MAJEURE",
      "JANGKA_WAKTU_PERBAIKAN",
      "JANGKA_WAKTU_MUSYAWARAH",
      "FORUM_PENYELESAIAN_SENGKETA",
      "LOKASI_PENANDATANGANAN",
      "TANGGAL_PENANDATANGANAN"
    ]
  },
  {
    id: "legal-1",
    name: "Perjanjian Kerahasiaan (NDA)",
    description: "Template untuk perjanjian kerahasiaan non-disclosure agreement",
    category: "legal",
    clauses: [
      {
        id: "legal-1-clause-1",
        title: "Para Pihak",
        content: "PERJANJIAN KERAHASIAAN INI dibuat dan ditandatangani pada tanggal {TANGGAL_EFEKTIF} oleh dan antara:\n\n1. {NAMA_PIHAK_1}, {JENIS_ENTITAS_PIHAK_1}, berkedudukan di {ALAMAT_PIHAK_1}, dalam hal ini diwakili oleh {NAMA_WAKIL_PIHAK_1} selaku {JABATAN_WAKIL_PIHAK_1}, selanjutnya disebut sebagai \"PIHAK PERTAMA\";\n\ndan\n\n2. {NAMA_PIHAK_2}, {JENIS_ENTITAS_PIHAK_2}, berkedudukan di {ALAMAT_PIHAK_2}, dalam hal ini diwakili oleh {NAMA_WAKIL_PIHAK_2} selaku {JABATAN_WAKIL_PIHAK_2}, selanjutnya disebut sebagai \"PIHAK KEDUA\".\n\nPIHAK PERTAMA dan PIHAK KEDUA selanjutnya secara bersama-sama disebut sebagai \"Para Pihak\" dan secara sendiri-sendiri disebut sebagai \"Pihak\".",
        isRequired: true
      },
      {
        id: "legal-1-clause-2",
        title: "Latar Belakang",
        content: "a. Para Pihak bermaksud untuk melakukan kerjasama dalam bidang {BIDANG_KERJASAMA}.\n\nb. Dalam rangka kerjasama tersebut, Para Pihak perlu untuk saling mengungkapkan informasi yang bersifat rahasia.\n\nc. Para Pihak sepakat untuk menjaga kerahasiaan informasi sesuai dengan ketentuan dan syarat yang diatur dalam Perjanjian Kerahasiaan ini.",
        isRequired: true
      },
      {
        id: "legal-1-clause-3",
        title: "Definisi Informasi Rahasia",
        content: "1. \"Informasi Rahasia\" berarti segala informasi dalam bentuk apapun, tertulis maupun tidak tertulis, yang diungkapkan oleh salah satu Pihak (\"Pihak Pengungkap\") kepada Pihak lainnya (\"Pihak Penerima\"), baik sebelum atau setelah tanggal Perjanjian ini, yang berkaitan dengan bisnis, produk, layanan, teknologi, know-how, rahasia dagang, desain, proses, metodologi, spesifikasi, data keuangan, data pelanggan, strategi pemasaran, rencana bisnis, dan informasi lainnya yang dianggap atau ditandai sebagai rahasia.\n\n2. \"Informasi Rahasia\" tidak termasuk informasi yang:\n   a. telah diketahui oleh Pihak Penerima sebelum diterimanya informasi tersebut dari Pihak Pengungkap;\n   b. telah atau menjadi tersedia untuk umum tanpa pelanggaran Perjanjian ini oleh Pihak Penerima;\n   c. diterima Pihak Penerima secara sah dari pihak ketiga tanpa kewajiban kerahasiaan;\n   d. dikembangkan secara independen oleh Pihak Penerima tanpa mengacu pada Informasi Rahasia dari Pihak Pengungkap;\n   e. diungkapkan dengan persetujuan tertulis dari Pihak Pengungkap; atau\n   f. diungkapkan berdasarkan ketentuan hukum yang berlaku, perintah pengadilan, atau badan/lembaga pemerintah yang berwenang.",
        isRequired: true
      },
      {
        id: "legal-1-clause-4",
        title: "Kewajiban Kerahasiaan",
        content: "1. Pihak Penerima setuju untuk:\n   a. menjaga kerahasiaan Informasi Rahasia dengan standar kehati-hatian yang sama seperti yang diterapkan terhadap informasi rahasianya sendiri, namun tidak kurang dari standar kehati-hatian yang wajar;\n   b. tidak mengungkapkan Informasi Rahasia kepada pihak ketiga manapun tanpa persetujuan tertulis terlebih dahulu dari Pihak Pengungkap;\n   c. membatasi akses Informasi Rahasia hanya kepada karyawan, direktur, penasihat, dan agennya yang perlu mengetahui informasi tersebut untuk tujuan kerjasama;\n   d. memastikan bahwa setiap orang yang menerima Informasi Rahasia terikat oleh kewajiban kerahasiaan yang setara dengan Perjanjian ini;\n   e. tidak menyalin, mereproduksi, atau merekam Informasi Rahasia kecuali sepanjang yang diperlukan untuk tujuan kerjasama;\n   f. tidak menggunakan Informasi Rahasia untuk tujuan lain selain untuk kepentingan kerjasama yang dimaksud dalam Perjanjian ini; dan\n   g. segera memberitahukan kepada Pihak Pengungkap jika mengetahui adanya pengungkapan Informasi Rahasia yang tidak diizinkan dan bekerja sama dengan Pihak Pengungkap untuk mencegah pengungkapan lebih lanjut.",
        isRequired: true
      },
      {
        id: "legal-1-clause-5",
        title: "Pengungkapan yang Diwajibkan oleh Hukum",
        content: "Jika Pihak Penerima diwajibkan untuk mengungkapkan Informasi Rahasia berdasarkan perintah pengadilan, undang-undang, atau peraturan yang berlaku, maka Pihak Penerima harus:\n\na. memberikan pemberitahuan tertulis kepada Pihak Pengungkap sesegera mungkin, jika diizinkan oleh hukum;\n\nb. bekerja sama dengan Pihak Pengungkap untuk memperoleh jaminan perlindungan kerahasiaan yang tepat; dan\n\nc. membatasi pengungkapan hanya pada informasi yang diwajibkan untuk diungkapkan.",
        isRequired: false
      },
      {
        id: "legal-1-clause-6",
        title: "Jangka Waktu Perjanjian",
        content: "a. Perjanjian Kerahasiaan ini berlaku sejak tanggal {TANGGAL_EFEKTIF} dan akan tetap berlaku selama {JANGKA_WAKTU} tahun sejak tanggal tersebut, atau selama Para Pihak terlibat dalam kerjasama sebagaimana dimaksud dalam Perjanjian ini, mana yang lebih panjang.\n\nb. Kewajiban kerahasiaan sebagaimana diatur dalam Perjanjian ini akan tetap berlaku selama {PERIODE_KERAHASIAAN_PASCA_PERJANJIAN} tahun setelah berakhirnya Perjanjian ini.",
        isRequired: true
      },
      {
        id: "legal-1-clause-7",
        title: "Kepemilikan Informasi Rahasia",
        content: "a. Semua Informasi Rahasia tetap menjadi milik Pihak Pengungkap.\n\nb. Tidak ada lisensi atau hak lain yang diberikan kepada Pihak Penerima terkait dengan Informasi Rahasia, kecuali hak untuk menggunakan informasi tersebut sesuai dengan Perjanjian ini.\n\nc. Pihak Penerima tidak akan mengajukan permohonan hak kekayaan intelektual apapun yang didasarkan pada Informasi Rahasia milik Pihak Pengungkap.",
        isRequired: false
      },
      {
        id: "legal-1-clause-8",
        title: "Pengembalian Informasi Rahasia",
        content: "Dalam waktu {WAKTU_PENGEMBALIAN} hari setelah menerima permintaan tertulis dari Pihak Pengungkap, atau setelah berakhirnya Perjanjian ini, Pihak Penerima harus:\n\na. mengembalikan kepada Pihak Pengungkap semua dokumen dan media yang berisi Informasi Rahasia, beserta semua salinannya; atau\n\nb. menghancurkan semua dokumen dan media yang berisi Informasi Rahasia dan memberikan konfirmasi tertulis kepada Pihak Pengungkap bahwa penghancuran tersebut telah dilakukan.",
        isRequired: false
      },
      {
        id: "legal-1-clause-9",
        title: "Tanpa Jaminan",
        content: "Informasi Rahasia diberikan \"apa adanya\" tanpa jaminan apapun, tersurat maupun tersirat, mengenai keakuratan, kelengkapan, atau kesesuaian informasi tersebut untuk tujuan tertentu.",
        isRequired: false
      },
      {
        id: "legal-1-clause-10",
        title: "Ganti Rugi",
        content: "Pihak Penerima setuju bahwa pelanggaran terhadap Perjanjian ini dapat menyebabkan kerugian yang tidak dapat diperbaiki bagi Pihak Pengungkap, dan bahwa ganti rugi finansial mungkin tidak cukup. Oleh karena itu, Pihak Pengungkap berhak untuk mendapatkan ganti rugi dalam bentuk pelaksanaan spesifik (specific performance) dan ganti rugi dalam bentuk perintah pengadilan (injunctive relief) di samping upaya hukum lainnya yang tersedia berdasarkan hukum yang berlaku.",
        isRequired: false
      },
      {
        id: "legal-1-clause-11",
        title: "Pengalihan",
        content: "Perjanjian ini tidak dapat dialihkan atau ditransfer oleh salah satu Pihak kepada pihak lain tanpa persetujuan tertulis terlebih dahulu dari Pihak lainnya.",
        isRequired: false
      },
      {
        id: "legal-1-clause-12",
        title: "Hukum yang Berlaku",
        content: "Perjanjian ini tunduk pada dan ditafsirkan berdasarkan hukum Negara Republik Indonesia.",
        isRequired: true
      },
      {
        id: "legal-1-clause-13",
        title: "Penyelesaian Perselisihan",
        content: "a. Segala perselisihan yang timbul dari Perjanjian ini akan diselesaikan secara musyawarah untuk mufakat.\n\nb. Apabila perselisihan tidak dapat diselesaikan secara musyawarah dalam waktu {PERIODE_MUSYAWARAH} hari kalender sejak pemberitahuan tertulis dari Pihak yang merasa dirugikan, maka perselisihan tersebut akan diselesaikan melalui {CARA_PENYELESAIAN_SENGKETA}.",
        isRequired: true
      },
      {
        id: "legal-1-clause-14",
        title: "Ketentuan Lain-lain",
        content: "a. Perjanjian ini merupakan keseluruhan kesepakatan antara Para Pihak terkait dengan pokok permasalahan yang diatur di dalamnya dan menggantikan semua kesepakatan, pemahaman, atau perjanjian sebelumnya, baik lisan maupun tertulis.\n\nb. Semua pemberitahuan berdasarkan Perjanjian ini harus disampaikan secara tertulis ke alamat yang tercantum di bagian awal Perjanjian ini atau ke alamat lain yang diberitahukan secara tertulis oleh Para Pihak dari waktu ke waktu.\n\nc. Ketidakberlakuan atau tidak dapat dilaksanakannya salah satu ketentuan dalam Perjanjian ini tidak mempengaruhi ketentuan lainnya yang akan tetap berlaku dan mengikat Para Pihak.\n\nd. Perjanjian ini hanya dapat diubah dengan instrumen tertulis yang ditandatangani oleh Para Pihak.",
        isRequired: true
      },
      {
        id: "legal-1-clause-15",
        title: "Penutup",
        content: "Perjanjian Kerahasiaan ini dibuat dan ditandatangani oleh Para Pihak dalam rangkap 2 (dua) yang masing-masing mempunyai kekuatan hukum yang sama, pada tanggal sebagaimana disebutkan di awal Perjanjian ini.\n\n{LOKASI_PENANDATANGANAN}, {TANGGAL_PENANDATANGANAN}\n\nPIHAK PERTAMA\n\n\n\n{NAMA_WAKIL_PIHAK_1}\n{JABATAN_WAKIL_PIHAK_1}\n{NAMA_PIHAK_1}\n\nPIHAK KEDUA\n\n\n\n{NAMA_WAKIL_PIHAK_2}\n{JABATAN_WAKIL_PIHAK_2}\n{NAMA_PIHAK_2}",
        isRequired: true
      }
    ],
    placeholders: [
      "TANGGAL_EFEKTIF",
      "NAMA_PIHAK_1",
      "JENIS_ENTITAS_PIHAK_1",
      "ALAMAT_PIHAK_1",
      "NAMA_WAKIL_PIHAK_1",
      "JABATAN_WAKIL_PIHAK_1",
      "NAMA_PIHAK_2",
      "JENIS_ENTITAS_PIHAK_2",
      "ALAMAT_PIHAK_2",
      "NAMA_WAKIL_PIHAK_2",
      "JABATAN_WAKIL_PIHAK_2",
      "BIDANG_KERJASAMA",
      "JANGKA_WAKTU",
      "PERIODE_KERAHASIAAN_PASCA_PERJANJIAN",
      "WAKTU_PENGEMBALIAN",
      "PERIODE_MUSYAWARAH",
      "CARA_PENYELESAIAN_SENGKETA",
      "LOKASI_PENANDATANGANAN",
      "TANGGAL_PENANDATANGANAN"
    ]
  }
];