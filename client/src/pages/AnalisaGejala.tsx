import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { analyzeSymptoms } from "@/lib/geminiApi";
import { SymptomAnalysisRequest } from "@/lib/types";
import {
  User,
  Activity,
  Thermometer,
  RefreshCw,
  BarChart,
  PlusCircle,
  MinusCircle,
  Clock,
  AlertCircle,
  Info,
  ThermometerSnowflake,
  Stethoscope,
  LucideIcon,
  FileText,
  Check,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";

// Daftar kategori gejala
interface SymptomCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  symptoms: Symptom[];
}

interface Symptom {
  id: string;
  name: string;
  severity?: number;
}

const symptomCategories: SymptomCategory[] = [
  {
    id: "umum",
    name: "Gejala Umum",
    icon: Thermometer,
    symptoms: [
      { id: "demam", name: "Demam" },
      { id: "kelelahan", name: "Kelelahan/Lemas" },
      { id: "malaise", name: "Malaise (Perasaan Tidak Enak Badan)" },
      { id: "keringat_malam", name: "Keringat Malam" },
      { id: "penurunan_berat", name: "Penurunan Berat Badan" }
    ]
  },
  {
    id: "kepala",
    name: "Kepala & Leher",
    icon: User,
    symptoms: [
      { id: "sakit_kepala", name: "Sakit Kepala" },
      { id: "pusing", name: "Pusing/Vertigo" },
      { id: "nyeri_mata", name: "Nyeri Mata" },
      { id: "sakit_telinga", name: "Sakit Telinga" },
      { id: "hidung_tersumbat", name: "Hidung Tersumbat" },
      { id: "bersin", name: "Bersin-bersin" },
      { id: "sakit_tenggorokan", name: "Sakit Tenggorokan" },
      { id: "pembesaran_kelenjar", name: "Pembesaran Kelenjar Getah Bening" }
    ]
  },
  {
    id: "pernapasan",
    name: "Sistem Pernapasan",
    icon: Activity,
    symptoms: [
      { id: "batuk", name: "Batuk" },
      { id: "sesak_napas", name: "Sesak Napas" },
      { id: "nyeri_dada", name: "Nyeri Dada" },
      { id: "mengi", name: "Mengi (Wheezing)" },
      { id: "dahak", name: "Dahak/Sputum" }
    ]
  },
  {
    id: "pencernaan",
    name: "Sistem Pencernaan",
    icon: Activity,
    symptoms: [
      { id: "mual", name: "Mual" },
      { id: "muntah", name: "Muntah" },
      { id: "diare", name: "Diare" },
      { id: "sembelit", name: "Sembelit" },
      { id: "nyeri_perut", name: "Nyeri Perut" },
      { id: "kembung", name: "Kembung" },
      { id: "nafsu_makan_berkurang", name: "Nafsu Makan Berkurang" }
    ]
  },
  {
    id: "muskuloskeletal",
    name: "Muskuloskeletal",
    icon: Activity,
    symptoms: [
      { id: "nyeri_sendi", name: "Nyeri Sendi" },
      { id: "nyeri_otot", name: "Nyeri Otot" },
      { id: "kaku_sendi", name: "Kaku Sendi" },
      { id: "bengkak_sendi", name: "Bengkak pada Sendi" },
      { id: "keterbatasan_gerak", name: "Keterbatasan Gerakan" }
    ]
  },
  {
    id: "kulit",
    name: "Kulit",
    icon: User,
    symptoms: [
      { id: "ruam", name: "Ruam" },
      { id: "gatal", name: "Gatal" },
      { id: "kemerahan", name: "Kemerahan" },
      { id: "bengkak_kulit", name: "Bengkak" },
      { id: "luka", name: "Luka yang Tidak Sembuh" }
    ]
  },
];

