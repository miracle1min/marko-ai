import React from "react";
import { Message } from "@/lib/types";
import { Bot, User, Copy, CheckCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast({
      description: "Message copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const isBot = message.role === "assistant";

  return (
    <div 
      className={cn(
        "flex items-start gap-3 group",
        isBot ? "" : "justify-end"
      )}
    >
      {isBot && (
        <Avatar className="h-8 w-8 mt-1 bg-red-100">
          <AvatarFallback className="text-red-500">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div 
        className={cn(
          "relative px-4 py-3 rounded-lg max-w-[85%] sm:max-w-[75%]",
          isBot 
            ? "bg-white border border-gray-200 text-gray-800" 
            : "bg-red-500 text-white"
        )}
      >
        {isBot ? (
          <>
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={copyToClipboard}
            >
              {copied ? (
                <CheckCheck className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 text-gray-400" />
              )}
            </Button>
          </>
        ) : (
          <p className="whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
      
      {!isBot && (
        <Avatar className="h-8 w-8 mt-1 bg-gray-100">
          <AvatarFallback className="text-gray-500">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}