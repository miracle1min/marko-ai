import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Message, AiCharacter, AiCharacterChatRequest } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, LoaderCircle, Send, User, Wifi } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { formatDistance } from "date-fns";
import { id } from "date-fns/locale";
import { Link } from "wouter";

// Typing effect hook
const useTypingEffect = (
  text: string,
  speed: number = 10, // Reduced default speed from 30 to 10
  onComplete?: () => void
) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text || currentIndex >= text.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    // Use a variable speed approach - type faster for longer texts
    const dynamicSpeed = text.length > 300 ? speed / 2 : speed;
    
    // Add multiple characters at once for very long messages
    const charsToAdd = text.length > 500 ? 3 : 1;
    
    const timer = setTimeout(() => {
      const endIndex = Math.min(currentIndex + charsToAdd, text.length);
      const textToAdd = text.substring(currentIndex, endIndex);
      setDisplayedText((prev) => prev + textToAdd);
      setCurrentIndex((prev) => prev + charsToAdd);
    }, dynamicSpeed);

    return () => clearTimeout(timer);
  }, [text, currentIndex, speed, onComplete]);

  return { displayedText, isComplete };
};

interface ChatMessageProps {
  message: Message;
  isLast?: boolean;
  characterName: string;
  characterAvatar: string;
  setIsTypingCompleted?: (completed: boolean) => void;
}

