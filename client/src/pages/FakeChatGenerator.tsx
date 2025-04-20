import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { 
  WhatsappLogo, 
  TelegramLogo, 
  FacebookLogo, 
  InstagramLogo, 
  TwitterLogo,
  DeviceMobileSpeaker,
  DeviceMobile
} from "@phosphor-icons/react";
import { 
  Smartphone,
  MessageSquare, 
  Download, 
  Plus, 
  Trash2, 
  Clock, 
  Signal, 
  Wifi, 
  Battery, 
  Check, 
  Image,
  X
} from "lucide-react";
import { 
  FakeChatGeneratorRequest, 
  FakeChatMessage, 
  StatusBarConfig 
} from "@/lib/types";
import { generateFakeChat } from "@/lib/geminiApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import Breadcrumb from "@/components/Breadcrumb";

// Helper function to get platform icons
const getPlatformIcon = (platform: string, className = "h-6 w-6") => {
  switch (platform) {
    case "whatsapp":
      return <WhatsappLogo className={className} weight="fill" />;
    case "facebook":
      return <FacebookLogo className={className} weight="fill" />;
    case "instagram":
      return <InstagramLogo className={className} weight="fill" />;
    case "telegram":
      return <TelegramLogo className={className} weight="fill" />;
    case "twitter":
      return <TwitterLogo className={className} weight="fill" />;
    default:
      return <MessageSquare className={className} />;
  }
};

// Helper function to get platform colors
const getPlatformColor = (platform: string) => {
  switch (platform) {
    case "whatsapp":
      return "bg-green-500";
    case "facebook":
      return "bg-blue-600";
    case "instagram":
      return "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500";
    case "telegram":
      return "bg-blue-500";
    case "twitter":
      return "bg-sky-500";
    case "line":
      return "bg-green-400";
    case "wechat":
      return "bg-green-600";
    default:
      return "bg-gray-500";
  }
};

