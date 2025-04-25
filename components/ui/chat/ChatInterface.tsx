// src/components/ui/chat/ChatInterface.tsx
'use client';

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2 } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

export const ChatInterface = () => {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim() || isLoading || !session) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Filter out system messages when displaying to user
    const displayMessages = messages.filter(msg => msg.role !== "system");
    
    // Send only visible messages to API
    fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [...displayMessages, userMessage],
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        
        // Add assistant message
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      })
      .catch(error => {
        console.error("Error sending message:", error);
        
        // Add error message as assistant
        const errorMessage: ChatMessage = {
          role: "assistant",
          content: "I'm sorry, I encountered an error processing your request. Please try again later.",
          timestamp: new Date(),
        };
        
        setMessages(prev => [...prev, errorMessage]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  // Filter out system messages when displaying to user
  const displayMessages = messages.filter(msg => msg.role !== "system");
  
  return (
    <div className="flex flex-col h-full max-h-[80vh] bg-background border rounded-lg shadow-sm">
      <div className="p-4 border-b bg-muted/50">
        <h2 className="text-lg font-semibold">Mental Health Assistant</h2>
        <p className="text-sm text-muted-foreground">
          Chat with our AI to get support and guidance
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-4 max-h-[calc(80vh-200px)] overflow-y-auto">

        <div className="space-y-4">
          {displayMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-4xl mb-4">👋</div>
              <h3 className="text-lg font-medium">Welcome to Mental Health Support</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                How are you feeling today? I'm here to listen and offer guidance.
              </p>
            </div>
          ) : (
            displayMessages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                    <span className="text-xs">AI</span>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === "user" ? "text-primary-foreground/80" : "text-muted-foreground"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 bg-muted">
                    <span className="text-xs">You</span>
                  </Avatar>
                )}
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                <span className="text-xs">AI</span>
              </Avatar>
              <div className="rounded-lg p-3 bg-muted">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t mt-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="min-h-12 flex-1 resize-none"
            disabled={isLoading || !session}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim() || !session}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </form>
        {!session && (
          <p className="text-xs text-muted-foreground mt-2">
            Please sign in to use the chat
          </p>
        )}
      </div>
    </div>
  );
};