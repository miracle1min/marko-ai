import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Brain, Keyboard, Layers, MessageSquare, SlidersVertical, PenTool, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/lib/types";

export default function GeminiFlashInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Selamat datang di Marko AI! Saya siap membantu Anda mengoptimasi website dan konten. Apa yang ingin Anda lakukan hari ini?"
    }
  ]);
  const [creativity, setCreativity] = useState(70);
  const [model, setModel] = useState("gemini-flash-2.0");
  const [contexts, setContexts] = useState({
    seo: false,
    keyword: false,
    content: true
  });
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/gemini/chat", {
        message,
        model,
        creativity: creativity / 100,
        contexts
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: "assistant", content: data.response }]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Gagal mendapatkan respons: ${error.message}`,
        variant: "destructive"
      });
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Maaf, terjadi kesalahan saat memproses permintaan Anda. Silakan coba lagi." 
      }]);
    }
  });

  const handleSendMessage = () => {
    if (input.trim() === "") return;
    
    const newUserMessage: Message = {
      role: "user",
      content: input
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    
    chatMutation.mutate(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleContext = (context: keyof typeof contexts) => {
    setContexts(prev => ({
      ...prev,
      [context]: !prev[context]
    }));
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-card dark:bg-slate-900 rounded-xl shadow-sm mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Marko AI</h2>
        <p className="text-gray-600 dark:text-slate-300 mt-2">Teknologi AI terbaru untuk optimasi website dan konten Anda</p>
      </div>

      <div className="bg-gray-100 dark:bg-slate-800 rounded-xl p-6 shadow-inner">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center dark:text-slate-100">
              <Brain className="text-primary mr-2" /> AI Chat Interface
            </h3>
            <div 
              ref={chatContainerRef} 
              className="bg-white dark:bg-slate-900 rounded-lg shadow-sm p-4 h-72 overflow-y-auto"
            >
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex mb-4 ${message.role === "user" ? "justify-end" : ""}`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                  <div className={message.role === "user" ? "max-w-[80%]" : ""}>
                    <p className={`text-sm font-medium text-gray-900 dark:text-slate-200 ${message.role === "user" ? "text-right" : ""}`}>
                      {message.role === "assistant" ? "Marko AI" : "Anda"}
                    </p>
                    <div className={`${
                      message.role === "assistant" 
                        ? "bg-blue-50 dark:bg-blue-900/30" 
                        : "bg-gray-200 dark:bg-slate-700"
                    } rounded-lg p-3 mt-1`}>
                      <p className="text-sm whitespace-pre-wrap dark:text-slate-200">
                        {chatMutation.isPending && index === messages.length - 1 && message.role === "assistant" ? (
                          <span>Sedang memproses permintaan Anda... <span className="animate-pulse">•••</span></span>
                        ) : (
                          message.content
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-4 pl-12 pr-20 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Tanyakan atau minta bantuan AI..."
              disabled={chatMutation.isPending}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Keyboard className="h-5 w-5 text-gray-400 dark:text-slate-500" />
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button 
                className="bg-primary text-white rounded-lg px-4 py-2 mr-2 hover:bg-blue-700 transition"
                onClick={handleSendMessage}
                disabled={chatMutation.isPending || input.trim() === ""}
              >
                <Layers className="h-4 w-4 mr-1" /> Kirim
              </Button>
            </div>
          </div>
          
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-900 max-w-sm mx-auto">
            <p className="text-sm text-green-800 dark:text-green-300 flex items-center justify-center">
              <Check className="h-4 w-4 mr-2" /> Model AI siap digunakan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