// Helper function to format current time
const getCurrentTime = (format: "12h" | "24h" = "24h") => {
  const now = new Date();
  if (format === "12h") {
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } else {
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
};

export default function FakeChatGenerator() {
  const { toast } = useToast();
  
  // Platform state
  const [platform, setPlatform] = useState<"whatsapp" | "facebook" | "instagram" | "telegram" | "twitter" | "line" | "wechat">("whatsapp");
  const [deviceType, setDeviceType] = useState<"iphone" | "android">("iphone");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [timeFormat, setTimeFormat] = useState<"12h" | "24h">("24h");
  const [includeAvatar, setIncludeAvatar] = useState(true);
  
  // Status bar config
  const [statusBarConfig, setStatusBarConfig] = useState<StatusBarConfig>({
    batteryPercentage: 85,
    showBatteryPercentage: true,
    signalStrength: 4,
    wifiStrength: 3,
    carrierName: "Carrier",
    time: getCurrentTime(timeFormat)
  });
  
  // Messages state
  const [messages, setMessages] = useState<FakeChatMessage[]>([
    {
      role: "contact",
      content: "Hi there! How are you doing?",
      timestamp: "10:30"
    },
    {
      role: "user",
      content: "I'm doing great! Just working on some exciting projects.",
      timestamp: "10:31",
      status: "read"
    }
  ]);
  
  // Preview state
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Form state for adding new messages
  const [newMessage, setNewMessage] = useState({
    content: "",
    role: "user" as "user" | "contact",
    timestamp: getCurrentTime(timeFormat).substring(0, 5),
    status: "read" as "sent" | "delivered" | "read" | undefined
  });
  
  // Mutation for generating chat image
  const mutation = useMutation({
    mutationFn: async (request: FakeChatGeneratorRequest) => {
      return await generateFakeChat(request);
    },
    onSuccess: (data) => {
      setPreviewImage(`data:image/jpeg;base64,${data.imageBase64}`);
      toast({
        title: "Success!",
        description: "Your fake chat has been generated",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error generating chat",
        description: error.message,
      });
    },
  });
  
  // Handle adding a new message
  const handleAddMessage = () => {
    if (!newMessage.content.trim()) {
      toast({
        variant: "destructive",
        title: "Message is required",
        description: "Please enter a message",
      });
      return;
    }
    
    setMessages([...messages, { ...newMessage }]);
    setNewMessage({
      ...newMessage,
      content: "",
      timestamp: getCurrentTime(timeFormat).substring(0, 5)
    });
  };
  
  // Handle removing a message
  const handleRemoveMessage = (index: number) => {
    const updatedMessages = [...messages];
    updatedMessages.splice(index, 1);
    setMessages(updatedMessages);
  };
  
  // Handle updating status bar
  const handleStatusBarChange = (key: keyof StatusBarConfig, value: any) => {
    setStatusBarConfig({
      ...statusBarConfig,
      [key]: value
    });
  };
  
  // Handle generating the fake chat
  const handleGenerateChat = () => {
    if (messages.length === 0) {
      toast({
        variant: "destructive",
        title: "No messages added",
        description: "Please add at least one message",
      });
      return;
    }
    
    const request: FakeChatGeneratorRequest = {
      platform,
      messages,
      deviceType,
      statusBarConfig: {
        ...statusBarConfig,
        time: getCurrentTime(timeFormat)
      },
      backgroundColor: backgroundColor || undefined,
      timeFormat,
      includeAvatar
    };
    
    mutation.mutate(request);
  };
  
  // Handle downloading the generated image
  const handleDownloadImage = () => {
    if (!previewImage) return;
    
    const link = document.createElement('a');
    link.href = previewImage;
    link.download = `fake-${platform}-chat.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="container py-4 max-w-7xl mx-auto">
      <Breadcrumb 
        items={[
          { label: "Tools", path: "/tools" },
          { label: "Fake Chat Generator", path: "/tools/fake-chat-generator", isActive: true }
        ]}
      />
      
      <div className="flex items-center space-x-2 mb-6">
        <MessageSquare className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold">Fake Chat Generator</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Platform & Device Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Platform & Device Settings</CardTitle>
              <CardDescription>
                Customize the appearance of your fake chat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="platform">Platform</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {["whatsapp", "facebook", "instagram", "telegram", "twitter", "line", "wechat"].map((p) => (
                      <Button
                        key={p}
                        variant={platform === p ? "default" : "outline"}
                        className={`flex items-center justify-center gap-2 ${platform === p ? getPlatformColor(p) : ""}`}
                        onClick={() => setPlatform(p as any)}
                      >
                        {getPlatformIcon(p, "h-5 w-5")}
                        <span className="capitalize">{p}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="deviceType">Device Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant={deviceType === "iphone" ? "default" : "outline"}
                      className="flex items-center justify-center gap-2"
                      onClick={() => setDeviceType("iphone")}
                    >
                      <DeviceMobileSpeaker className="h-5 w-5" weight="fill" />
                      <span>iPhone</span>
                    </Button>
                    <Button
                      variant={deviceType === "android" ? "default" : "outline"}
                      className="flex items-center justify-center gap-2"
                      onClick={() => setDeviceType("android")}
                    >
                      <DeviceMobile className="h-5 w-5" weight="fill" />
                      <span>Android</span>
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="backgroundColor">Background Color (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="backgroundColor"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="e.g. #FFFFFF or leave empty for default"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="includeAvatar">Include Avatars</Label>
                    <Switch
                      id="includeAvatar"
                      checked={includeAvatar}
                      onCheckedChange={setIncludeAvatar}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <Select value={timeFormat} onValueChange={(value: "12h" | "24h") => setTimeFormat(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12-hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24-hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Bar Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Status Bar Settings</CardTitle>
              <CardDescription>
                Customize how the phone status bar appears
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="carrierName">Carrier Name</Label>
                  <Input
                    id="carrierName"
                    value={statusBarConfig.carrierName}
                    onChange={(e) => handleStatusBarChange("carrierName", e.target.value)}
                    placeholder="e.g. Verizon, AT&T"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="time">Time (will be auto-updated on generation)</Label>
                  <Input
                    id="time"
                    value={statusBarConfig.time}
                    onChange={(e) => handleStatusBarChange("time", e.target.value)}
                    placeholder="e.g. 14:30"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="signalStrength">Signal Strength: {statusBarConfig.signalStrength}/4</Label>
                    <Signal className="h-4 w-4" />
                  </div>
                  <Slider
                    id="signalStrength"
                    min={0}
                    max={4}
                    step={1}
                    value={[statusBarConfig.signalStrength]}
                    onValueChange={(value) => handleStatusBarChange("signalStrength", value[0])}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="wifiStrength">WiFi Strength: {statusBarConfig.wifiStrength}/3</Label>
                    <Wifi className="h-4 w-4" />
                  </div>
                  <Slider
                    id="wifiStrength"
                    min={0}
                    max={3}
                    step={1}
                    value={[statusBarConfig.wifiStrength]}
                    onValueChange={(value) => handleStatusBarChange("wifiStrength", value[0])}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="batteryPercentage">Battery: {statusBarConfig.batteryPercentage}%</Label>
                    <Battery className="h-4 w-4" />
                  </div>
                  <Slider
                    id="batteryPercentage"
                    min={1}
                    max={100}
                    step={1}
                    value={[statusBarConfig.batteryPercentage]}
                    onValueChange={(value) => handleStatusBarChange("batteryPercentage", value[0])}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showBatteryPercentage">Show Battery Percentage</Label>
                    <Switch
                      id="showBatteryPercentage"
                      checked={statusBarConfig.showBatteryPercentage}
                      onCheckedChange={(value) => handleStatusBarChange("showBatteryPercentage", value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Add and edit chat messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Message list */}
                <div className="space-y-3">
                  <Label>Current Messages</Label>
                  <div className="border rounded-md p-3 max-h-80 overflow-y-auto space-y-2">
                    {messages.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No messages added. Add some messages below.
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <div key={index} className="flex items-start justify-between border-b pb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant={message.role === "user" ? "default" : "secondary"}>
                                {message.role === "user" ? "You" : "Contact"}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {message.timestamp} {message.status && `• ${message.status}`}
                              </span>
                            </div>
                            <p className="mt-1">{message.content}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMessage(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                
                {/* Add new message */}
                <div className="space-y-3 border-t pt-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="messageRole">Sender</Label>
                      <Select
                        value={newMessage.role}
                        onValueChange={(value: "user" | "contact") => setNewMessage({ ...newMessage, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select sender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">You</SelectItem>
                          <SelectItem value="contact">Contact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="messageTimestamp">Time</Label>
                      <Input
                        id="messageTimestamp"
                        value={newMessage.timestamp}
                        onChange={(e) => setNewMessage({ ...newMessage, timestamp: e.target.value })}
                        placeholder="e.g. 14:30"
                      />
                    </div>
                    
                    {newMessage.role === "user" && (
                      <div>
                        <Label htmlFor="messageStatus">Status</Label>
                        <Select
                          value={newMessage.status || "none"}
                          onValueChange={(value: "sent" | "delivered" | "read" | "none") => 
                            setNewMessage({ ...newMessage, status: value === "none" ? undefined : value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="sent">Sent ✓</SelectItem>
                            <SelectItem value="delivered">Delivered ✓✓</SelectItem>
                            <SelectItem value="read">Read ✓✓</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="messageContent">Message Content</Label>
                    <div className="flex gap-2">
                      <Textarea
                        id="messageContent"
                        value={newMessage.content}
                        onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                        placeholder="Type your message here..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleAddMessage}
                        className="self-end"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setMessages([])}
                disabled={messages.length === 0}
              >
                Clear All
              </Button>
              <Button 
                onClick={handleGenerateChat}
                disabled={messages.length === 0 || mutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {mutation.isPending ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Image className="h-4 w-4 mr-2" />
                    Generate Chat Image
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                The generated chat image will appear here
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              {mutation.isPending ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-500">Generating your chat image...</p>
                </div>
              ) : previewImage ? (
                <div className="flex flex-col items-center">
                  <div className="relative max-w-full">
                    <img 
                      src={previewImage} 
                      alt="Generated Chat" 
                      className="rounded-md shadow-lg max-h-[70vh] object-contain" 
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white/90"
                      onClick={() => setPreviewImage(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    className="mt-4 w-full"
                    onClick={handleDownloadImage}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-80 bg-gray-100 dark:bg-gray-800 rounded-md w-full">
                  <Smartphone className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
                    Configure your chat settings and click "Generate Chat Image" to see the preview here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Badge Component
const Badge = ({ 
  children, 
  variant = "default" 
}: { 
  children: React.ReactNode; 
  variant?: "default" | "secondary" | "destructive" | "outline"; 
}) => {
  const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const variantClasses = {
    default: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    outline: "border border-gray-200 text-gray-800 dark:border-gray-700 dark:text-gray-300"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};