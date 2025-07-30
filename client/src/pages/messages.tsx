import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/ui/navbar";
import MessageInterface from "@/components/ui/message-interface";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Messages() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: "calc(100vh - 12rem)" }}>
              <div className="flex h-full">
                <div className="w-1/3 border-r border-gray-200">
                  <div className="p-6 border-b border-gray-200">
                    <div className="h-6 bg-gray-300 rounded mb-4"></div>
                    <div className="h-10 bg-gray-300 rounded"></div>
                  </div>
                  <div className="p-4 space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-full bg-gray-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Messages</h1>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: "calc(100vh - 12rem)" }}>
          <MessageInterface />
        </div>
      </div>
    </div>
  );
}