const ChatMessage = ({ 
  message, 
  isLast, 
  characterName, 
  characterAvatar,
  setIsTypingCompleted 
}: ChatMessageProps) => {
  const isUser = message.role === "user";
  const timestamp = message.timestamp || new Date().toISOString();
  const formattedTime = formatDistance(new Date(timestamp), new Date(), {
    addSuffix: false,
    locale: id
  });

  // Fungsi untuk merender konten Markdown dengan format yang benar
  const formatMessageContent = (content: string) => {
    // Deteksi Markdown dan ubah menjadi HTML
    let formattedContent = content;
    
    // Format bold text
    formattedContent = formattedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Format italic text
    formattedContent = formattedContent.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Format lists
    formattedContent = formattedContent.replace(/^\d+\.\s+(.*?)$/gm, '<li>$1</li>');
    formattedContent = formattedContent.replace(/^-\s+(.*?)$/gm, '<li>$1</li>');
    
    // Format headings
    formattedContent = formattedContent.replace(/^#\s+(.*?)$/gm, '<h1>$1</h1>');
    formattedContent = formattedContent.replace(/^##\s+(.*?)$/gm, '<h2>$1</h2>');
    formattedContent = formattedContent.replace(/^###\s+(.*?)$/gm, '<h3>$1</h3>');
    
    // Detect and wrap consecutive <li> elements with <ol> or <ul>
    const listPattern = /<li>.*?<\/li>(\s*<li>.*?<\/li>)+/g;
    formattedContent = formattedContent.replace(listPattern, (match) => {
      if (match.includes('<li>1.')) {
        return `<ol>${match}</ol>`;
      } else {
        return `<ul>${match}</ul>`;
      }
    });
    
    // Convert new lines to paragraphs for non-formatted text
    formattedContent = formattedContent.replace(/^(?!<[uo]l>|<li>|<h[1-3]>)(.*?)$/gm, (match, p1) => {
      if (p1.trim().length > 0) {
        return `<p>${p1}</p>`;
      }
      return match;
    });
    
    // Clean up empty lines
    formattedContent = formattedContent.replace(/\n{2,}/g, '\n');
    
    return formattedContent;
  };

  // Gunakan efek typing untuk pesan AI
  const { displayedText, isComplete } = useTypingEffect(
    message.content,
    isUser ? 0 : 5, // Kecepatan typing dipercepat (dari 20 menjadi 5 ms)
    () => {
      if (isLast && !isUser && setIsTypingCompleted) {
        setIsTypingCompleted(true);
      }
    }
  );

  // Jika user, tampilkan langsung. Jika AI dan merupakan pesan terakhir, gunakan efek typing
  const contentToDisplay = isUser || !isLast 
    ? message.content 
    : displayedText;

  return (
    <div 
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3 ${isLast ? "animate-fade-in" : ""}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-2">
          <Avatar className="h-8 w-8 ring-2 ring-white/50 dark:ring-gray-800/50">
            <AvatarImage src={characterAvatar} alt={characterName} />
            <AvatarFallback>
              {characterName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      
      <div 
        className={`max-w-[80%] ${
          isUser 
            ? "bg-primary/70 text-white rounded-3xl rounded-tr-sm backdrop-blur-sm" 
            : "bg-transparent rounded-3xl rounded-tl-sm backdrop-blur-lg"
        } py-3 px-4 shadow-md border ${
          isUser 
            ? "border-primary/30" 
            : "border-white/40"
        }`}
        style={{
          background: isUser ? undefined : 'rgba(255, 255, 255, 0.15)'
        }}
      >
        <div 
          className={`prose prose-sm max-w-none ${
            isUser 
              ? "text-white prose-invert" 
              : "text-white dark:text-white font-medium"
          } chat-message-content`}
          dangerouslySetInnerHTML={{ 
            __html: isUser 
              ? contentToDisplay 
              : formatMessageContent(contentToDisplay) 
          }}
        />
        <div className={`text-xs mt-1 ${isUser ? "text-white/90" : "text-white/90"} text-right font-medium`}>
          {formattedTime}
          {!isUser && isLast && !isComplete && (
            <span className="ml-1 inline-block">
              <span className="typing-dot bg-white"></span>
              <span className="typing-dot bg-white" style={{animationDelay: '0.2s'}}></span>
              <span className="typing-dot bg-white" style={{animationDelay: '0.4s'}}></span>
            </span>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-2">
          <Avatar className="h-8 w-8 ring-2 ring-white/50 dark:ring-gray-800/50">
            <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
              <User size={16} />
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};

interface CharacterChatInterfaceProps {
  character: AiCharacter;
}

export default function CharacterChatInterface({ character }: CharacterChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingCompleted, setIsTypingCompleted] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [chatMessages, isTyping]);

  // Custom CSS untuk efek typing dan background abstrak
  useEffect(() => {
    // Tambahkan CSS untuk animation typing dot dan background
    const style = document.createElement('style');
    style.textContent = `
      .typing-dot {
        display: inline-block;
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 2px;
        animation: typingAnimation 1.4s infinite;
      }
      
      @keyframes typingAnimation {
        0%, 100% { opacity: 0.3; transform: translateY(0); }
        50% { opacity: 1; transform: translateY(-2px); }
      }
      
      .chat-message-content h1 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      
      .chat-message-content h2 {
        font-size: 1.15rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      
      .chat-message-content h3 {
        font-size: 1.05rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }
      
      .chat-message-content ul, .chat-message-content ol {
        margin-left: 1.5rem;
        margin-bottom: 0.5rem;
      }
      
      .chat-message-content p {
        margin-bottom: 0.5rem;
      }
      
      .chat-message-content strong {
        font-weight: 600;
      }
      
      .ai-chat-background {
        background: linear-gradient(125deg, #0f172a, #1e293b);
        position: relative;
        overflow: hidden;
      }
      
      .ai-chat-background::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: 
          radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 25%),
          radial-gradient(circle at 80% 10%, rgba(139, 92, 246, 0.1) 0%, transparent 20%),
          radial-gradient(circle at 40% 70%, rgba(16, 185, 129, 0.1) 0%, transparent 30%),
          radial-gradient(circle at 90% 60%, rgba(59, 130, 246, 0.1) 0%, transparent 25%),
          radial-gradient(circle at 10% 90%, rgba(124, 58, 237, 0.1) 0%, transparent 15%);
        z-index: 1;
        opacity: 0.8;
        pointer-events: none;
      }
      
      .ai-chat-background::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: 
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238b5cf6' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
        background-position: 0 0, 15px 15px;
        z-index: 1;
        opacity: 0.5;
        pointer-events: none;
      }
      
      .ai-chat-content {
        position: relative;
        z-index: 5;
      }
      
      /* Pastikan konten dalam bubble chat memiliki kontras yang baik */
      .chat-message-content {
        position: relative;
        z-index: 2;
      }
      
      .ai-circuit-pattern {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%2310b981' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
        opacity: 0.3;
        pointer-events: none;
        z-index: 1;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (chatRequest: AiCharacterChatRequest) => {
      return apiRequest('POST', `/api/ai-characters/${character.id}/chat`, chatRequest);
    },
    onSuccess: (data, variables) => {
      if (data && data.response) {
        // Add the assistant's response to the chat with typing effect
        setIsTypingCompleted(false); // Start the typing effect
        setChatMessages((prevMessages) => [
          ...prevMessages,
          { 
            role: "assistant", 
            content: data.response,
            timestamp: new Date().toISOString()
          }
        ]);
        setIsTyping(false);
      }
    },
    onError: (error) => {
      console.error("Chat error:", error);
      toast({
        title: "Kesalahan",
        description: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
        variant: "destructive"
      });
      setIsTyping(false);
    }
  });

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !isTypingCompleted) return;
    
    // Add the user's message to the chat immediately
    const userMessage: Message = { 
      role: "user", 
      content: inputMessage,
      timestamp: new Date().toISOString()
    };
    setChatMessages((prevMessages) => [...prevMessages, userMessage]);
    
    // Clear the input and show the typing indicator
    setInputMessage("");
    setIsTyping(true);
    
    // Send the message to the API
    chatMutation.mutate({
      message: inputMessage,
      previousMessages: chatMessages
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent new line
      handleSendMessage();
    }
  };
  
  // Show example greeting if no messages yet
  useEffect(() => {
    if (chatMessages.length === 0) {
      // Simulate a welcome message from the character
      setChatMessages([
        { 
          role: "assistant",
          content: `Halo! Saya adalah ${character.name}. ${character.shortDescription || character.description.substring(0, 100)} Apa yang ingin Anda diskusikan hari ini?`,
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [character]);

  // Format current time for status bar
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-900">
      {/* Status Bar - Mobile only */}
      <div className="bg-gray-50 dark:bg-gray-900 p-2 text-xs flex justify-between items-center px-4 w-full flex-shrink-0">
        <div>{getCurrentTime()}</div>
        <div className="flex items-center gap-1">
          <Wifi className="h-3 w-3" />
          <div>4G</div>
          <div>85%</div>
        </div>
      </div>
      
      {/* Chat Header - Sticky */}
      <div className="flex items-center justify-between p-3 border-b bg-white dark:bg-gray-900 z-20 shadow-sm w-full flex-shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link to="/ai-karakter">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarImage src={character.avatarUrl} alt={character.name} />
            <AvatarFallback>{character.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-base leading-tight">{character.name}</h3>
            <p className="text-xs text-muted-foreground">Active now</p>
          </div>
        </div>
      </div>
      
      {/* Main Container - Flex 1 to take available space */}
      <div className="ai-chat-background flex-1 overflow-hidden relative">
        <div className="ai-circuit-pattern absolute inset-0"></div>
        
        {/* Scrollable Container */}
        <div 
          ref={chatContainerRef}
          className="h-full overflow-y-scroll scrollbar-thin"
          style={{ 
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
            overscrollBehavior: "contain",
            msOverflowStyle: "none",
            scrollbarWidth: "thin", 
            scrollbarColor: "rgba(255, 255, 255, 0.1) transparent"
          }}
        >
          <div className="ai-chat-content p-4 pb-12 relative z-5 min-h-full">
            {chatMessages.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                characterName={character.name}
                characterAvatar={character.avatarUrl}
                isLast={index === chatMessages.length - 1}
                setIsTypingCompleted={setIsTypingCompleted}
              />
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex mb-4">
                <div className="flex-shrink-0 mr-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={character.avatarUrl} alt={character.name} />
                    <AvatarFallback>
                      {character.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div 
                  className="bg-transparent backdrop-blur-lg rounded-3xl rounded-tl-sm py-2 px-4 shadow-md border border-white/40"
                  style={{ background: 'rgba(255, 255, 255, 0.15)' }}
                >
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-white animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Input Area */}
      <div className="p-3 border-t bg-white dark:bg-gray-900 z-20 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] w-full flex-shrink-0">
        <div className="flex items-center gap-2 mx-auto">
          <Input
            placeholder="Ketik pesan..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-full shadow-sm border-gray-200 dark:border-gray-700 focus:border-primary"
            disabled={isTyping}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="rounded-full h-10 w-10 bg-primary text-white hover:bg-primary/90 flex-shrink-0 shadow-md"
          >
            {isTyping ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}