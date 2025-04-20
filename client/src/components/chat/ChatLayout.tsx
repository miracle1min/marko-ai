import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, RefreshCw, Copy, Check, User, Bot } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/lib/types";

interface ChatLayoutProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  onResetChat: () => void;
}

export default function ChatLayout({ messages, onSendMessage, isProcessing, onResetChat }: ChatLayoutProps) {
  const [input, setInput] = useState("");
  const [copyingIndex, setCopyingIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      toast({
        title: "Pesan kosong",
        description: "Mohon masukkan pesan untuk dikirim.",
        variant: "destructive",
      });
      return;
    }
    
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyingIndex(index);
      toast({
        title: "Disalin ke clipboard",
        description: "Teks telah disalin ke clipboard",
      });
      setTimeout(() => setCopyingIndex(null), 2000);
    }).catch(err => {
      toast({
        title: "Gagal menyalin",
        description: "Tidak dapat menyalin teks ke clipboard",
        variant: "destructive",
      });
    });
  };

  // Function to format markdown-like syntax in message content
  const formatMessage = (content: string) => {
    // Add more formatting rules here as needed
    let formattedContent = content;
    
    // Bintang untuk bullet points
    formattedContent = formattedContent.replace(/^\* (.*?)$/gm, '<p class="mb-2 dark:text-slate-200">• $1</p>');
    
    // Format paragraf
    formattedContent = formattedContent.replace(/\n\n/g, '</p><p class="mb-3 dark:text-slate-200">');
    
    // Format judul dan subjudul
    formattedContent = formattedContent.replace(/^# (.*?)$/gm, '<h3 class="text-xl font-semibold mt-4 mb-3 text-blue-500 dark:text-blue-400">$1</h3>');
    formattedContent = formattedContent.replace(/^## (.*?)$/gm, '<h4 class="text-lg font-semibold mt-3 mb-2 text-blue-400 dark:text-blue-300">$1</h4>');
    
    // Format teks bold dan italic
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong class="dark:text-slate-100">$1</strong>');
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em class="dark:text-slate-200">$1</em>');
    
    // Format list items
    formattedContent = formattedContent.replace(/^- (.*?)$/gm, '<div class="flex items-start mb-2 dark:text-slate-200"><div class="mr-2">•</div><div>$1</div></div>');
    
    // Wrap in paragraph jika belum dilakukan
    if (!formattedContent.startsWith('<')) {
      formattedContent = '<p class="mb-3 dark:text-slate-200">' + formattedContent + '</p>';
    }
    
    return formattedContent;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0E1628] text-white">
      
      {/* Chat messages */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 pt-16 sm:pt-20 md:pt-16">
        <div className="space-y-10">
          {messages.map((message, index) => (
            <div key={index} 
              className={`mb-6 ${message.role === "assistant" ? "pl-2 sm:pl-4" : "pr-2 sm:pr-4"} animate-fadeIn`}
              style={{ animationDelay: `${index * 100}ms` }}>
              <div className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
                <div className={`flex max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] flex-col ${
                  message.role === "assistant" 
                    ? "bg-[#0F172A] border border-[#1E293B]/70 rounded-tl-none rounded-tr-2xl rounded-bl-2xl rounded-br-2xl" 
                    : "bg-[#1D4ED8] rounded-tl-2xl rounded-tr-none rounded-bl-2xl rounded-br-2xl"
                } shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-shadow duration-300`}>
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <div className={`flex items-center ${message.role === "assistant" ? "text-blue-400" : "text-blue-200"}`}>
                      {message.role === "assistant" ? (
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center mr-2">
                            <Bot className="h-3.5 w-3.5 text-blue-300" />
                          </div>
                          <span className="font-medium text-sm">Marko AI</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-700/50 flex items-center justify-center mr-2">
                            <User className="h-3.5 w-3.5 text-blue-300" />
                          </div>
                          <span className="font-medium text-sm">Anda</span>
                        </div>
                      )}
                    </div>
                    {message.role === "assistant" && (
                      <button 
                        onClick={() => copyToClipboard(message.content, index)}
                        className="p-1.5 rounded-md hover:bg-[#2D3653]/70 transition-colors"
                        title="Salin ke clipboard"
                      >
                        {copyingIndex === index ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4 text-white/60 hover:text-white/90" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="prose prose-invert max-w-none px-4 py-3 break-words">
                    {message.role === "assistant" ? (
                      <div 
                        className="text-white/95 leading-relaxed text-base" 
                        dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                      />
                    ) : (
                      <p className="text-white/95 whitespace-pre-wrap leading-relaxed text-base">{message.content}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          {isProcessing && (
            <div className="mb-6 pl-2 sm:pl-4">
              <div className="flex justify-start">
                <div className="flex max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] flex-col bg-[#0F172A] border border-[#1E293B]/70 rounded-tl-none rounded-tr-2xl rounded-bl-2xl rounded-br-2xl">
                  <div className="flex items-center justify-between px-4 pt-3 pb-1">
                    <div className="flex items-center text-blue-400">
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-full bg-blue-900/50 flex items-center justify-center mr-2">
                          <Bot className="h-3.5 w-3.5 text-blue-300" />
                        </div>
                        <span className="font-medium text-sm">Marko AI</span>
                      </div>
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500/70 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500/70 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500/70 animate-bounce" style={{ animationDelay: '400ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Message input */}
      <div className="sticky bottom-0 bg-gradient-to-t from-[#0c1425] to-[#0F172A] border-t border-[#1E293B]/50 py-6 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="relative">
            <div className="bg-[#0F172A] border border-[#1E293B] hover:border-blue-500/50 focus-within:border-blue-500/50 transition-colors rounded-full shadow-lg shadow-blue-500/5 overflow-hidden">
              <input
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tanyakan pada Marko AI..."
                className="w-full p-4 pl-6 pr-16 bg-transparent text-white placeholder-gray-400 focus:outline-none text-base"
                disabled={isProcessing}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-900"
                disabled={isProcessing || !input.trim()}
              >
                <ArrowRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </form>
          <div className="mt-2.5 text-xs text-white/50 text-center flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
            <span>Marko AI • Gunakan untuk konten yang informatif dan selalu verifikasi informasi penting</span>
          </div>
        </div>
      </div>

    </div>
  );
}