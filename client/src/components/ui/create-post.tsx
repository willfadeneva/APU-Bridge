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
    <Card className="mb-6 w-full">
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-start space-x-3">
          <img 
            src={user.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`}
            alt="Your profile" 
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <Textarea
              placeholder="Share an update with your network..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="resize-none border-0 focus:ring-0 focus:outline-none p-0 text-sm lg:text-base placeholder:text-gray-500 w-full"
              rows={isExpanded ? 4 : 1}
            />
            
            {isExpanded && (
              <>
                <div className="mt-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 flex-shrink-0 text-xs lg:text-sm">
                      <Image className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                      <span>Photo</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 flex-shrink-0 text-xs lg:text-sm">
                      <Video className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                      <span>Video</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 flex-shrink-0 text-xs lg:text-sm">
                      <FileText className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                      <span>Document</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-600 flex-shrink-0 text-xs lg:text-sm">
                      <Link className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                      <span>Link</span>
                    </Button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setContent("");
                        setIsExpanded(false);
                      }}
                      className="flex-shrink-0 text-xs lg:text-sm"
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm"
                      onClick={handleSubmit}
                      disabled={!content.trim() || createPostMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0 text-xs lg:text-sm"
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
