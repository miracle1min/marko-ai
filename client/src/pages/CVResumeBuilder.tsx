import { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import {
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Languages,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Twitter,
  User,
  Calendar,
  Download,
  Plus,
  Trash2,
  Save,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";
import { cn } from "@/lib/utils";

// Define types for resume data
interface ResumeData {
  personal: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    twitter: string;
    bio: string;
    profileImage: string | null;
  };
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    achievements: string[];
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    gpa: string;
  }[];
  skills: {
    id: string;
    name: string;
    level: number; // 1-5
  }[];
  languages: {
    id: string;
    name: string;
    proficiency: "Beginner" | "Intermediate" | "Advanced" | "Fluent" | "Native";
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    link: string;
  }[];
  theme: "modern" | "classic" | "minimal" | "creative";
  color: "blue" | "green" | "purple" | "orange" | "red";
  font: "sans" | "serif" | "mono";
  layout: "standard" | "sidebar" | "compact";
}

// Initial resume data
const initialResumeData: ResumeData = {
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    twitter: "",
    bio: "",
    profileImage: null,
  },
  experience: [],
  education: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  theme: "modern",
  color: "blue",
  font: "sans",
  layout: "standard"
};

export default function CVResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeTab, setActiveTab] = useState("personal");
  const [currentExperienceId, setCurrentExperienceId] = useState<string | null>(null);
  const [currentEducationId, setCurrentEducationId] = useState<string | null>(null);
  const [currentSkillId, setCurrentSkillId] = useState<string | null>(null);
  const [currentLanguageId, setCurrentLanguageId] = useState<string | null>(null);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentCertificationId, setCurrentCertificationId] = useState<string | null>(null);
  const [achievement, setAchievement] = useState<string>("");
  const [technology, setTechnology] = useState<string>("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const resumeContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Handle personal info changes
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      personal: {
        ...resumeData.personal,
        [name]: value
      }
    });
  };

  // Handle file upload for profile image
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeData({
          ...resumeData,
          personal: {
            ...resumeData.personal,
            profileImage: event.target?.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate a unique ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };

  // Add new experience
  const addExperience = () => {
    const newId = generateId();
    setResumeData({
      ...resumeData,
      experience: [
        ...resumeData.experience,
        {
          id: newId,
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
          achievements: []
        }
      ]
    });
    setCurrentExperienceId(newId);
  };

  // Update experience
  const updateExperience = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => {
        if (exp.id === currentExperienceId) {
          return {
            ...exp,
            [name]: value
          };
        }
        return exp;
      })
    });
  };

  // Toggle current job
  const toggleCurrentJob = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => {
        if (exp.id === id) {
          return {
            ...exp,
            current: !exp.current,
            endDate: !exp.current ? "Present" : ""
          };
        }
        return exp;
      })
    });
  };

  // Add achievement to current experience
  const addAchievement = () => {
    if (!achievement.trim()) return;
    
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => {
        if (exp.id === currentExperienceId) {
          return {
            ...exp,
            achievements: [...exp.achievements, achievement]
          };
        }
        return exp;
      })
    });
    setAchievement("");
  };

  // Remove achievement
  const removeAchievement = (expId: string, index: number) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.map(exp => {
        if (exp.id === expId) {
          const newAchievements = [...exp.achievements];
          newAchievements.splice(index, 1);
          return {
            ...exp,
            achievements: newAchievements
          };
        }
        return exp;
      })
    });
  };

  // Delete experience
  const deleteExperience = (id: string) => {
    setResumeData({
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
    if (currentExperienceId === id) {
      setCurrentExperienceId(null);
    }
  };

  // Add new education
  const addEducation = () => {
    const newId = generateId();
    setResumeData({
      ...resumeData,
      education: [
        ...resumeData.education,
        {
          id: newId,
          school: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
          gpa: ""
        }
      ]
    });
    setCurrentEducationId(newId);
  };

  // Update education
  const updateEducation = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu => {
        if (edu.id === currentEducationId) {
          return {
            ...edu,
            [name]: value
          };
        }
        return edu;
      })
    });
  };

  // Toggle current education
  const toggleCurrentEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.map(edu => {
        if (edu.id === id) {
          return {
            ...edu,
            current: !edu.current,
            endDate: !edu.current ? "Present" : ""
          };
        }
        return edu;
      })
    });
  };

  // Delete education
  const deleteEducation = (id: string) => {
    setResumeData({
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    });
    if (currentEducationId === id) {
      setCurrentEducationId(null);
    }
  };

  // Add new skill
  const addSkill = () => {
    const newId = generateId();
    setResumeData({
      ...resumeData,
      skills: [
        ...resumeData.skills,
        {
          id: newId,
          name: "",
          level: 3
        }
      ]
    });
    setCurrentSkillId(newId);
  };

  // Update skill
  const updateSkill = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map(skill => {
        if (skill.id === currentSkillId) {
          return {
            ...skill,
            [name]: value
          };
        }
        return skill;
      })
    });
  };

  // Update skill level
  const updateSkillLevel = (id: string, level: number) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.map(skill => {
        if (skill.id === id) {
          return {
            ...skill,
            level
          };
        }
        return skill;
      })
    });
  };

  // Delete skill
  const deleteSkill = (id: string) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(skill => skill.id !== id)
    });
    if (currentSkillId === id) {
      setCurrentSkillId(null);
    }
  };

  // Add new language
  const addLanguage = () => {
    const newId = generateId();
    setResumeData({
      ...resumeData,
      languages: [
        ...resumeData.languages,
        {
          id: newId,
          name: "",
          proficiency: "Intermediate"
        }
      ]
    });
    setCurrentLanguageId(newId);
  };

  // Update language
  const updateLanguage = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      languages: resumeData.languages.map(lang => {
        if (lang.id === currentLanguageId) {
          return {
            ...lang,
            [name]: value
          };
        }
        return lang;
      })
    });
  };

  // Update language proficiency
  const updateLanguageProficiency = (
    id: string, 
    proficiency: "Beginner" | "Intermediate" | "Advanced" | "Fluent" | "Native"
  ) => {
    setResumeData({
      ...resumeData,
      languages: resumeData.languages.map(lang => {
        if (lang.id === id) {
          return {
            ...lang,
            proficiency
          };
        }
        return lang;
      })
    });
  };

  // Delete language
  const deleteLanguage = (id: string) => {
    setResumeData({
      ...resumeData,
      languages: resumeData.languages.filter(lang => lang.id !== id)
    });
    if (currentLanguageId === id) {
      setCurrentLanguageId(null);
    }
  };

  // Add new project
  const addProject = () => {
    const newId = generateId();
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        {
          id: newId,
          name: "",
          description: "",
          technologies: [],
          link: ""
        }
      ]
    });
    setCurrentProjectId(newId);
  };

  // Update project
  const updateProject = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map(project => {
        if (project.id === currentProjectId) {
          return {
            ...project,
            [name]: value
          };
        }
        return project;
      })
    });
  };

  // Add technology to current project
  const addTechnology = () => {
    if (!technology.trim()) return;
    
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map(project => {
        if (project.id === currentProjectId) {
          return {
            ...project,
            technologies: [...project.technologies, technology]
          };
        }
        return project;
      })
    });
    setTechnology("");
  };

  // Remove technology
  const removeTechnology = (projectId: string, index: number) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.map(project => {
        if (project.id === projectId) {
          const newTechnologies = [...project.technologies];
          newTechnologies.splice(index, 1);
          return {
            ...project,
            technologies: newTechnologies
          };
        }
        return project;
      })
    });
  };

  // Delete project
  const deleteProject = (id: string) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter(project => project.id !== id)
    });
    if (currentProjectId === id) {
      setCurrentProjectId(null);
    }
  };

  // Add new certification
  const addCertification = () => {
    const newId = generateId();
    setResumeData({
      ...resumeData,
      certifications: [
        ...resumeData.certifications,
        {
          id: newId,
          name: "",
          issuer: "",
          date: "",
          link: ""
        }
      ]
    });
    setCurrentCertificationId(newId);
  };

  // Update certification
  const updateCertification = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.map(cert => {
        if (cert.id === currentCertificationId) {
          return {
            ...cert,
            [name]: value
          };
        }
        return cert;
      })
    });
  };

  // Delete certification
  const deleteCertification = (id: string) => {
    setResumeData({
      ...resumeData,
      certifications: resumeData.certifications.filter(cert => cert.id !== id)
    });
    if (currentCertificationId === id) {
      setCurrentCertificationId(null);
    }
  };

  // Update theme settings
  const updateTheme = (name: string, value: string) => {
    setResumeData({
      ...resumeData,
      [name]: value
    });
  };

  // Export to PDF
  const exportToPDF = () => {
    const element = resumeContainerRef.current;
    if (!element) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    pdf.html(element, {
      x: margin,
      y: margin,
      html2canvas: {
        scale: 0.7, 
        useCORS: true,
        letterRendering: true,
      },
      width: pdfWidth - 2 * margin,
      windowWidth: element.offsetWidth,
      autoPaging: "text",
      margin: [margin, margin, margin, margin],
      callback: function(doc) {
        doc.save(`${resumeData.personal.fullName.replace(/\s+/g, '_')}_CV.pdf`);
        toast({
          title: "CV diunduh!",
          description: "CV berhasil diunduh sebagai PDF file.",
        });
      },
    });
  };

  // Save as template
  const saveTemplate = () => {
    try {
      localStorage.setItem('cv-resume-template', JSON.stringify(resumeData));
      toast({
        title: "Template tersimpan!",
        description: "Template CV berhasil disimpan ke browser Anda.",
      });
    } catch (error) {
      toast({
        title: "Gagal menyimpan template",
        description: "Terjadi kesalahan saat menyimpan template.",
        variant: "destructive"
      });
    }
  };

  // Load template
  const loadTemplate = () => {
    try {
      const saved = localStorage.getItem('cv-resume-template');
      if (saved) {
        setResumeData(JSON.parse(saved));
        toast({
          title: "Template dimuat!",
          description: "Template CV berhasil dimuat dari browser Anda.",
        });
      }
    } catch (error) {
      toast({
        title: "Gagal memuat template",
        description: "Terjadi kesalahan saat memuat template.",
        variant: "destructive"
      });
    }
  };

  // Reset form
  const resetForm = () => {
    if (confirm("Yakin ingin mengatur ulang semua data? Seluruh data akan hilang.")) {
      setResumeData(initialResumeData);
      toast({
        title: "Data direset!",
        description: "Semua data CV telah diatur ulang.",
      });
    }
  };

  // Get color class based on selected color
  const getColorClass = (color: string) => {
    switch (color) {
      case "blue": return "bg-blue-600";
      case "green": return "bg-green-600";
      case "purple": return "bg-purple-600";
      case "orange": return "bg-orange-600";
      case "red": return "bg-red-600";
      default: return "bg-blue-600";
    }
  };

  // Get font class based on selected font
  const getFontClass = (font: string) => {
    switch (font) {
      case "sans": return "font-sans";
      case "serif": return "font-serif";
      case "mono": return "font-mono";
      default: return "font-sans";
    }
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 pb-20 pt-8 mt-12">
      <Breadcrumb
        items={[
          { label: "Beranda", path: "/" },
          { label: "Tools", path: "/tools" },
          { label: "CV Resume Builder", path: "/tools/cv-resume-builder", isActive: true }
        ]}
      />

      <div className="text-center mt-8 mb-10">
        <h1 className="text-3xl font-bold mb-2">CV Resume Builder</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Buat CV profesional yang menarik dengan mudah dan ekspor ke PDF. 
          Tool ini membantu Anda menonjolkan kualifikasi dan pengalaman untuk 
          membuat kesan terbaik pada rekruter.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Form */}
        <div className={cn(
          "w-full transition-all duration-300",
          isPreviewMode ? "lg:w-0 lg:opacity-0 lg:hidden" : "lg:w-1/2"
        )}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Edit Resume</h2>
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={saveTemplate}>
                        <Save className="h-4 w-4 mr-1" />
                        Simpan
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Simpan sebagai template</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={loadTemplate}>
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Muat
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Muat template tersimpan</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" onClick={resetForm}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset ke data kosong</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="personal" className="text-xs md:text-sm">
                  <User className="h-4 w-4 mr-1 hidden sm:inline" />
                  Personal
                </TabsTrigger>
                <TabsTrigger value="experience" className="text-xs md:text-sm">
                  <Briefcase className="h-4 w-4 mr-1 hidden sm:inline" />
                  Pengalaman
                </TabsTrigger>
                <TabsTrigger value="education" className="text-xs md:text-sm">
                  <GraduationCap className="h-4 w-4 mr-1 hidden sm:inline" />
                  Pendidikan
                </TabsTrigger>
                <TabsTrigger value="more" className="text-xs md:text-sm">
                  <Plus className="h-4 w-4 mr-1 hidden sm:inline" />
                  Lainnya
                </TabsTrigger>
              </TabsList>

              <Card>
                <CardContent className="p-6">
                  {/* Personal Information Tab */}
                  <TabsContent value="personal" className="space-y-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Informasi Personal
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Nama Lengkap</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="John Doe"
                          value={resumeData.personal.fullName}
                          onChange={handlePersonalChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Posisi/Judul Pekerjaan</Label>
                        <Input
                          id="jobTitle"
                          name="jobTitle"
                          placeholder="Full Stack Developer"
                          value={resumeData.personal.jobTitle}
                          onChange={handlePersonalChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="johndoe@example.com"
                          value={resumeData.personal.email}
                          onChange={handlePersonalChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Telepon</Label>
                        <Input
                          id="phone"
                          name="phone"
                          placeholder="+62 812 3456 7890"
                          value={resumeData.personal.phone}
                          onChange={handlePersonalChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Lokasi</Label>
                        <Input
                          id="location"
                          name="location"
                          placeholder="Jakarta, Indonesia"
                          value={resumeData.personal.location}
                          onChange={handlePersonalChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          name="website"
                          placeholder="www.johndoe.com"
                          value={resumeData.personal.website}
                          onChange={handlePersonalChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          name="linkedin"
                          placeholder="linkedin.com/in/johndoe"
                          value={resumeData.personal.linkedin}
                          onChange={handlePersonalChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="github">GitHub</Label>
                        <Input
                          id="github"
                          name="github"
                          placeholder="github.com/johndoe"
                          value={resumeData.personal.github}
                          onChange={handlePersonalChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input
                          id="twitter"
                          name="twitter"
                          placeholder="twitter.com/johndoe"
                          value={resumeData.personal.twitter}
                          onChange={handlePersonalChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="profileImage">Foto Profil</Label>
                        <Input
                          id="profileImage"
                          name="profileImage"
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          className="file:bg-primary file:text-white file:rounded-md file:border-0 file:px-3 file:py-1 file:mr-4"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Ringkasan Profesional / Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Ringkasan singkat tentang diri Anda dan tujuan karir..."
                        rows={4}
                        value={resumeData.personal.bio}
                        onChange={handlePersonalChange}
                      />
                    </div>
                  </TabsContent>

                  {/* Experience Tab */}
                  <TabsContent value="experience" className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg flex items-center">
                        <Briefcase className="h-5 w-5 mr-2" />
                        Pengalaman Kerja
                      </h3>
                      <Button size="sm" variant="outline" onClick={addExperience}>
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah Pengalaman
                      </Button>
                    </div>

                    {resumeData.experience.length === 0 ? (
                      <div className="text-center py-6 border rounded-lg border-dashed">
                        <Briefcase className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">Belum ada pengalaman kerja. Klik tombol di atas untuk menambahkan.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {resumeData.experience.map((exp) => (
                            <Badge 
                              key={exp.id} 
                              variant={currentExperienceId === exp.id ? "default" : "outline"}
                              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              onClick={() => setCurrentExperienceId(exp.id)}
                            >
                              {exp.company || "Untitled"} - {exp.position || "Position"}
                            </Badge>
                          ))}
                        </div>

                        {currentExperienceId && (
                          <div className="space-y-4 border rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="company">Perusahaan</Label>
                                <Input
                                  id="company"
                                  name="company"
                                  placeholder="Nama Perusahaan"
                                  value={resumeData.experience.find(exp => exp.id === currentExperienceId)?.company || ""}
                                  onChange={updateExperience}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="position">Posisi</Label>
                                <Input
                                  id="position"
                                  name="position"
                                  placeholder="Judul Posisi"
                                  value={resumeData.experience.find(exp => exp.id === currentExperienceId)?.position || ""}
                                  onChange={updateExperience}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="startDate">Tanggal Mulai</Label>
                                <Input
                                  id="startDate"
                                  name="startDate"
                                  placeholder="Jan 2020"
                                  value={resumeData.experience.find(exp => exp.id === currentExperienceId)?.startDate || ""}
                                  onChange={updateExperience}
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="endDate">Tanggal Selesai</Label>
                                  <div className="flex items-center space-x-2">
                                    <Label htmlFor="currentJob" className="text-sm">Masih bekerja</Label>
                                    <Switch
                                      id="currentJob"
                                      checked={resumeData.experience.find(exp => exp.id === currentExperienceId)?.current || false}
                                      onCheckedChange={() => toggleCurrentJob(currentExperienceId!)}
                                    />
                                  </div>
                                </div>
                                <Input
                                  id="endDate"
                                  name="endDate"
                                  placeholder="Present"
                                  value={resumeData.experience.find(exp => exp.id === currentExperienceId)?.endDate || ""}
                                  onChange={updateExperience}
                                  disabled={resumeData.experience.find(exp => exp.id === currentExperienceId)?.current}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description">Deskripsi Pekerjaan</Label>
                              <Textarea
                                id="description"
                                name="description"
                                placeholder="Deskripsikan tanggung jawab dan peran Anda..."
                                rows={3}
                                value={resumeData.experience.find(exp => exp.id === currentExperienceId)?.description || ""}
                                onChange={updateExperience}
                              />
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <Label>Pencapaian Utama</Label>
                                <div className="flex items-center space-x-2">
                                  <Input
                                    placeholder="Tambahkan pencapaian..."
                                    value={achievement}
                                    onChange={(e) => setAchievement(e.target.value)}
                                    className="max-w-xs"
                                  />
                                  <Button type="button" size="sm" variant="outline" onClick={addAchievement}>
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="space-y-2 mt-2">
                                {resumeData.experience.find(exp => exp.id === currentExperienceId)?.achievements.map((achievement, index) => (
                                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded">
                                    <span>• {achievement}</span>
                                    <Button size="sm" variant="ghost" onClick={() => removeAchievement(currentExperienceId!, index)}>
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => deleteExperience(currentExperienceId!)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Hapus Pengalaman
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  {/* Education Tab */}
                  <TabsContent value="education" className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2" />
                        Pendidikan
                      </h3>
                      <Button size="sm" variant="outline" onClick={addEducation}>
                        <Plus className="h-4 w-4 mr-1" />
                        Tambah Pendidikan
                      </Button>
                    </div>

                    {resumeData.education.length === 0 ? (
                      <div className="text-center py-6 border rounded-lg border-dashed">
                        <GraduationCap className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">Belum ada riwayat pendidikan. Klik tombol di atas untuk menambahkan.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {resumeData.education.map((edu) => (
                            <Badge 
                              key={edu.id} 
                              variant={currentEducationId === edu.id ? "default" : "outline"}
                              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              onClick={() => setCurrentEducationId(edu.id)}
                            >
                              {edu.school || "Untitled"} - {edu.degree || "Degree"}
                            </Badge>
                          ))}
                        </div>

                        {currentEducationId && (
                          <div className="space-y-4 border rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="school">Sekolah/Universitas</Label>
                                <Input
                                  id="school"
                                  name="school"
                                  placeholder="Nama Institusi"
                                  value={resumeData.education.find(edu => edu.id === currentEducationId)?.school || ""}
                                  onChange={updateEducation}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="degree">Gelar</Label>
                                <Input
                                  id="degree"
                                  name="degree"
                                  placeholder="Sarjana, Magister, dll."
                                  value={resumeData.education.find(edu => edu.id === currentEducationId)?.degree || ""}
                                  onChange={updateEducation}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="field">Bidang Studi</Label>
                                <Input
                                  id="field"
                                  name="field"
                                  placeholder="Ilmu Komputer, Bisnis, dll."
                                  value={resumeData.education.find(edu => edu.id === currentEducationId)?.field || ""}
                                  onChange={updateEducation}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="gpa">IPK/Nilai</Label>
                                <Input
                                  id="gpa"
                                  name="gpa"
                                  placeholder="3.8/4.0, 90/100, dll."
                                  value={resumeData.education.find(edu => edu.id === currentEducationId)?.gpa || ""}
                                  onChange={updateEducation}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="startDate">Tanggal Mulai</Label>
                                <Input
                                  id="startDate"
                                  name="startDate"
                                  placeholder="Sep 2018"
                                  value={resumeData.education.find(edu => edu.id === currentEducationId)?.startDate || ""}
                                  onChange={updateEducation}
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="endDate">Tanggal Selesai</Label>
                                  <div className="flex items-center space-x-2">
                                    <Label htmlFor="currentEducation" className="text-sm">Masih belajar</Label>
                                    <Switch
                                      id="currentEducation"
                                      checked={resumeData.education.find(edu => edu.id === currentEducationId)?.current || false}
                                      onCheckedChange={() => toggleCurrentEducation(currentEducationId!)}
                                    />
                                  </div>
                                </div>
                                <Input
                                  id="endDate"
                                  name="endDate"
                                  placeholder="Present"
                                  value={resumeData.education.find(edu => edu.id === currentEducationId)?.endDate || ""}
                                  onChange={updateEducation}
                                  disabled={resumeData.education.find(edu => edu.id === currentEducationId)?.current}
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description">Deskripsi</Label>
                              <Textarea
                                id="description"
                                name="description"
                                placeholder="Detail tentang studi, prestasi akademik, atau kegiatan relevan..."
                                rows={3}
                                value={resumeData.education.find(edu => edu.id === currentEducationId)?.description || ""}
                                onChange={updateEducation}
                              />
                            </div>

                            <div className="flex justify-end">
                              <Button 
                                variant="destructive" 
                                size="sm" 
                                onClick={() => deleteEducation(currentEducationId!)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Hapus Pendidikan
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </TabsContent>

                  {/* More Tab */}
                  <TabsContent value="more">
                    <Tabs defaultValue="skills">
                      <TabsList className="w-full mb-4">
                        <TabsTrigger value="skills">
                          <Code className="h-4 w-4 mr-1 hidden sm:inline" />
                          Skill
                        </TabsTrigger>
                        <TabsTrigger value="languages">
                          <Languages className="h-4 w-4 mr-1 hidden sm:inline" />
                          Bahasa
                        </TabsTrigger>
                        <TabsTrigger value="projects">
                          <FileText className="h-4 w-4 mr-1 hidden sm:inline" />
                          Proyek
                        </TabsTrigger>
                        <TabsTrigger value="certificates">
                          <Award className="h-4 w-4 mr-1 hidden sm:inline" />
                          Sertifikasi
                        </TabsTrigger>
                        <TabsTrigger value="design">
                          <Settings className="h-4 w-4 mr-1 hidden sm:inline" />
                          Desain
                        </TabsTrigger>
                      </TabsList>

                      {/* Skills Tab */}
                      <TabsContent value="skills" className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg flex items-center">
                            <Code className="h-5 w-5 mr-2" />
                            Skills
                          </h3>
                          <Button size="sm" variant="outline" onClick={addSkill}>
                            <Plus className="h-4 w-4 mr-1" />
                            Tambah Skill
                          </Button>
                        </div>

                        {resumeData.skills.length === 0 ? (
                          <div className="text-center py-6 border rounded-lg border-dashed">
                            <Code className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-500">Belum ada skill. Klik tombol di atas untuk menambahkan.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {resumeData.skills.map((skill) => (
                              <div 
                                key={skill.id} 
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                onClick={() => setCurrentSkillId(skill.id)}
                              >
                                <div className="space-y-1 flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium">{skill.name || "Untitled Skill"}</div>
                                    <div className="ml-2 text-sm text-gray-500">
                                      {skill.level === 1 && "Pemula"}
                                      {skill.level === 2 && "Dasar"}
                                      {skill.level === 3 && "Menengah"}
                                      {skill.level === 4 && "Mahir"}
                                      {skill.level === 5 && "Ahli"}
                                    </div>
                                  </div>
                                  <Slider
                                    value={[skill.level]}
                                    min={1}
                                    max={5}
                                    step={1}
                                    onValueChange={(value) => updateSkillLevel(skill.id, value[0])}
                                    className="w-full"
                                  />
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSkill(skill.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}

                            {currentSkillId && (
                              <div className="mt-4 flex items-center space-x-2">
                                <Input
                                  name="name"
                                  placeholder="Nama Skill"
                                  value={resumeData.skills.find(skill => skill.id === currentSkillId)?.name || ""}
                                  onChange={updateSkill}
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>

                      {/* Languages Tab */}
                      <TabsContent value="languages" className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg flex items-center">
                            <Languages className="h-5 w-5 mr-2" />
                            Bahasa
                          </h3>
                          <Button size="sm" variant="outline" onClick={addLanguage}>
                            <Plus className="h-4 w-4 mr-1" />
                            Tambah Bahasa
                          </Button>
                        </div>

                        {resumeData.languages.length === 0 ? (
                          <div className="text-center py-6 border rounded-lg border-dashed">
                            <Languages className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-500">Belum ada bahasa. Klik tombol di atas untuk menambahkan.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {resumeData.languages.map((language) => (
                              <div 
                                key={language.id} 
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                onClick={() => setCurrentLanguageId(language.id)}
                              >
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium">{language.name || "Untitled Language"}</div>
                                    <Badge>
                                      {language.proficiency}
                                    </Badge>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteLanguage(language.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}

                            {currentLanguageId && (
                              <div className="mt-4 space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="languageName">Nama Bahasa</Label>
                                  <Input
                                    id="languageName"
                                    name="name"
                                    placeholder="Inggris, Indonesia, dll."
                                    value={resumeData.languages.find(lang => lang.id === currentLanguageId)?.name || ""}
                                    onChange={updateLanguage}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="proficiency">Tingkat Kemahiran</Label>
                                  <Select 
                                    value={resumeData.languages.find(lang => lang.id === currentLanguageId)?.proficiency}
                                    onValueChange={(value) => updateLanguageProficiency(
                                      currentLanguageId!, 
                                      value as "Beginner" | "Intermediate" | "Advanced" | "Fluent" | "Native"
                                    )}
                                  >
                                    <SelectTrigger id="proficiency">
                                      <SelectValue placeholder="Pilih tingkat kemahiran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Beginner">Pemula</SelectItem>
                                      <SelectItem value="Intermediate">Menengah</SelectItem>
                                      <SelectItem value="Advanced">Lanjutan</SelectItem>
                                      <SelectItem value="Fluent">Fasih</SelectItem>
                                      <SelectItem value="Native">Bahasa Ibu</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>

                      {/* Projects Tab */}
                      <TabsContent value="projects" className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg flex items-center">
                            <FileText className="h-5 w-5 mr-2" />
                            Proyek
                          </h3>
                          <Button size="sm" variant="outline" onClick={addProject}>
                            <Plus className="h-4 w-4 mr-1" />
                            Tambah Proyek
                          </Button>
                        </div>

                        {resumeData.projects.length === 0 ? (
                          <div className="text-center py-6 border rounded-lg border-dashed">
                            <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-500">Belum ada proyek. Klik tombol di atas untuk menambahkan.</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {resumeData.projects.map((project) => (
                                <Badge 
                                  key={project.id} 
                                  variant={currentProjectId === project.id ? "default" : "outline"}
                                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                  onClick={() => setCurrentProjectId(project.id)}
                                >
                                  {project.name || "Untitled Project"}
                                </Badge>
                              ))}
                            </div>

                            {currentProjectId && (
                              <div className="space-y-4 border rounded-lg p-4">
                                <div className="space-y-2">
                                  <Label htmlFor="projectName">Nama Proyek</Label>
                                  <Input
                                    id="projectName"
                                    name="name"
                                    placeholder="Nama Proyek"
                                    value={resumeData.projects.find(project => project.id === currentProjectId)?.name || ""}
                                    onChange={updateProject}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="projectDescription">Deskripsi</Label>
                                  <Textarea
                                    id="projectDescription"
                                    name="description"
                                    placeholder="Jelaskan tentang proyek ini..."
                                    rows={3}
                                    value={resumeData.projects.find(project => project.id === currentProjectId)?.description || ""}
                                    onChange={updateProject}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="projectLink">Link Proyek</Label>
                                  <Input
                                    id="projectLink"
                                    name="link"
                                    placeholder="https://github.com/username/project"
                                    value={resumeData.projects.find(project => project.id === currentProjectId)?.link || ""}
                                    onChange={updateProject}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <Label>Teknologi/Tools</Label>
                                    <div className="flex items-center space-x-2">
                                      <Input
                                        placeholder="Tambahkan teknologi..."
                                        value={technology}
                                        onChange={(e) => setTechnology(e.target.value)}
                                        className="max-w-xs"
                                      />
                                      <Button type="button" size="sm" variant="outline" onClick={addTechnology}>
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {resumeData.projects.find(project => project.id === currentProjectId)?.technologies.map((tech, index) => (
                                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                        {tech}
                                        <button 
                                          onClick={() => removeTechnology(currentProjectId!, index)}
                                          className="text-gray-500 hover:text-red-500 ml-1"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex justify-end">
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={() => deleteProject(currentProjectId!)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Hapus Proyek
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>

                      {/* Certificates Tab */}
                      <TabsContent value="certificates" className="space-y-6">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg flex items-center">
                            <Award className="h-5 w-5 mr-2" />
                            Sertifikasi
                          </h3>
                          <Button size="sm" variant="outline" onClick={addCertification}>
                            <Plus className="h-4 w-4 mr-1" />
                            Tambah Sertifikasi
                          </Button>
                        </div>

                        {resumeData.certifications.length === 0 ? (
                          <div className="text-center py-6 border rounded-lg border-dashed">
                            <Award className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-500">Belum ada sertifikasi. Klik tombol di atas untuk menambahkan.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {resumeData.certifications.map((cert) => (
                              <div 
                                key={cert.id} 
                                className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                onClick={() => setCurrentCertificationId(cert.id)}
                              >
                                <div className="flex-1">
                                  <div className="font-medium">{cert.name || "Untitled Certificate"}</div>
                                  <div className="text-sm text-gray-500">{cert.issuer} • {cert.date}</div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteCertification(cert.id);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}

                            {currentCertificationId && (
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="certName">Nama Sertifikasi</Label>
                                  <Input
                                    id="certName"
                                    name="name"
                                    placeholder="AWS Certified Solutions Architect"
                                    value={resumeData.certifications.find(cert => cert.id === currentCertificationId)?.name || ""}
                                    onChange={updateCertification}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="certIssuer">Penerbit</Label>
                                  <Input
                                    id="certIssuer"
                                    name="issuer"
                                    placeholder="Amazon Web Services"
                                    value={resumeData.certifications.find(cert => cert.id === currentCertificationId)?.issuer || ""}
                                    onChange={updateCertification}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="certDate">Tanggal</Label>
                                  <Input
                                    id="certDate"
                                    name="date"
                                    placeholder="Mei 2023"
                                    value={resumeData.certifications.find(cert => cert.id === currentCertificationId)?.date || ""}
                                    onChange={updateCertification}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="certLink">Link Sertifikasi</Label>
                                  <Input
                                    id="certLink"
                                    name="link"
                                    placeholder="https://www.credly.com/badges/..."
                                    value={resumeData.certifications.find(cert => cert.id === currentCertificationId)?.link || ""}
                                    onChange={updateCertification}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </TabsContent>

                      {/* Design Tab */}
                      <TabsContent value="design" className="space-y-6">
                        <h3 className="font-semibold text-lg flex items-center mb-4">
                          <Settings className="h-5 w-5 mr-2" />
                          Pengaturan Tampilan
                        </h3>

                        <div className="space-y-6">
                          <div className="space-y-2">
                            <Label>Template</Label>
                            <RadioGroup 
                              defaultValue="modern" 
                              value={resumeData.theme}
                              onValueChange={(value) => updateTheme('theme', value)}
                              className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                            >
                              <div>
                                <RadioGroupItem value="modern" id="modern" className="sr-only" />
                                <Label
                                  htmlFor="modern"
                                  className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                                    resumeData.theme === "modern" ? "border-primary" : ""
                                  }`}
                                >
                                  <span className="mt-2 text-sm font-medium">Modern</span>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="classic" id="classic" className="sr-only" />
                                <Label
                                  htmlFor="classic"
                                  className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                                    resumeData.theme === "classic" ? "border-primary" : ""
                                  }`}
                                >
                                  <span className="mt-2 text-sm font-medium">Classic</span>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="minimal" id="minimal" className="sr-only" />
                                <Label
                                  htmlFor="minimal"
                                  className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                                    resumeData.theme === "minimal" ? "border-primary" : ""
                                  }`}
                                >
                                  <span className="mt-2 text-sm font-medium">Minimal</span>
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="creative" id="creative" className="sr-only" />
                                <Label
                                  htmlFor="creative"
                                  className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                                    resumeData.theme === "creative" ? "border-primary" : ""
                                  }`}
                                >
                                  <span className="mt-2 text-sm font-medium">Creative</span>
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label>Warna Aksen</Label>
                            <RadioGroup 
                              defaultValue="blue" 
                              value={resumeData.color}
                              onValueChange={(value) => updateTheme('color', value)}
                              className="flex flex-wrap gap-2"
                            >
                              <div>
                                <RadioGroupItem value="blue" id="blue" className="sr-only" />
                                <Label
                                  htmlFor="blue"
                                  className={`flex items-center justify-center rounded-full w-8 h-8 bg-blue-600 cursor-pointer ${
                                    resumeData.color === "blue" ? "ring-2 ring-offset-2 ring-blue-600" : ""
                                  }`}
                                />
                              </div>
                              <div>
                                <RadioGroupItem value="green" id="green" className="sr-only" />
                                <Label
                                  htmlFor="green"
                                  className={`flex items-center justify-center rounded-full w-8 h-8 bg-green-600 cursor-pointer ${
                                    resumeData.color === "green" ? "ring-2 ring-offset-2 ring-green-600" : ""
                                  }`}
                                />
                              </div>
                              <div>
                                <RadioGroupItem value="purple" id="purple" className="sr-only" />
                                <Label
                                  htmlFor="purple"
                                  className={`flex items-center justify-center rounded-full w-8 h-8 bg-purple-600 cursor-pointer ${
                                    resumeData.color === "purple" ? "ring-2 ring-offset-2 ring-purple-600" : ""
                                  }`}
                                />
                              </div>
                              <div>
                                <RadioGroupItem value="orange" id="orange" className="sr-only" />
                                <Label
                                  htmlFor="orange"
                                  className={`flex items-center justify-center rounded-full w-8 h-8 bg-orange-600 cursor-pointer ${
                                    resumeData.color === "orange" ? "ring-2 ring-offset-2 ring-orange-600" : ""
                                  }`}
                                />
                              </div>
                              <div>
                                <RadioGroupItem value="red" id="red" className="sr-only" />
                                <Label
                                  htmlFor="red"
                                  className={`flex items-center justify-center rounded-full w-8 h-8 bg-red-600 cursor-pointer ${
                                    resumeData.color === "red" ? "ring-2 ring-offset-2 ring-red-600" : ""
                                  }`}
                                />
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label>Font</Label>
                            <RadioGroup 
                              defaultValue="sans" 
                              value={resumeData.font}
                              onValueChange={(value) => updateTheme('font', value)}
                              className="grid grid-cols-3 gap-2"
                            >
                              <div>
                                <RadioGroupItem value="sans" id="sans" className="sr-only" />
                                <Label
                                  htmlFor="sans"
                                  className={`flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer font-sans ${
                                    resumeData.font === "sans" ? "border-primary" : ""
                                  }`}
                                >
                                  Sans Serif
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="serif" id="serif" className="sr-only" />
                                <Label
                                  htmlFor="serif"
                                  className={`flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer font-serif ${
                                    resumeData.font === "serif" ? "border-primary" : ""
                                  }`}
                                >
                                  Serif
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="mono" id="mono" className="sr-only" />
                                <Label
                                  htmlFor="mono"
                                  className={`flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer font-mono ${
                                    resumeData.font === "mono" ? "border-primary" : ""
                                  }`}
                                >
                                  Monospace
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label>Layout</Label>
                            <RadioGroup 
                              defaultValue="standard" 
                              value={resumeData.layout}
                              onValueChange={(value) => updateTheme('layout', value)}
                              className="grid grid-cols-3 gap-2"
                            >
                              <div>
                                <RadioGroupItem value="standard" id="standard" className="sr-only" />
                                <Label
                                  htmlFor="standard"
                                  className={`flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                                    resumeData.layout === "standard" ? "border-primary" : ""
                                  }`}
                                >
                                  Standard
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="sidebar" id="sidebar" className="sr-only" />
                                <Label
                                  htmlFor="sidebar"
                                  className={`flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                                    resumeData.layout === "sidebar" ? "border-primary" : ""
                                  }`}
                                >
                                  Sidebar
                                </Label>
                              </div>
                              <div>
                                <RadioGroupItem value="compact" id="compact" className="sr-only" />
                                <Label
                                  htmlFor="compact"
                                  className={`flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer ${
                                    resumeData.layout === "compact" ? "border-primary" : ""
                                  }`}
                                >
                                  Compact
                                </Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </div>
        </div>

        {/* Right Column - Preview */}
        <div className={cn(
          "w-full transition-all duration-300",
          isPreviewMode ? "lg:w-full" : "lg:w-1/2"
        )}>
          <div className="sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Preview</h2>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                >
                  {isPreviewMode ? "Edit Mode" : "Full Preview"}
                </Button>
                <Button onClick={exportToPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>

            <Card>
              <ScrollArea className="h-[calc(100vh-220px)] rounded-md">
                <div 
                  ref={resumeContainerRef}
                  className={cn(
                    "bg-white p-8 shadow-sm min-h-[1100px] w-[794px] mx-auto",
                    getFontClass(resumeData.font),
                    resumeData.layout === "sidebar" ? "flex gap-8" : ""
                  )}
                  style={{ 
                    maxWidth: "100%",
                    overflow: "hidden"
                  }}
                >
                  {/* Sidebar Layout */}
                  {resumeData.layout === "sidebar" && (
                    <div className="w-1/3">
                      {/* Profile Section */}
                      <div className="flex flex-col items-center mb-6">
                        {resumeData.personal.profileImage && (
                          <div 
                            className="w-28 h-28 rounded-full overflow-hidden mb-4 border-2" 
                            style={{ borderColor: getColorClass(resumeData.color).replace('bg-', '') }}
                          >
                            <img 
                              src={resumeData.personal.profileImage} 
                              alt={resumeData.personal.fullName} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Contact Info */}
                      <div className={`${getColorClass(resumeData.color)} text-white p-4 rounded mb-6`}>
                        <h2 className="text-lg font-semibold mb-3">Contact</h2>
                        <div className="space-y-2">
                          {resumeData.personal.email && (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2" />
                              <span className="text-sm">{resumeData.personal.email}</span>
                            </div>
                          )}
                          {resumeData.personal.phone && (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2" />
                              <span className="text-sm">{resumeData.personal.phone}</span>
                            </div>
                          )}
                          {resumeData.personal.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span className="text-sm">{resumeData.personal.location}</span>
                            </div>
                          )}
                          {resumeData.personal.website && (
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-2" />
                              <span className="text-sm">{resumeData.personal.website}</span>
                            </div>
                          )}
                          {resumeData.personal.linkedin && (
                            <div className="flex items-center">
                              <Linkedin className="h-4 w-4 mr-2" />
                              <span className="text-sm">{resumeData.personal.linkedin}</span>
                            </div>
                          )}
                          {resumeData.personal.github && (
                            <div className="flex items-center">
                              <Github className="h-4 w-4 mr-2" />
                              <span className="text-sm">{resumeData.personal.github}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Skills */}
                      {resumeData.skills.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold border-b pb-1 mb-3">Skills</h2>
                          <div className="space-y-2">
                            {resumeData.skills.map((skill) => (
                              <div key={skill.id} className="mb-2">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-sm font-medium">{skill.name}</span>
                                </div>
                                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${getColorClass(resumeData.color)}`}
                                    style={{ width: `${(skill.level / 5) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Languages */}
                      {resumeData.languages.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold border-b pb-1 mb-3">Languages</h2>
                          <div className="space-y-2">
                            {resumeData.languages.map((language) => (
                              <div key={language.id} className="flex justify-between items-center">
                                <span className="text-sm">{language.name}</span>
                                <span className="text-xs px-2 py-1 rounded bg-gray-100">{language.proficiency}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications */}
                      {resumeData.certifications.length > 0 && (
                        <div className="mb-6">
                          <h2 className="text-lg font-semibold border-b pb-1 mb-3">Certifications</h2>
                          <div className="space-y-3">
                            {resumeData.certifications.map((cert) => (
                              <div key={cert.id}>
                                <div className="text-sm font-medium">{cert.name}</div>
                                <div className="text-xs text-gray-600">{cert.issuer} • {cert.date}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Content */}
                  <div className={resumeData.layout === "sidebar" ? "w-2/3" : "w-full"}>
                    {/* Header */}
                    {resumeData.layout !== "sidebar" && (
                      <div className="mb-6 pb-4 border-b">
                        {resumeData.layout === "compact" ? (
                          <div className="flex justify-between items-center">
                            <div>
                              <h1 className="text-2xl font-bold">{resumeData.personal.fullName || "Your Name"}</h1>
                              <p className="text-gray-600">{resumeData.personal.jobTitle || "Professional Title"}</p>
                            </div>
                            <div className="text-right">
                              {resumeData.personal.email && <div className="text-sm">{resumeData.personal.email}</div>}
                              {resumeData.personal.phone && <div className="text-sm">{resumeData.personal.phone}</div>}
                              {resumeData.personal.location && <div className="text-sm">{resumeData.personal.location}</div>}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <h1 className="text-3xl font-bold mb-1">{resumeData.personal.fullName || "Your Name"}</h1>
                            <p className="text-lg text-gray-600 mb-3">{resumeData.personal.jobTitle || "Professional Title"}</p>
                            
                            <div className="flex flex-wrap justify-center gap-3 text-sm">
                              {resumeData.personal.email && (
                                <div className="flex items-center">
                                  <Mail className="h-4 w-4 mr-1" />
                                  <span>{resumeData.personal.email}</span>
                                </div>
                              )}
                              {resumeData.personal.phone && (
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-1" />
                                  <span>{resumeData.personal.phone}</span>
                                </div>
                              )}
                              {resumeData.personal.location && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{resumeData.personal.location}</span>
                                </div>
                              )}
                              {resumeData.personal.website && (
                                <div className="flex items-center">
                                  <Globe className="h-4 w-4 mr-1" />
                                  <span>{resumeData.personal.website}</span>
                                </div>
                              )}
                              {resumeData.personal.linkedin && (
                                <div className="flex items-center">
                                  <Linkedin className="h-4 w-4 mr-1" />
                                  <span>{resumeData.personal.linkedin}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Profile Photo (For Sidebar layout) */}
                    {resumeData.layout === "sidebar" && (
                      <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-1">{resumeData.personal.fullName || "Your Name"}</h1>
                        <p className="text-lg text-gray-600 mb-3">{resumeData.personal.jobTitle || "Professional Title"}</p>
                      </div>
                    )}

                    {/* Profile Summary */}
                    {resumeData.personal.bio && (
                      <div className="mb-6">
                        <h2 className={`text-lg font-semibold border-b pb-1 mb-3 ${resumeData.theme === "creative" ? getColorClass(resumeData.color) + " text-white px-2 rounded" : ""}`}>Summary</h2>
                        <p className="text-sm">{resumeData.personal.bio}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && (
                      <div className="mb-6">
                        <h2 className={`text-lg font-semibold border-b pb-1 mb-3 ${resumeData.theme === "creative" ? getColorClass(resumeData.color) + " text-white px-2 rounded" : ""}`}>Experience</h2>
                        <div className="space-y-4">
                          {resumeData.experience.map((exp) => (
                            <div key={exp.id} className="mb-4">
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <h3 className="font-semibold">{exp.position}</h3>
                                  <p className="text-sm">{exp.company}</p>
                                </div>
                                <div className="text-sm text-gray-600 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {exp.startDate} - {exp.endDate}
                                </div>
                              </div>
                              <p className="text-sm mb-2">{exp.description}</p>
                              {exp.achievements.length > 0 && (
                                <div className="pl-4">
                                  <ul className="list-disc text-sm space-y-1">
                                    {exp.achievements.map((achievement, index) => (
                                      <li key={index}>{achievement}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && (
                      <div className="mb-6">
                        <h2 className={`text-lg font-semibold border-b pb-1 mb-3 ${resumeData.theme === "creative" ? getColorClass(resumeData.color) + " text-white px-2 rounded" : ""}`}>Education</h2>
                        <div className="space-y-4">
                          {resumeData.education.map((edu) => (
                            <div key={edu.id}>
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <h3 className="font-semibold">{edu.degree} in {edu.field}</h3>
                                  <p className="text-sm">{edu.school}</p>
                                </div>
                                <div className="text-sm text-gray-600 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {edu.startDate} - {edu.endDate}
                                </div>
                              </div>
                              {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
                              {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills (for non-sidebar layouts) */}
                    {resumeData.layout !== "sidebar" && resumeData.skills.length > 0 && (
                      <div className="mb-6">
                        <h2 className={`text-lg font-semibold border-b pb-1 mb-3 ${resumeData.theme === "creative" ? getColorClass(resumeData.color) + " text-white px-2 rounded" : ""}`}>Skills</h2>
                        <div className="flex flex-wrap gap-2">
                          {resumeData.skills.map((skill) => (
                            <div key={skill.id} className="bg-gray-100 px-3 py-1 rounded text-sm">
                              {skill.name}
                              {resumeData.theme !== "minimal" && (
                                <span className="ml-1 text-xs">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i} className={i < skill.level ? "text-gray-700" : "text-gray-300"}>•</span>
                                  ))}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages (for non-sidebar layouts) */}
                    {resumeData.layout !== "sidebar" && resumeData.languages.length > 0 && (
                      <div className="mb-6">
                        <h2 className={`text-lg font-semibold border-b pb-1 mb-3 ${resumeData.theme === "creative" ? getColorClass(resumeData.color) + " text-white px-2 rounded" : ""}`}>Languages</h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {resumeData.languages.map((language) => (
                            <div key={language.id} className="text-sm">
                              <span className="font-medium">{language.name}</span>
                              <span className="text-gray-600 ml-1">({language.proficiency})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects */}
                    {resumeData.projects.length > 0 && (
                      <div className="mb-6">
                        <h2 className={`text-lg font-semibold border-b pb-1 mb-3 ${resumeData.theme === "creative" ? getColorClass(resumeData.color) + " text-white px-2 rounded" : ""}`}>Projects</h2>
                        <div className="space-y-4">
                          {resumeData.projects.map((project) => (
                            <div key={project.id}>
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-semibold">{project.name}</h3>
                                {project.link && (
                                  <a href={project.link} className="text-blue-600 text-xs underline hover:no-underline">View Project</a>
                                )}
                              </div>
                              <p className="text-sm mb-1">{project.description}</p>
                              {project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {project.technologies.map((tech, index) => (
                                    <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications (for non-sidebar layouts) */}
                    {resumeData.layout !== "sidebar" && resumeData.certifications.length > 0 && (
                      <div className="mb-6">
                        <h2 className={`text-lg font-semibold border-b pb-1 mb-3 ${resumeData.theme === "creative" ? getColorClass(resumeData.color) + " text-white px-2 rounded" : ""}`}>Certifications</h2>
                        <div className="space-y-2">
                          {resumeData.certifications.map((cert) => (
                            <div key={cert.id} className="flex justify-between items-center">
                              <div>
                                <span className="font-medium text-sm">{cert.name}</span>
                                <span className="text-gray-600 text-sm ml-2">- {cert.issuer}</span>
                              </div>
                              <div className="text-xs text-gray-500">{cert.date}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}