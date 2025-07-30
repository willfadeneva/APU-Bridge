import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/ui/navbar";
import ProfileSidebar from "@/components/ui/profile-sidebar";
import CreatePost from "@/components/ui/create-post";
import PostCard from "@/components/ui/post-card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { PostWithDetails } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const { data: posts, isLoading: postsLoading } = useQuery<PostWithDetails[]>({
    queryKey: ["/api/posts/feed"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: connectionSuggestions } = useQuery({
    queryKey: ["/api/connections/suggestions"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: jobs } = useQuery({
    queryKey: ["/api/jobs"],
    retry: false,
    enabled: isAuthenticated,
  });

  // WebSocket for real-time updates
  useEffect(() => {
    if (!user?.id) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'auth', userId: user.id }));
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'new_message') {
        // Invalidate conversations query to refresh message list
        queryClient.invalidateQueries({ queryKey: ["/api/messages/conversations"] });
      }
    };

    return () => {
      socket.close();
    };
  }, [user?.id, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <ProfileSidebar user={user} />
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2">
            <CreatePost />
            
            <div className="space-y-4">
              {postsLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-1/3" />
                          <Skeleton className="h-4 w-1/4" />
                          <Skeleton className="h-20 w-full" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : posts && posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} currentUser={user} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">No posts yet. Be the first to share something!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Job Recommendations */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">Recommended Jobs</h4>
                  <a href="/jobs" className="text-xs text-blue-600 hover:underline">View all</a>
                </div>
                
                {jobs && jobs.length > 0 ? (
                  <div className="space-y-3">
                    {jobs.slice(0, 3).map((job: any) => (
                      <div key={job.id} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                        <h5 className="font-medium text-sm text-gray-800">{job.title}</h5>
                        <p className="text-xs text-gray-600">{job.company}</p>
                        <p className="text-xs text-gray-600">{job.location}</p>
                        <div className="flex items-center mt-2">
                          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center mr-2">
                            <span className="text-white text-xs font-bold">
                              {job.company.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs text-green-600 font-medium">
                            {job.type === 'internship' ? 'Internship' : job.type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No job recommendations available</p>
                )}
              </CardContent>
            </Card>

            {/* People You May Know */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800">People You May Know</h4>
                  <a href="/connections" className="text-xs text-blue-600 hover:underline">See all</a>
                </div>
                
                {connectionSuggestions && connectionSuggestions.length > 0 ? (
                  <div className="space-y-3">
                    {connectionSuggestions.slice(0, 3).map((person: any) => (
                      <div key={person.id} className="flex items-center space-x-3">
                        <img 
                          src={person.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`} 
                          alt={`${person.firstName} ${person.lastName}`} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm text-gray-800 truncate">
                            {person.firstName} {person.lastName}
                          </h5>
                          <p className="text-xs text-gray-600 truncate">{person.title}</p>
                        </div>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">
                          Connect
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No connection suggestions available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
