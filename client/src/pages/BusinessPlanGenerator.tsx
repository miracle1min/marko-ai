import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, Download, ChevronDown, CheckSquare, X, ArrowUp, FileText, BarChart3, DollarSign, TrendingUp, Users, Clock, Briefcase, Building, Target, MapPin, Medal, Scroll, Heart, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BusinessPlanRequest, BusinessPlanResponse } from "@/lib/types";
import AnimatedPage from "@/components/AnimatedPage";
import Breadcrumb from "@/components/Breadcrumb";
import jsPDF from "jspdf";

export default function BusinessPlanGenerator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("input");
  const [formData, setFormData] = useState<BusinessPlanRequest>({
    businessType: "",
    industry: "",
    targetMarket: "",
    location: "",
    planLength: "medium",
    language: "id",
    includeFinancials: true,
    includeMarketAnalysis: true,
    includeExecutiveSummary: true,
    includeCompetitorAnalysis: true,
    includeMarketingStrategy: true,
    includeRiskAnalysis: true,
  });
  const [results, setResults] = useState<BusinessPlanResponse | null>(null);

  const businessTypes = [
    { value: "small_business", label: "Usaha Kecil" },
    { value: "startup", label: "Startup" },
    { value: "franchise", label: "Waralaba" },
    { value: "online_business", label: "Bisnis Online" },
    { value: "service_business", label: "Bisnis Jasa" },
    { value: "retail", label: "Retail" },
    { value: "manufacturing", label: "Manufaktur" },
    { value: "social_enterprise", label: "Bisnis Sosial" }
  ];

  const industries = [
    { value: "technology", label: "Teknologi" },
    { value: "food_and_beverage", label: "Makanan & Minuman" },
    { value: "healthcare", label: "Kesehatan" },
    { value: "education", label: "Pendidikan" },
    { value: "retail", label: "Retail" },
    { value: "finance", label: "Keuangan" },
    { value: "fashion", label: "Fashion" },
    { value: "travel", label: "Pariwisata" },
    { value: "entertainment", label: "Hiburan" },
    { value: "real_estate", label: "Properti" },
    { value: "agriculture", label: "Pertanian" },
    { value: "automotive", label: "Otomotif" },
    { value: "energy", label: "Energi" },
    { value: "construction", label: "Konstruksi" },
    { value: "telecommunications", label: "Telekomunikasi" },
    { value: "e-commerce", label: "E-Commerce" },
    { value: "other", label: "Lainnya" }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.businessType) {
      toast({
        title: "Validasi Gagal",
        description: "Tipe bisnis harus diisi",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.industry) {
      toast({
        title: "Validasi Gagal",
        description: "Industri harus diisi",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.targetMarket) {
      toast({
        title: "Validasi Gagal",
        description: "Target pasar harus diisi",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.location) {
      toast({
        title: "Validasi Gagal",
        description: "Lokasi bisnis harus diisi",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/gemini/business-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal membuat rencana bisnis");
      }

      const data = await response.json();
      setResults(data);
      setActiveTab("results");
      toast({
        title: "Sukses",
        description: "Rencana bisnis berhasil dibuat",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Terjadi kesalahan dalam membuat rencana bisnis",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = () => {
    if (!results) return;

    const doc = new jsPDF();
    const lineHeight = 7;
    const margin = 15;
    let y = margin;
    const pageWidth = doc.internal.pageSize.getWidth() - (margin * 2);
    
    // Helper untuk text wrapping & styling
    const addWrappedText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      const textLines = doc.splitTextToSize(text, pageWidth);
      
      // Check if need to add new page
      if (y + (textLines.length * lineHeight) > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }
      
      doc.text(textLines, margin, y);
      y += textLines.length * lineHeight;
    };
    
    const addSection = (title: string, content: string) => {
      addWrappedText(title, 12, true);
      y += 3;
      addWrappedText(content);
      y += 5;
    };
    
    // Title
    addWrappedText(`RENCANA BISNIS: ${formData.businessType} - ${formData.industry}`.toUpperCase(), 16, true);
    y += 10;
    
    // Executive Summary
    if (results.executiveSummary) {
      addSection("Ringkasan Eksekutif", results.executiveSummary);
    }
    
    // Business Description
    addSection("Deskripsi Bisnis", results.businessDescription);
    
    // Mission & Vision
    if (results.missionAndVision) {
      addSection("Misi dan Visi", results.missionAndVision);
    }
    
    // Market Analysis
    if (results.marketAnalysis) {
      addSection("Analisis Pasar", results.marketAnalysis.overview);
      
      // Trends
      if (results.marketAnalysis.trends.length > 0) {
        addWrappedText("Tren Pasar:", 11, true);
        y += 2;
        results.marketAnalysis.trends.forEach((trend, index) => {
          addWrappedText(`${index + 1}. ${trend}`);
        });
        y += 3;
      }
      
      if (results.marketAnalysis.targetCustomers) {
        addWrappedText("Target Pelanggan:", 11, true);
        y += 2;
        addWrappedText(results.marketAnalysis.targetCustomers);
        y += 3;
      }
      
      if (results.marketAnalysis.marketSize) {
        addWrappedText("Ukuran Pasar:", 11, true);
        y += 2;
        addWrappedText(results.marketAnalysis.marketSize);
        y += 3;
      }
      
      if (results.marketAnalysis.growthPotential) {
        addWrappedText("Potensi Pertumbuhan:", 11, true);
        y += 2;
        addWrappedText(results.marketAnalysis.growthPotential);
        y += 3;
      }
    }
    
    // Competitor Analysis
    if (results.competitorAnalysis) {
      addSection("Analisis Kompetitor", results.competitorAnalysis.overview);
      
      // Main Competitors
      if (results.competitorAnalysis.mainCompetitors.length > 0) {
        addWrappedText("Kompetitor Utama:", 11, true);
        y += 2;
        
        results.competitorAnalysis.mainCompetitors.forEach((competitor, index) => {
          addWrappedText(`${index + 1}. ${competitor.name}`, 10, true);
          y += 1;
          
          addWrappedText("Kekuatan:", 10, false);
          competitor.strengths.forEach((strength, idx) => {
            addWrappedText(`   • ${strength}`);
          });
          y += 1;
          
          addWrappedText("Kelemahan:", 10, false);
          competitor.weaknesses.forEach((weakness, idx) => {
            addWrappedText(`   • ${weakness}`);
          });
          y += 3;
        });
      }
      
      if (results.competitorAnalysis.competitiveAdvantage) {
        addWrappedText("Keunggulan Kompetitif:", 11, true);
        y += 2;
        addWrappedText(results.competitorAnalysis.competitiveAdvantage);
        y += 5;
      }
    }
    
    // Marketing Strategy
    if (results.marketingStrategy) {
      addSection("Strategi Pemasaran", results.marketingStrategy.overview);
      
      // Channels
      if (results.marketingStrategy.channels.length > 0) {
        addWrappedText("Saluran Pemasaran:", 11, true);
        y += 2;
        results.marketingStrategy.channels.forEach((channel, index) => {
          addWrappedText(`• ${channel}`);
        });
        y += 3;
      }
      
      // Promotional Activities
      if (results.marketingStrategy.promotionalActivities.length > 0) {
        addWrappedText("Aktivitas Promosi:", 11, true);
        y += 2;
        results.marketingStrategy.promotionalActivities.forEach((activity, index) => {
          addWrappedText(`• ${activity}`);
        });
        y += 3;
      }
      
      if (results.marketingStrategy.pricingStrategy) {
        addWrappedText("Strategi Penetapan Harga:", 11, true);
        y += 2;
        addWrappedText(results.marketingStrategy.pricingStrategy);
        y += 3;
      }
      
      if (results.marketingStrategy.salesProcess) {
        addWrappedText("Proses Penjualan:", 11, true);
        y += 2;
        addWrappedText(results.marketingStrategy.salesProcess);
        y += 5;
      }
    }
    
    // Operations & Management
    if (results.operationsAndManagement) {
      addSection("Operasi dan Manajemen", results.operationsAndManagement.overview);
      
      if (results.operationsAndManagement.teamStructure) {
        addWrappedText("Struktur Tim:", 11, true);
        y += 2;
        addWrappedText(results.operationsAndManagement.teamStructure);
        y += 3;
      }
      
      if (results.operationsAndManagement.keyRoles && results.operationsAndManagement.keyRoles.length > 0) {
        addWrappedText("Peran Kunci:", 11, true);
        y += 2;
        results.operationsAndManagement.keyRoles.forEach((role, index) => {
          addWrappedText(`• ${role}`);
        });
        y += 3;
      }
      
      if (results.operationsAndManagement.facilities) {
        addWrappedText("Fasilitas:", 11, true);
        y += 2;
        addWrappedText(results.operationsAndManagement.facilities);
        y += 3;
      }
      
      if (results.operationsAndManagement.equipment) {
        addWrappedText("Peralatan:", 11, true);
        y += 2;
        addWrappedText(results.operationsAndManagement.equipment);
        y += 3;
      }
      
      if (results.operationsAndManagement.suppliers) {
        addWrappedText("Pemasok:", 11, true);
        y += 2;
        addWrappedText(results.operationsAndManagement.suppliers);
        y += 5;
      }
    }
    
    // Financials
    if (results.financials) {
      addSection("Proyeksi Keuangan", results.financials.overview);
      
      if (results.financials.startupCosts) {
        addWrappedText("Biaya Awal:", 11, true);
        y += 2;
        addWrappedText(results.financials.startupCosts);
        y += 3;
      }
      
      if (results.financials.monthlyExpenses) {
        addWrappedText("Biaya Bulanan:", 11, true);
        y += 2;
        addWrappedText(results.financials.monthlyExpenses);
        y += 3;
      }
      
      if (results.financials.projectedRevenue) {
        addWrappedText("Proyeksi Pendapatan:", 11, true);
        y += 2;
        addWrappedText(results.financials.projectedRevenue);
        y += 3;
      }
      
      if (results.financials.breakEvenAnalysis) {
        addWrappedText("Analisis Break-Even:", 11, true);
        y += 2;
        addWrappedText(results.financials.breakEvenAnalysis);
        y += 3;
      }
      
      if (results.financials.fundingNeeded) {
        addWrappedText("Dana yang Dibutuhkan:", 11, true);
        y += 2;
        addWrappedText(results.financials.fundingNeeded);
        y += 5;
      }
    }
    
    // Risk Analysis
    if (results.riskAnalysis) {
      addSection("Analisis Risiko", results.riskAnalysis.overview);
      
      if (results.riskAnalysis.keyRisks.length > 0) {
        addWrappedText("Risiko Utama:", 11, true);
        y += 2;
        
        results.riskAnalysis.keyRisks.forEach((risk, index) => {
          addWrappedText(`${index + 1}. ${risk.description}`, 10, true);
          y += 1;
          addWrappedText(`   • Dampak: ${risk.impact === "high" ? "Tinggi" : risk.impact === "medium" ? "Sedang" : "Rendah"}`);
          addWrappedText(`   • Strategi Mitigasi: ${risk.mitigationStrategy}`);
          y += 3;
        });
      }
    }
    
    // Implementation Timeline
    if (results.implementationTimeline) {
      addSection("Timeline Implementasi", results.implementationTimeline.overview);
      
      if (results.implementationTimeline.milestones.length > 0) {
        addWrappedText("Tonggak Pencapaian:", 11, true);
        y += 2;
        
        results.implementationTimeline.milestones.forEach((milestone, index) => {
          addWrappedText(`${index + 1}. ${milestone.phase}`, 10, true);
          addWrappedText(`   • ${milestone.description}`);
          addWrappedText(`   • Timeframe: ${milestone.timeframe}`);
          y += 3;
        });
      }
    }
    
    // Conclusion
    if (results.conclusion) {
      addSection("Kesimpulan", results.conclusion);
    }
    
    // Footer
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Dibuat pada ${new Date().toLocaleDateString()} menggunakan Gemini AI Business Plan Generator`, margin, doc.internal.pageSize.getHeight() - 10);
    
    // Simpan PDF
    const fileName = `business-plan-${formData.businessType}-${formData.industry}-${new Date().getTime()}.pdf`;
    doc.save(fileName);
    
    toast({
      title: "PDF Berhasil Dibuat",
      description: `File ${fileName} telah diunduh`,
    });
  };

  const getBusinessTypeLabel = (value: string) => {
    const type = businessTypes.find(type => type.value === value);
    return type ? type.label : value;
  };

  const getIndustryLabel = (value: string) => {
    const industry = industries.find(industry => industry.value === value);
    return industry ? industry.label : value;
  };

  const renderImpactBadge = (impact: "low" | "medium" | "high") => {
    let color;
    let label;
    
    switch (impact) {
      case "low":
        color = "bg-green-100 text-green-800";
        label = "Rendah";
        break;
      case "medium":
        color = "bg-yellow-100 text-yellow-800";
        label = "Sedang";
        break;
      case "high":
        color = "bg-red-100 text-red-800";
        label = "Tinggi";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
        label = impact;
    }
    
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 pt-16 md:pt-8 pb-8">
        <Breadcrumb items={[
          { label: "Tools", path: "/tools" },
          { label: "Business Plan Generator", path: "/business-plan-generator", isActive: true }
        ]} />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Plan Generator</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Buat rencana bisnis lengkap dengan analisis pasar, kompetitor, dan proyeksi keuangan
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Alert className="max-w-md bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertTitle className="text-blue-600 dark:text-blue-400">Tips</AlertTitle>
              <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
                Berikan detail yang spesifik untuk hasil yang lebih baik. Semakin detail informasi yang diberikan, semakin akurat rencana bisnis yang dihasilkan.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <Tabs
          defaultValue="input"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full max-w-md mx-auto mb-6">
            <TabsTrigger value="input" className="flex-1 flex items-center justify-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Input Data</span>
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!results} className="flex-1 flex items-center justify-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>Hasil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Bisnis</CardTitle>
                <CardDescription>
                  Masukkan informasi bisnis untuk membuat rencana bisnis yang komprehensif
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="businessType">Tipe Bisnis <span className="text-red-500">*</span></Label>
                        <Select 
                          value={formData.businessType} 
                          onValueChange={(value) => handleSelectChange("businessType", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih tipe bisnis" />
                          </SelectTrigger>
                          <SelectContent>
                            {businessTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="industry">Industri <span className="text-red-500">*</span></Label>
                        <Select 
                          value={formData.industry} 
                          onValueChange={(value) => handleSelectChange("industry", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih industri" />
                          </SelectTrigger>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry.value} value={industry.value}>
                                {industry.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="targetMarket">Target Pasar <span className="text-red-500">*</span></Label>
                        <Input
                          id="targetMarket"
                          name="targetMarket"
                          placeholder="Contoh: Pria 20-35 tahun, penggemar olahraga"
                          value={formData.targetMarket}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="location">Lokasi <span className="text-red-500">*</span></Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="Contoh: Jakarta, Indonesia"
                          value={formData.location}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="missionStatement">Pernyataan Misi</Label>
                        <Textarea
                          id="missionStatement"
                          name="missionStatement"
                          placeholder="Tujuan utama bisnis Anda"
                          rows={2}
                          value={formData.missionStatement || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="uniqueSellingProposition">Proposisi Nilai Unik</Label>
                        <Textarea
                          id="uniqueSellingProposition"
                          name="uniqueSellingProposition"
                          placeholder="Apa yang membuat bisnis Anda berbeda dari kompetitor"
                          rows={2}
                          value={formData.uniqueSellingProposition || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="budgetRange">Kisaran Anggaran</Label>
                        <Input
                          id="budgetRange"
                          name="budgetRange"
                          placeholder="Contoh: Rp50-100 juta"
                          value={formData.budgetRange || ""}
                          onChange={handleChange}
                        />
                      </div>

                      <div>
                        <Label htmlFor="teamSize">Ukuran Tim</Label>
                        <Input
                          id="teamSize"
                          name="teamSize"
                          placeholder="Contoh: 5-10 karyawan"
                          value={formData.teamSize || ""}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Detail Tambahan</h3>
                    
                    <div>
                      <Label htmlFor="timeFrame">Kerangka Waktu</Label>
                      <Input
                        id="timeFrame"
                        name="timeFrame"
                        placeholder="Contoh: Peluncuran dalam 6 bulan, BEP dalam 2 tahun"
                        value={formData.timeFrame || ""}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="competitiveAdvantage">Keunggulan Kompetitif</Label>
                      <Textarea
                        id="competitiveAdvantage"
                        name="competitiveAdvantage"
                        placeholder="Keunggulan bisnis Anda dibandingkan pesaing"
                        rows={2}
                        value={formData.competitiveAdvantage || ""}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="additionalContext">Konteks Tambahan</Label>
                      <Textarea
                        id="additionalContext"
                        name="additionalContext"
                        placeholder="Informasi tambahan yang relevan untuk rencana bisnis"
                        rows={3}
                        value={formData.additionalContext || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Konfigurasi Rencana Bisnis</h3>
                    
                    <div>
                      <Label className="mb-2 block">Panjang Rencana</Label>
                      <RadioGroup 
                        defaultValue="medium" 
                        value={formData.planLength}
                        onValueChange={(value) => handleSelectChange("planLength", value)}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="short" id="plan-short" />
                          <Label htmlFor="plan-short" className="cursor-pointer">Singkat</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="plan-medium" />
                          <Label htmlFor="plan-medium" className="cursor-pointer">Sedang</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="long" id="plan-long" />
                          <Label htmlFor="plan-long" className="cursor-pointer">Lengkap</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Bahasa</Label>
                      <RadioGroup 
                        defaultValue="id" 
                        value={formData.language}
                        onValueChange={(value) => handleSelectChange("language", value)}
                        className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="id" id="lang-id" />
                          <Label htmlFor="lang-id" className="cursor-pointer">Indonesia</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="en" id="lang-en" />
                          <Label htmlFor="lang-en" className="cursor-pointer">Inggris</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="includeExecutiveSummary" 
                          checked={formData.includeExecutiveSummary}
                          onCheckedChange={(checked) => handleSwitchChange("includeExecutiveSummary", checked)}
                        />
                        <Label htmlFor="includeExecutiveSummary" className="cursor-pointer">Ringkasan Eksekutif</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="includeMarketAnalysis" 
                          checked={formData.includeMarketAnalysis}
                          onCheckedChange={(checked) => handleSwitchChange("includeMarketAnalysis", checked)}
                        />
                        <Label htmlFor="includeMarketAnalysis" className="cursor-pointer">Analisis Pasar</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="includeCompetitorAnalysis" 
                          checked={formData.includeCompetitorAnalysis}
                          onCheckedChange={(checked) => handleSwitchChange("includeCompetitorAnalysis", checked)}
                        />
                        <Label htmlFor="includeCompetitorAnalysis" className="cursor-pointer">Analisis Kompetitor</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="includeMarketingStrategy" 
                          checked={formData.includeMarketingStrategy}
                          onCheckedChange={(checked) => handleSwitchChange("includeMarketingStrategy", checked)}
                        />
                        <Label htmlFor="includeMarketingStrategy" className="cursor-pointer">Strategi Pemasaran</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="includeFinancials" 
                          checked={formData.includeFinancials}
                          onCheckedChange={(checked) => handleSwitchChange("includeFinancials", checked)}
                        />
                        <Label htmlFor="includeFinancials" className="cursor-pointer">Proyeksi Keuangan</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="includeRiskAnalysis" 
                          checked={formData.includeRiskAnalysis}
                          onCheckedChange={(checked) => handleSwitchChange("includeRiskAnalysis", checked)}
                        />
                        <Label htmlFor="includeRiskAnalysis" className="cursor-pointer">Analisis Risiko</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto flex items-center space-x-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Membuat Rencana Bisnis...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Buat Rencana Bisnis</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            {results && (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    Rencana Bisnis: {getBusinessTypeLabel(formData.businessType)} - {getIndustryLabel(formData.industry)}
                  </h2>
                  <Button 
                    onClick={generatePDF} 
                    variant="outline" 
                    className="mt-3 sm:mt-0 flex items-center space-x-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download PDF</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-blue-600" />
                          Deskripsi Bisnis
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {results.executiveSummary && (
                            <div>
                              <h3 className="font-medium text-lg mb-2">Ringkasan Eksekutif</h3>
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{results.executiveSummary}</p>
                            </div>
                          )}
                          
                          <div>
                            <h3 className="font-medium text-lg mb-2">Deskripsi</h3>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{results.businessDescription}</p>
                          </div>
                          
                          {results.missionAndVision && (
                            <div>
                              <h3 className="font-medium text-lg mb-2">Misi dan Visi</h3>
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{results.missionAndVision}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="space-y-6">
                      {results.marketAnalysis && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Target className="h-5 w-5 mr-2 text-green-600" />
                              Analisis Pasar
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{results.marketAnalysis.overview}</p>
                              
                              {results.marketAnalysis.trends.length > 0 && (
                                <div>
                                  <h3 className="font-medium text-lg mb-2">Tren Pasar</h3>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {results.marketAnalysis.trends.map((trend, index) => (
                                      <li key={index} className="text-gray-700 dark:text-gray-300">{trend}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              <div>
                                <h3 className="font-medium text-lg mb-2">Target Pelanggan</h3>
                                <p className="text-gray-700 dark:text-gray-300">{results.marketAnalysis.targetCustomers}</p>
                              </div>
                              
                              {results.marketAnalysis.marketSize && (
                                <div>
                                  <h3 className="font-medium text-lg mb-2">Ukuran Pasar</h3>
                                  <p className="text-gray-700 dark:text-gray-300">{results.marketAnalysis.marketSize}</p>
                                </div>
                              )}
                              
                              {results.marketAnalysis.growthPotential && (
                                <div>
                                  <h3 className="font-medium text-lg mb-2">Potensi Pertumbuhan</h3>
                                  <p className="text-gray-700 dark:text-gray-300">{results.marketAnalysis.growthPotential}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {results.competitorAnalysis && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Users className="h-5 w-5 mr-2 text-orange-600" />
                              Analisis Kompetitor
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{results.competitorAnalysis.overview}</p>
                              
                              {results.competitorAnalysis.mainCompetitors.length > 0 && (
                                <div>
                                  <h3 className="font-medium text-lg mb-2">Kompetitor Utama</h3>
                                  <div className="space-y-4">
                                    {results.competitorAnalysis.mainCompetitors.map((competitor, index) => (
                                      <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <h4 className="font-medium text-base mb-2">{competitor.name}</h4>
                                        
                                        <div className="mb-2">
                                          <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Kekuatan:</h5>
                                          <ul className="list-disc pl-5 space-y-1">
                                            {competitor.strengths.map((strength, idx) => (
                                              <li key={idx} className="text-gray-700 dark:text-gray-300 text-sm">{strength}</li>
                                            ))}
                                          </ul>
                                        </div>
                                        
                                        <div>
                                          <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Kelemahan:</h5>
                                          <ul className="list-disc pl-5 space-y-1">
                                            {competitor.weaknesses.map((weakness, idx) => (
                                              <li key={idx} className="text-gray-700 dark:text-gray-300 text-sm">{weakness}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              <div>
                                <h3 className="font-medium text-lg mb-2">Keunggulan Kompetitif</h3>
                                <p className="text-gray-700 dark:text-gray-300">{results.competitorAnalysis.competitiveAdvantage}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {results.marketingStrategy && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
                              Strategi Pemasaran
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{results.marketingStrategy.overview}</p>
                              
                              {results.marketingStrategy.channels.length > 0 && (
                                <div>
                                  <h3 className="font-medium text-lg mb-2">Saluran Pemasaran</h3>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {results.marketingStrategy.channels.map((channel, index) => (
                                      <li key={index} className="text-gray-700 dark:text-gray-300">{channel}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {results.marketingStrategy.promotionalActivities.length > 0 && (
                                <div>
                                  <h3 className="font-medium text-lg mb-2">Aktivitas Promosi</h3>
                                  <ul className="list-disc pl-5 space-y-1">
                                    {results.marketingStrategy.promotionalActivities.map((activity, index) => (
                                      <li key={index} className="text-gray-700 dark:text-gray-300">{activity}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              <div>
                                <h3 className="font-medium text-lg mb-2">Strategi Penetapan Harga</h3>
                                <p className="text-gray-700 dark:text-gray-300">{results.marketingStrategy.pricingStrategy}</p>
                              </div>
                              
                              {results.marketingStrategy.salesProcess && (
                                <div>
                                  <h3 className="font-medium text-lg mb-2">Proses Penjualan</h3>
                                  <p className="text-gray-700 dark:text-gray-300">{results.marketingStrategy.salesProcess}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {results.financials && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
                              Proyeksi Keuangan
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{results.financials.overview}</p>
                              
                              {results.financials.startupCosts && (
                                <div>
                                  <h3 className="font-medium text-lg mb-2">Biaya Awal</h3>
                                  <p className="text-gray-700 dark:text-gray-300">{results.financials.startupCosts}</p>
                                </div>
                              )}
                              
                              {results.financials.monthlyExpenses && (
                                <div>
                                  <h3 className="font-medium text-lg mb-2">Biaya Bulanan</h3>
                                  <p className="text-gray-700 dark:text-gray-300">{results.financials.monthlyExpenses}</p>
                                </div>
                              )}
                              
                              {results.financials.projectedRevenue && (
                                <div>
                                  <h3 className="font-medium text-lg mb-2">Proyeksi Pendapatan</h3>
                                  <p className="text-gray-700 dark:text-gray-300">{results.financials.projectedRevenue}</p>
                                </div>
                              )}
                              
                              {results.financials.breakEvenAnalysis && (
                                <div>
                                  <h3 className="font-medium text-lg mb-2">Analisis Break-Even</h3>
                                  <p className="text-gray-700 dark:text-gray-300">{results.financials.breakEvenAnalysis}</p>
                                </div>
                              )}
                              
                              {results.financials.fundingNeeded && (
                                <div>
                                  <h3 className="font-medium text-lg mb-2">Dana yang Dibutuhkan</h3>
                                  <p className="text-gray-700 dark:text-gray-300">{results.financials.fundingNeeded}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-1 space-y-6">
                    {results.operationsAndManagement && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-base">
                            <Building className="h-4 w-4 mr-2 text-gray-600" />
                            Operasi dan Manajemen
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{results.operationsAndManagement.overview}</p>
                          
                          {results.operationsAndManagement.teamStructure && (
                            <div>
                              <h3 className="font-medium text-sm mb-1">Struktur Tim</h3>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">{results.operationsAndManagement.teamStructure}</p>
                            </div>
                          )}
                          
                          {results.operationsAndManagement.keyRoles && results.operationsAndManagement.keyRoles.length > 0 && (
                            <div>
                              <h3 className="font-medium text-sm mb-1">Peran Kunci</h3>
                              <ul className="list-disc pl-5 space-y-0.5">
                                {results.operationsAndManagement.keyRoles.map((role, index) => (
                                  <li key={index} className="text-gray-700 dark:text-gray-300 text-sm">{role}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {results.operationsAndManagement.facilities && (
                            <div>
                              <h3 className="font-medium text-sm mb-1">Fasilitas</h3>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">{results.operationsAndManagement.facilities}</p>
                            </div>
                          )}
                          
                          {results.operationsAndManagement.equipment && (
                            <div>
                              <h3 className="font-medium text-sm mb-1">Peralatan</h3>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">{results.operationsAndManagement.equipment}</p>
                            </div>
                          )}
                          
                          {results.operationsAndManagement.suppliers && (
                            <div>
                              <h3 className="font-medium text-sm mb-1">Pemasok</h3>
                              <p className="text-gray-700 dark:text-gray-300 text-sm">{results.operationsAndManagement.suppliers}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {results.riskAnalysis && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-base">
                            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                            Analisis Risiko
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{results.riskAnalysis.overview}</p>
                          
                          {results.riskAnalysis.keyRisks.length > 0 && (
                            <div>
                              <h3 className="font-medium text-sm mb-2">Risiko Utama</h3>
                              <div className="space-y-3">
                                {results.riskAnalysis.keyRisks.map((risk, index) => (
                                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-1">
                                      <h4 className="font-medium text-sm">{risk.description}</h4>
                                      {renderImpactBadge(risk.impact)}
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                                      <span className="font-medium">Mitigasi:</span> {risk.mitigationStrategy}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {results.implementationTimeline && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-base">
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                            Timeline Implementasi
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p className="text-gray-700 dark:text-gray-300 text-sm">{results.implementationTimeline.overview}</p>
                          
                          {results.implementationTimeline.milestones.length > 0 && (
                            <div>
                              <h3 className="font-medium text-sm mb-2">Tonggak Pencapaian</h3>
                              <div className="space-y-3">
                                {results.implementationTimeline.milestones.map((milestone, index) => (
                                  <div key={index} className="border-l-2 border-blue-400 pl-3 py-1">
                                    <h4 className="font-medium text-sm text-blue-600 dark:text-blue-400">{milestone.phase}</h4>
                                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-0.5">{milestone.description}</p>
                                    <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                      <Clock className="inline-block h-3 w-3 mr-1" />
                                      {milestone.timeframe}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {results.conclusion && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center text-base">
                            <Scroll className="h-4 w-4 mr-2 text-indigo-500" />
                            Kesimpulan
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">{results.conclusion}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AnimatedPage>
  );
}