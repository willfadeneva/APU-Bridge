import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Send, 
  MoreHorizontal,
  Clock 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { PostWithDetails, User } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

interface PostCardProps {
  post: PostWithDetails;
  currentUser: User;
}

export default function PostCard({ post, currentUser }: PostCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(
    post.likes?.some(like => like.userId === currentUser.id) || false
  );

  const likeMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/posts/${post.id}/like`);
    },
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
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
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    },
  });

  const commentMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", "/api/comments", {
        postId: post.id,
        content,
      });
    },
    onSuccess: () => {
      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ["/api/posts/feed"] });
      toast({
        title: "Comment added",
        description: "Your comment has been posted.",
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
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getUserRoleBadge = (role: string) => {
    const roleColors = {
      student: "role-badge-student",
      alumni: "role-badge-alumni",
      faculty: "role-badge-faculty",
      admin: "role-badge-admin"
    };
    return roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800";
  };

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/posts/${post.id}`);
    toast({
      title: "Post shared",
      description: "Link copied to clipboard",
    });
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={post.author.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`}
              alt={`${post.author.firstName} ${post.author.lastName}`} 
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-800">
                  {post.author.firstName} {post.author.lastName}
                </h3>
                <Badge className={getUserRoleBadge(post.author.role || 'student')}>
                  {post.author.role?.charAt(0).toUpperCase() + post.author.role?.slice(1) || 'Student'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{post.author.title}</p>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>
                  {post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Just now'}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          {post.mediaUrl && (
            <div className="mt-3">
              {post.mediaType === 'image' ? (
                <img 
                  src={post.mediaUrl} 
                  alt="Post media" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : post.mediaType === 'video' ? (
                <video 
                  src={post.mediaUrl} 
                  controls 
                  className="w-full h-64 rounded-lg"
                />
              ) : null}
            </div>
          )}
        </div>

        {/* Post Stats */}
        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>{post.likeCount || 0} likes</span>
            <span>{post.commentCount || 0} comments</span>
            <span>{post.shareCount || 0} shares</span>
          </div>
        </div>

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className={isLiked ? 'text-red-600 hover:text-red-700' : 'text-gray-600 hover:text-red-600'}
          >
            <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            <span>{isLiked ? 'Liked' : 'Like'}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            <span>Comment</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleShare}
          >
            <Share className="h-4 w-4 mr-1" />
            <span>Share</span>
          </Button>
          
          <Button variant="ghost" size="sm">
            <Send className="h-4 w-4 mr-1" />
            <span>Send</span>
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {/* Comment Input */}
            <div className="flex space-x-3 mb-4">
              <img 
                src={currentUser.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`}
                alt="Your profile" 
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <Button 
                    size="sm"
                    onClick={handleComment}
                    disabled={!newComment.trim() || commentMutation.isPending}
                  >
                    {commentMutation.isPending ? 'Posting...' : 'Post'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img 
                      src={comment.author.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`}
                      alt={`${comment.author.firstName} ${comment.author.lastName}`} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-800">
                            {comment.author.firstName} {comment.author.lastName}
                          </h4>
                          <Badge className={getUserRoleBadge(comment.author.role || 'student')} variant="outline">
                            {comment.author.role?.charAt(0).toUpperCase() + comment.author.role?.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 ml-3">
                        {comment.createdAt ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 'Just now'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
