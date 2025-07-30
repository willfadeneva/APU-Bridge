import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Image, Video, Link, FileText } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function CreatePost() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const createPostMutation = useMutation({
    mutationFn: async (postData: { content: string }) => {
      await apiRequest("POST", "/api/posts", postData);
    },
    onSuccess: () => {
      setContent("");
      setIsExpanded(false);
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
      toast({
        title: "Post created",
        description: "Your post has been shared with your network.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Empty post",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }
    createPostMutation.mutate({ content: content.trim() });
  };

  if (!user) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <img 
            src={user.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`}
            alt="Your profile" 
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <Textarea
              placeholder="Share an update with your network..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="resize-none border-0 focus:ring-0 focus:outline-none p-0 text-base placeholder:text-gray-500"
              rows={isExpanded ? 4 : 1}
            />
            
            {isExpanded && (
              <>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                      <Image className="h-4 w-4 mr-1" />
                      <span className="text-sm">Photo</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                      <Video className="h-4 w-4 mr-1" />
                      <span className="text-sm">Video</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                      <FileText className="h-4 w-4 mr-1" />
                      <span className="text-sm">Document</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600">
                      <Link className="h-4 w-4 mr-1" />
                      <span className="text-sm">Link</span>
                    </Button>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setContent("");
                        setIsExpanded(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSubmit}
                      disabled={!content.trim() || createPostMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {createPostMutation.isPending ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