export default function AnalisaGejala() {
  const [age, setAge] = useState<string>("30");
  const [gender, setGender] = useState<string>("pria");
  const [duration, setDuration] = useState<string>("3-7");
  const [selectedSymptoms, setSelectedSymptoms] = useState<{[key: string]: number}>({});
  const [medicalHistory, setMedicalHistory] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [possibleConditions, setPossibleConditions] = useState<{name: string, probability: number, description: string}[]>([]);
  const [recomendations, setRecomendations] = useState<string[]>([]);

  const { toast } = useToast();

  const isSymptomSelected = (symptomId: string) => {
    return selectedSymptoms[symptomId] !== undefined;
  };

  const toggleSymptom = (symptomId: string) => {
    const newSelectedSymptoms = {...selectedSymptoms};
    
    if (isSymptomSelected(symptomId)) {
      delete newSelectedSymptoms[symptomId];
    } else {
      newSelectedSymptoms[symptomId] = 5; // Default to medium severity
    }
    
    setSelectedSymptoms(newSelectedSymptoms);
  };

  const updateSymptomSeverity = (symptomId: string, severity: number) => {
    setSelectedSymptoms({
      ...selectedSymptoms,
      [symptomId]: severity
    });
  };

  const toggleMedicalHistory = (condition: string) => {
    setMedicalHistory(prev => 
      prev.includes(condition) 
        ? prev.filter(item => item !== condition)
        : [...prev, condition]
    );
  };

  // Menggunakan API Gemini untuk analisis gejala
  const analyzeSymptomsMutation = useMutation({
    mutationFn: async (data: SymptomAnalysisRequest) => {
      return await analyzeSymptoms(data);
    },
    onSuccess: (data) => {
      setAnalysisResult(data.analysisText);
      setPossibleConditions(data.possibleConditions);
      setRecomendations(data.recommendations);
      
      toast({
        title: "Analisis Selesai",
        description: "Analisis gejala telah selesai dilakukan",
      });
      
      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('analysis-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    },
    onError: () => {
      toast({
        title: "Gagal Melakukan Analisis",
        description: "Terjadi kesalahan saat menganalisis gejala. Silakan coba lagi.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (Object.keys(selectedSymptoms).length === 0) {
      toast({
        title: "Input Tidak Lengkap",
        description: "Silakan pilih minimal satu gejala untuk dianalisis",
        variant: "destructive",
      });
      return;
    }
    
    const data: SymptomAnalysisRequest = {
      age,
      gender,
      duration,
      symptoms: selectedSymptoms,
      medicalHistory,
      additionalNotes,
    };
    
    analyzeSymptomsMutation.mutate(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mt-6">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Analisis Gejala", path: "/tools/analisis-gejala", isActive: true }
        ]} 
      />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
          <Activity className="text-blue-600 mr-2" /> 
          Analisis Gejala
        </h1>
        <p className="text-gray-600 mt-2">
          Masukkan gejala yang Anda alami untuk mendapatkan analisis awal tentang kemungkinan kondisi kesehatan
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Input */}
        <div className="lg:col-span-7">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" /> Informasi Pribadi
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="age">Usia</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)}
                    min="0"
                    max="120"
                  />
                </div>
                
                <div>
                  <Label>Jenis Kelamin</Label>
                  <RadioGroup value={gender} onValueChange={setGender} className="flex space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pria" id="pria" />
                      <Label htmlFor="pria">Pria</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wanita" id="wanita" />
                      <Label htmlFor="wanita">Wanita</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              
              <div className="mb-6">
                <Label htmlFor="duration">Durasi Gejala</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Pilih durasi gejala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<1">Kurang dari 1 hari</SelectItem>
                    <SelectItem value="1-2">1-2 hari</SelectItem>
                    <SelectItem value="3-7">3-7 hari</SelectItem>
                    <SelectItem value="1-2w">1-2 minggu</SelectItem>
                    <SelectItem value="2-4w">2-4 minggu</SelectItem>
                    <SelectItem value=">4w">Lebih dari 4 minggu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Thermometer className="h-5 w-5 mr-2 text-blue-600" /> Gejala yang Dialami
              </h2>
              
              <Accordion type="multiple" className="mb-6">
                {symptomCategories.map((category) => (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="hover:bg-gray-50 px-3 py-2 rounded-md">
                      <div className="flex items-center text-left">
                        <category.icon className="h-5 w-5 mr-2 text-blue-600" />
                        <span>{category.name}</span>
                        {Object.keys(selectedSymptoms).some(id => 
                          category.symptoms.some(s => s.id === id)
                        ) && (
                          <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                            {category.symptoms.filter(s => isSymptomSelected(s.id)).length}
                          </div>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-0">
                      <div className="space-y-2 mb-4">
                        {category.symptoms.map((symptom) => (
                          <div key={symptom.id} className="border border-gray-200 rounded-md p-3">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <Checkbox 
                                  id={symptom.id} 
                                  checked={isSymptomSelected(symptom.id)}
                                  onCheckedChange={() => toggleSymptom(symptom.id)}
                                  className="mr-2"
                                />
                                <Label 
                                  htmlFor={symptom.id} 
                                  className={`font-medium ${isSymptomSelected(symptom.id) ? 'text-black' : 'text-gray-700'}`}
                                >
                                  {symptom.name}
                                </Label>
                              </div>
                            </div>
                            
                            {isSymptomSelected(symptom.id) && (
                              <div className="mt-3 pl-6">
                                <Label htmlFor={`severity-${symptom.id}`} className="mb-2 block text-sm">
                                  Tingkat Keparahan:
                                  <span className="ml-2 font-medium">
                                    {
                                      selectedSymptoms[symptom.id] <= 3 ? 'Ringan' :
                                      selectedSymptoms[symptom.id] <= 7 ? 'Sedang' : 'Berat'
                                    }
                                  </span>
                                </Label>
                                <div className="flex items-center space-x-2">
                                  <ThermometerSnowflake className="h-4 w-4 text-blue-500" />
                                  <Slider
                                    id={`severity-${symptom.id}`}
                                    min={1}
                                    max={10}
                                    step={1}
                                    value={[selectedSymptoms[symptom.id]]}
                                    onValueChange={(value) => updateSymptomSeverity(symptom.id, value[0])}
                                    className="flex-1"
                                  />
                                  <Thermometer className="h-4 w-4 text-red-500" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600" /> Riwayat Kesehatan
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {[
                  "Diabetes", "Hipertensi", "Penyakit Jantung", "Asma",
                  "Alergi", "Penyakit Paru", "Gangguan Tiroid", "Arthritis"
                ].map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`history-${condition}`} 
                      checked={medicalHistory.includes(condition)}
                      onCheckedChange={() => toggleMedicalHistory(condition)}
                    />
                    <Label htmlFor={`history-${condition}`}>{condition}</Label>
                  </div>
                ))}
              </div>
              
              <div className="mb-6">
                <Label htmlFor="additional-notes">Catatan Tambahan</Label>
                <Textarea 
                  id="additional-notes" 
                  placeholder="Berikan informasi tambahan yang mungkin relevan dengan kondisi Anda (opsional)"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleAnalyze}
                disabled={analyzeSymptomsMutation.isPending || Object.keys(selectedSymptoms).length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {analyzeSymptomsMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Menganalisis Gejala...
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" /> Analisis Gejala
                  </>
                )}
              </Button>
              
              <div className="mt-4 text-sm text-gray-500 flex items-start">
                <AlertCircle className="h-4 w-4 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                <p>
                  Analisis ini hanya memberikan informasi awal dan tidak menggantikan konsultasi dengan tenaga medis profesional. Silakan kunjungi fasilitas kesehatan untuk diagnosis dan pengobatan yang tepat.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Hasil Analisis */}
        <div className="lg:col-span-5">
          <div id="analysis-results">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-blue-600" /> Hasil Analisis
                </h2>
                
                {analyzeSymptomsMutation.isPending ? (
                  <div className="text-center p-8">
                    <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Menganalisis gejala Anda...</p>
                    <p className="text-gray-400 text-sm mt-2">Hal ini mungkin membutuhkan beberapa detik</p>
                  </div>
                ) : analysisResult ? (
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
                      <p className="text-gray-800">{analysisResult}</p>
                    </div>
                    
                    {possibleConditions.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Stethoscope className="h-4 w-4 mr-2" /> Kemungkinan Kondisi
                        </h3>
                        
                        <div className="space-y-3">
                          {possibleConditions.map((condition, i) => (
                            <div key={i} className="border border-gray-200 rounded-md p-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-gray-900">{condition.name}</h4>
                                <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                  {condition.probability}%
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm mt-1">{condition.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {recomendations.length > 0 && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Info className="h-4 w-4 mr-2" /> Rekomendasi
                        </h3>
                        
                        <ul className="space-y-2">
                          {recomendations.map((rec, i) => (
                            <li key={i} className="flex items-start">
                              <div className="bg-green-100 text-green-800 w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5 mr-2">
                                <Check className="h-3 w-3" />
                              </div>
                              <span className="text-gray-700">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-md text-amber-800 flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Perhatian</p>
                        <p className="text-sm mt-1">
                          Analisis ini bersifat informatif dan tidak menggantikan konsultasi medis profesional. Jika Anda mengalami gejala yang parah atau berlangsung lama, segera kunjungi fasilitas kesehatan terdekat.
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => window.open("/tools/konsultasi-kesehatan", "_self")}
                        className="w-full"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Konsultasi dengan Dokter AI
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Belum Ada Hasil Analisis</p>
                    <p className="text-gray-400 text-sm mt-2">Pilih gejala yang Anda alami dan klik tombol "Analisis Gejala"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}