import React, { useState, useEffect } from "react";
import ChatLayout from "@/components/chat/ChatLayout";
import { Message } from "@/lib/types";
import { sendChatMessage } from "@/lib/geminiApi";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const [location] = useLocation();
  const [initialMessageSent, setInitialMessageSent] = useState(false);

  // Function to send a chat message
  const handleSendMessage = async (content: string) => {
    if (isProcessing) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);
    
    try {
      // Call the API
      const response = await sendChatMessage({
        message: content,
        model: "gemini-pro",
        creativity: 0.7,
        contexts: {
          seo: false,
          keyword: false,
          content: true,
        },
      });
      
      // Add AI response to chat
      const aiMessage: Message = {
        role: "assistant",
        content: response.response,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Initialize chat with greeting message
  useEffect(() => {
    const initialMessage: Message = {
      role: "assistant",
      content: "Halo! Saya Marko AI, asisten AI profesional yang siap membantu berbagai kebutuhan digital Anda. Saya dapat membantu Anda dengan berbagai hal seperti pembuatan konten, coding, SEO, dan banyak lagi.\n\nApa yang ingin Anda tanyakan atau lakukan hari ini? Saya juga bisa merekomendasikan tools khusus yang kami miliki sesuai kebutuhan Anda."
    };
    setMessages([initialMessage]);
  }, []);
  
  // Check for message parameter from URL and send it
  useEffect(() => {
    if (initialMessageSent || messages.length < 1) return;
    
    // Check if there's a message in the URL parameters
    const params = new URLSearchParams(window.location.search);
    const messageFromHome = params.get('message');
    
    if (messageFromHome && messageFromHome.trim()) {
      // Send the message from home page automatically with a small delay
      const timer = setTimeout(() => {
        handleSendMessage(messageFromHome);
        setInitialMessageSent(true);
        
        // Clean up the URL to avoid resubmitting the same message on refresh
        window.history.replaceState({}, document.title, location);
      }, 500); // Small delay to ensure initialMessage is displayed first
      
      return () => clearTimeout(timer);
    }
  }, [messages, location, initialMessageSent]);

  // Function to reset the chat
  const handleResetChat = () => {
    // Reset to initial state
    const initialMessage: Message = {
      role: "assistant",
      content: "Halo! Saya Marko AI, asisten AI profesional yang siap membantu berbagai kebutuhan digital Anda. Saya dapat membantu Anda dengan berbagai hal seperti pembuatan konten, coding, SEO, dan banyak lagi.\n\nApa yang ingin Anda tanyakan atau lakukan hari ini? Saya juga bisa merekomendasikan tools khusus yang kami miliki sesuai kebutuhan Anda."
    };
    setMessages([initialMessage]);
    setInitialMessageSent(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ChatLayout 
        messages={messages}
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        onResetChat={handleResetChat}
      />
    </div>
  );
}