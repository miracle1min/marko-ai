import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { HexColorPicker } from "react-colorful";
import { 
  Download, 
  Link as LinkIcon, 
  QrCode, 
  MessageSquare, 
  Mail, 
  Phone, 
  Wifi, 
  Copy, 
  Check,
  Smartphone,
  Image as ImageIcon
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import { saveAs } from "file-saver";

export default function QRCodeGenerator() {
  // Basic state
  const [text, setText] = useState("https://example.com");
  const [qrCodeURL, setQRCodeURL] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Advanced settings
  const [size, setSize] = useState(300);
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M");
  const [darkColor, setDarkColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [colorPickerOpen, setColorPickerOpen] = useState({ dark: false, light: false });
  const [margin, setMargin] = useState(4);
  const [includeImage, setIncludeImage] = useState(false);
  const [centerImage, setCenterImage] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState(30); // % of QR code size
  const fileInputRef = useRef<HTMLInputElement>(null);

  // QR Data based on tab
  const [urlData, setUrlData] = useState("https://");
  const [textData, setTextData] = useState("");
  const [emailData, setEmailData] = useState({ to: "", subject: "", body: "" });
  const [smsData, setSmsData] = useState({ phone: "", message: "" });
  const [wifiData, setWifiData] = useState({ ssid: "", password: "", encryption: "WPA", hidden: false });
  const [vcardData, setVcardData] = useState({
    firstName: "",
    lastName: "",
    organization: "",
    title: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    note: ""
  });

  // Create QR code when text changes or advanced settings change
  useEffect(() => {
    generateQRCode();
  }, [text, size, errorCorrectionLevel, darkColor, lightColor, margin, includeImage, centerImage, imageSize]);

  // Update QR data based on active tab
  useEffect(() => {
    let data = "";
    switch (activeTab) {
      case "url":
        data = urlData;
        break;
      case "text":
        data = textData;
        break;
      case "email":
        data = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
        break;
      case "sms":
        data = `sms:${emailData.to}?body=${encodeURIComponent(smsData.message)}`;
        break;
      case "wifi":
        data = `WIFI:S:${wifiData.ssid};T:${wifiData.encryption};P:${wifiData.password};H:${wifiData.hidden ? 'true' : 'false'};;`;
        break;
      case "vcard":
        data = generateVCardData();
        break;
      default:
        data = urlData;
    }
    setText(data);
  }, [activeTab, urlData, textData, emailData, smsData, wifiData, vcardData]);

  // Generate vCard format
  const generateVCardData = () => {
    const v = vcardData;
    return `BEGIN:VCARD
VERSION:3.0
N:${v.lastName};${v.firstName};;;
FN:${v.firstName} ${v.lastName}
ORG:${v.organization}
TITLE:${v.title}
EMAIL:${v.email}
TEL:${v.phone}
URL:${v.website}
ADR:;;${v.address};;;
NOTE:${v.note}
END:VCARD`;
  };

  // Generate QR code with current options
  const generateQRCode = async () => {
    try {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        
        // Clear previous QR code
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Set canvas size
        canvas.width = size;
        canvas.height = size;
        
        // Basic QR code options
        const options = {
          errorCorrectionLevel: errorCorrectionLevel as "L" | "M" | "Q" | "H",
          margin,
          color: {
            dark: darkColor,
            light: lightColor
          },
          width: size
        };
        
        // Generate QR code
        await QRCode.toCanvas(canvas, text || " ", options);
        
        // Add center image if enabled
        if (includeImage && centerImage) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const img = new Image();
            img.onload = () => {
              // Calculate center image size as percentage of QR code
              const imgSize = (size * imageSize) / 100;
              const position = (size - imgSize) / 2;
              
              // Draw white background for image
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(position - 5, position - 5, imgSize + 10, imgSize + 10);
              
              // Draw image
              ctx.drawImage(img, position, position, imgSize, imgSize);
            };
            img.src = centerImage;
          }
        }
        
        // Save data URL for download
        setQRCodeURL(canvas.toDataURL('image/png'));
      }
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  };

  // Handle file upload for center image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setCenterImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Download QR code
  const downloadQRCode = (format: 'png' | 'jpeg' | 'svg') => {
    if (canvasRef.current) {
      if (format === 'svg') {
        // Generate SVG version
        QRCode.toString(text || " ", {
          errorCorrectionLevel: errorCorrectionLevel as "L" | "M" | "Q" | "H",
          type: 'svg',
          margin,
          color: {
            dark: darkColor,
            light: lightColor
          },
          width: size
        }, (err: any, string: string) => {
          if (err) return console.error(err);
          const blob = new Blob([string], { type: 'image/svg+xml' });
          saveAs(blob, 'qrcode.svg');
        });
      } else {
        // Use canvas for PNG/JPEG
        const canvas = canvasRef.current;
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, `qrcode.${format}`);
          }
        }, format === 'png' ? 'image/png' : 'image/jpeg');
      }
    }
  };

  // Copy data URL
  const copyToClipboard = () => {
    if (qrCodeURL) {
      navigator.clipboard.writeText(qrCodeURL)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.error('Could not copy data URL: ', err));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Breadcrumb
        items={[
          { label: "Tools", path: "/tools", isActive: false },
          { label: "QR Code Generator", path: "/tools/qr-code-generator", isActive: true }
        ]}
      />
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2 dark:text-slate-50">QR Code Generator</h1>
        <p className="text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
          Buat QR Code kustom dengan mudah untuk berbagai keperluan. Gunakan pilihan format data dan sesuaikan tampilan sesuai kebutuhan Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left side - Input options */}
        <div className="lg:col-span-3">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Buat QR Code Anda</CardTitle>
              <CardDescription>
                Pilih jenis data yang ingin Anda konversi menjadi QR Code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="flex flex-wrap gap-1 justify-center h-auto">
                  <TabsTrigger value="url" className="flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-1">
                    <LinkIcon className="h-4 w-4" />
                    <span className="text-xs">URL</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-1">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-xs">Teks</span>
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-1">
                    <Mail className="h-4 w-4" />
                    <span className="text-xs">Email</span>
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-1">
                    <Smartphone className="h-4 w-4" />
                    <span className="text-xs">SMS</span>
                  </TabsTrigger>
                  <TabsTrigger value="wifi" className="flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-1">
                    <Wifi className="h-4 w-4" />
                    <span className="text-xs">WiFi</span>
                  </TabsTrigger>
                  <TabsTrigger value="vcard" className="flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-1">
                    <Phone className="h-4 w-4" />
                    <span className="text-xs">Kontak</span>
                  </TabsTrigger>
                </TabsList>

                <div className="mt-10 sm:mt-6">
                  {/* URL Content */}
                  <TabsContent value="url" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="url">URL Website</Label>
                      <Input
                        id="url"
                        placeholder="https://www.example.com"
                        value={urlData}
                        onChange={(e) => setUrlData(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  {/* Text Content */}
                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="text">Teks</Label>
                      <Textarea
                        id="text"
                        placeholder="Masukkan teks Anda disini..."
                        className="min-h-[80px] sm:min-h-[120px]"
                        value={textData}
                        onChange={(e) => setTextData(e.target.value)}
                      />
                    </div>
                  </TabsContent>

                  {/* Email Content */}
                  <TabsContent value="email" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-to">Alamat Email</Label>
                      <Input
                        id="email-to"
                        placeholder="contoh@email.com"
                        value={emailData.to}
                        onChange={(e) => setEmailData({...emailData, to: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-subject">Subjek</Label>
                      <Input
                        id="email-subject"
                        placeholder="Subjek email"
                        value={emailData.subject}
                        onChange={(e) => setEmailData({...emailData, subject: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-body">Pesan</Label>
                      <Textarea
                        id="email-body"
                        placeholder="Isi pesan email..."
                        className="min-h-[80px] sm:min-h-[100px]"
                        value={emailData.body}
                        onChange={(e) => setEmailData({...emailData, body: e.target.value})}
                      />
                    </div>
                  </TabsContent>

                  {/* SMS Content */}
                  <TabsContent value="sms" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sms-phone">Nomor Telepon</Label>
                      <Input
                        id="sms-phone"
                        placeholder="+6281234567890"
                        value={smsData.phone}
                        onChange={(e) => setSmsData({...smsData, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms-message">Pesan</Label>
                      <Textarea
                        id="sms-message"
                        placeholder="Isi pesan SMS..."
                        className="min-h-[80px] sm:min-h-[100px]"
                        value={smsData.message}
                        onChange={(e) => setSmsData({...smsData, message: e.target.value})}
                      />
                    </div>
                  </TabsContent>

                  {/* WiFi Content */}
                  <TabsContent value="wifi" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="wifi-ssid">Nama Jaringan (SSID)</Label>
                      <Input
                        id="wifi-ssid"
                        placeholder="Nama WiFi"
                        value={wifiData.ssid}
                        onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wifi-password">Password</Label>
                      <Input
                        id="wifi-password"
                        type="password"
                        placeholder="Password WiFi"
                        value={wifiData.password}
                        onChange={(e) => setWifiData({...wifiData, password: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wifi-encryption">Jenis Enkripsi</Label>
                      <Select 
                        value={wifiData.encryption} 
                        onValueChange={(value) => setWifiData({...wifiData, encryption: value})}
                      >
                        <SelectTrigger id="wifi-encryption">
                          <SelectValue placeholder="Pilih jenis enkripsi" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="WPA">WPA/WPA2</SelectItem>
                          <SelectItem value="WEP">WEP</SelectItem>
                          <SelectItem value="nopass">Tidak ada password</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="wifi-hidden"
                        checked={wifiData.hidden}
                        onCheckedChange={(checked) => setWifiData({...wifiData, hidden: checked})}
                      />
                      <Label htmlFor="wifi-hidden">Jaringan tersembunyi</Label>
                    </div>
                  </TabsContent>

                  {/* vCard Content */}
                  <TabsContent value="vcard" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vcard-firstname">Nama Depan</Label>
                        <Input
                          id="vcard-firstname"
                          placeholder="Nama depan"
                          value={vcardData.firstName}
                          onChange={(e) => setVcardData({...vcardData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vcard-lastname">Nama Belakang</Label>
                        <Input
                          id="vcard-lastname"
                          placeholder="Nama belakang"
                          value={vcardData.lastName}
                          onChange={(e) => setVcardData({...vcardData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vcard-organization">Organisasi</Label>
                        <Input
                          id="vcard-organization"
                          placeholder="Perusahaan/Organisasi"
                          value={vcardData.organization}
                          onChange={(e) => setVcardData({...vcardData, organization: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vcard-title">Jabatan</Label>
                        <Input
                          id="vcard-title"
                          placeholder="Jabatan/Posisi"
                          value={vcardData.title}
                          onChange={(e) => setVcardData({...vcardData, title: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="vcard-email">Email</Label>
                        <Input
                          id="vcard-email"
                          placeholder="Email"
                          value={vcardData.email}
                          onChange={(e) => setVcardData({...vcardData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="vcard-phone">Telepon</Label>
                        <Input
                          id="vcard-phone"
                          placeholder="Nomor telepon"
                          value={vcardData.phone}
                          onChange={(e) => setVcardData({...vcardData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vcard-website">Website</Label>
                      <Input
                        id="vcard-website"
                        placeholder="https://example.com"
                        value={vcardData.website}
                        onChange={(e) => setVcardData({...vcardData, website: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vcard-address">Alamat</Label>
                      <Textarea
                        id="vcard-address"
                        placeholder="Alamat lengkap"
                        className="min-h-[80px] sm:min-h-[100px]"
                        value={vcardData.address}
                        onChange={(e) => setVcardData({...vcardData, address: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vcard-note">Catatan</Label>
                      <Textarea
                        id="vcard-note"
                        placeholder="Informasi tambahan..."
                        className="min-h-[80px] sm:min-h-[100px]"
                        value={vcardData.note}
                        onChange={(e) => setVcardData({...vcardData, note: e.target.value})}
                      />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Pengaturan Lanjutan</CardTitle>
              <CardDescription>
                Sesuaikan tampilan QR Code Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="qr-size">Ukuran (px)</Label>
                    <span className="text-sm text-gray-500">{size}px</span>
                  </div>
                  <Slider
                    id="qr-size"
                    min={100}
                    max={1000}
                    step={10}
                    value={[size]}
                    onValueChange={([val]) => setSize(val)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="error-correction">Tingkat Koreksi Error</Label>
                  <Select 
                    value={errorCorrectionLevel} 
                    onValueChange={setErrorCorrectionLevel}
                  >
                    <SelectTrigger id="error-correction">
                      <SelectValue placeholder="Pilih level koreksi error" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="qr-margin">Margin</Label>
                    <span className="text-sm text-gray-500">{margin} unit</span>
                  </div>
                  <Slider
                    id="qr-margin"
                    min={0}
                    max={10}
                    step={1}
                    value={[margin]}
                    onValueChange={([val]) => setMargin(val)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <Label>Warna Gelap (Foreground)</Label>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-10 h-10 rounded border cursor-pointer"
                        style={{ backgroundColor: darkColor }}
                        onClick={() => setColorPickerOpen({...colorPickerOpen, dark: !colorPickerOpen.dark, light: false})}
                      />
                      <Input
                        value={darkColor}
                        onChange={(e) => setDarkColor(e.target.value)}
                        className="w-28"
                      />
                    </div>
                    {colorPickerOpen.dark && (
                      <div className="mt-2 absolute z-30 bg-background shadow-lg rounded-lg p-4 border">
                        <HexColorPicker color={darkColor} onChange={setDarkColor} />
                        <div className="mt-2 flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setColorPickerOpen({...colorPickerOpen, dark: false})}
                          >
                            Tutup
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 relative">
                    <Label>Warna Terang (Background)</Label>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-10 h-10 rounded border cursor-pointer"
                        style={{ backgroundColor: lightColor }}
                        onClick={() => setColorPickerOpen({...colorPickerOpen, light: !colorPickerOpen.light, dark: false})}
                      />
                      <Input
                        value={lightColor}
                        onChange={(e) => setLightColor(e.target.value)}
                        className="w-28"
                      />
                    </div>
                    {colorPickerOpen.light && (
                      <div className="mt-2 absolute z-30 bg-background shadow-lg rounded-lg p-4 border">
                        <HexColorPicker color={lightColor} onChange={setLightColor} />
                        <div className="mt-2 flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setColorPickerOpen({...colorPickerOpen, light: false})}
                          >
                            Tutup
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="include-image"
                      checked={includeImage}
                      onCheckedChange={setIncludeImage}
                    />
                    <Label htmlFor="include-image">Tambahkan Gambar di Tengah</Label>
                  </div>
                  
                  {includeImage && (
                    <div className="space-y-4 pl-7 pt-2">
                      <div className="space-y-2">
                        <Label htmlFor="image-upload">Pilih Gambar (PNG, JPG)</Label>
                        <Input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          ref={fileInputRef}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="image-size">Ukuran Gambar (%)</Label>
                          <span className="text-sm text-gray-500">{imageSize}%</span>
                        </div>
                        <Slider
                          id="image-size"
                          min={5}
                          max={50}
                          step={1}
                          value={[imageSize]}
                          onValueChange={([val]) => setImageSize(val)}
                          disabled={!centerImage}
                        />
                      </div>
                      
                      {centerImage && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 mb-1">Preview Gambar:</p>
                          <img 
                            src={centerImage} 
                            alt="Center logo preview" 
                            className="w-16 h-16 object-contain border rounded"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Preview and download */}
        <div className="lg:col-span-2">
          <div className="sticky top-4">
            <Card>
              <CardHeader>
                <CardTitle>Preview QR Code</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700 w-full flex justify-center">
                  <canvas ref={canvasRef} className="max-w-full" />
                </div>
                
                <div className="mt-6 w-full space-y-4">
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                    <Button onClick={() => downloadQRCode('png')} className="flex items-center justify-center gap-2 text-sm">
                      <Download className="h-4 w-4" />
                      PNG
                    </Button>
                    <Button onClick={() => downloadQRCode('jpeg')} variant="outline" className="flex items-center justify-center gap-2 text-sm">
                      <Download className="h-4 w-4" />
                      JPEG
                    </Button>
                    <Button onClick={() => downloadQRCode('svg')} variant="outline" className="flex items-center justify-center gap-2 text-sm">
                      <Download className="h-4 w-4" />
                      SVG
                    </Button>
                    <Button 
                      onClick={copyToClipboard} 
                      variant={copied ? "outline" : "secondary"}
                      className="flex items-center justify-center gap-2 text-sm sm:ml-auto"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Scan QR code dengan kamera smartphone untuk melihat hasilnya. QR code berisi:
                </p>
                <div className="border rounded p-2 bg-gray-50 dark:bg-slate-800 w-full">
                  <p className="text-xs font-mono break-all">{text || "Empty"}</p>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}