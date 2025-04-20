import React, { useState, useEffect } from "react";
import AnimatedPage from "@/components/AnimatedPage";
import ChatLayout from "@/components/chat/ChatLayout";
import { Message } from "@/lib/types";
import { sendChatMessage } from "@/lib/geminiApi";
import { useToast } from "@/hooks/use-toast";
import { useLoading } from "@/contexts/LoadingContext";
import { useLocation } from "wouter";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { startLoading, stopLoading } = useLoading();
  const [location] = useLocation();

  // Initial greeting message and check for URL parameters when the component is mounted
  useEffect(() => {
    const initialMessage: Message = {
      role: "assistant",
      content: "Halo! Saya adalah Marko AI Assistant. Bagaimana saya bisa membantu Anda hari ini?"
    };
    setMessages([initialMessage]);

    // Check if there's a message parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const messageParam = urlParams.get('message');
    
    // If a message parameter exists, automatically send it
    if (messageParam && messageParam.trim()) {
      handleSendMessage(messageParam);
      
      // Clean up the URL by removing the query parameter without reloading the page
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  const handleSendMessage = async (content: string) => {
    if (isProcessing) return;
    
    // Add user message to chat
    const userMessage: Message = {
      role: "user",
      content,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);
    startLoading();
    
    try {
      // Call the API
      const response = await sendChatMessage({
        message: content,
        model: "gemini-2.5-flash", // Updated to use the latest flash model
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
        content: response && response.response ? response.response : "Maaf, saya tidak dapat merespon saat ini. Silakan coba lagi nanti.",
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      
      // Add AI error message to chat
      const errorMessage: Message = {
        role: "assistant",
        content: "Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi atau gunakan kata kunci yang berbeda."
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: error.message || "Gagal mendapatkan respon. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      stopLoading();
    }
  };

  const handleResetChat = () => {
    // Reset to initial state
    const initialMessage: Message = {
      role: "assistant",
      content: "Halo! Saya adalah Marko AI Assistant. Bagaimana saya bisa membantu Anda hari ini?"
    };
    setMessages([initialMessage]);
  };

  return (
    <AnimatedPage>
      <ChatLayout 
        messages={messages}
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        onResetChat={handleResetChat}
      />
    </AnimatedPage>
  );
}