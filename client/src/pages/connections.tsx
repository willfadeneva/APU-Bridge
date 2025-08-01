import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ConnectionCard from "@/components/ui/connection-card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Search, Users, UserPlus, Clock } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { User, ConnectionWithUsers } from "@shared/schema";

export default function Connections() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

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

  const { data: connections } = useQuery<ConnectionWithUsers[]>({
    queryKey: ["/api/connections"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: pendingRequests } = useQuery<ConnectionWithUsers[]>({
    queryKey: ["/api/connections/pending"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: suggestions } = useQuery<User[]>({
    queryKey: ["/api/connections/suggestions"],
    retry: false,
    enabled: isAuthenticated,
  });

  const { data: searchResults } = useQuery<User[]>({
    queryKey: ["/api/users/search", { q: searchQuery }],
    retry: false,
    enabled: isAuthenticated && searchQuery.length > 2,
  });

  const sendConnectionMutation = useMutation({
    mutationFn: async (addresseeId: string) => {
      await apiRequest("POST", "/api/connections", { addresseeId });
    },
    onSuccess: () => {
      toast({
        title: "Connection request sent",
        description: "Your connection request has been sent successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connections/suggestions"] });
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
        description: "Failed to send connection request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const acceptConnectionMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      await apiRequest("PUT", `/api/connections/${connectionId}/accept`);
    },
    onSuccess: () => {
      toast({
        title: "Connection accepted",
        description: "You are now connected!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/connections/pending"] });
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
        description: "Failed to accept connection. Please try again.",
        variant: "destructive",
      });
    },
  });

  const rejectConnectionMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      await apiRequest("PUT", `/api/connections/${connectionId}/reject`);
    },
    onSuccess: () => {
      toast({
        title: "Connection rejected",
        description: "Connection request has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/connections/pending"] });
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
        description: "Failed to reject connection. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getUserRoleBadge = (role: string) => {
    const roleColors = {
      student: "bg-purple-100 text-purple-800",
      alumni: "bg-green-100 text-green-800",
      faculty: "bg-blue-100 text-blue-800",
      admin: "bg-red-100 text-red-800"
    };
    return roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">My Network</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs defaultValue="connections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="connections" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Connections</span>
              {connections && (
                <Badge variant="secondary" className="ml-1">
                  {connections.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Pending</span>
              {pendingRequests && pendingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-1">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4" />
              <span>Suggestions</span>
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connections">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections && connections.length > 0 ? (
                connections.map((connection) => {
                  const otherUser = connection.requesterId === user.id ? connection.addressee : connection.requester;
                  return (
                    <ConnectionCard
                      key={connection.id}
                      user={otherUser}
                      isConnected={true}
                      onConnect={() => {}}
                      onMessage={() => window.location.href = `/messages?user=${otherUser.id}`}
                    />
                  );
                })
              ) : (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No connections yet</h3>
                    <p className="text-gray-600">Start building your network by connecting with people you know.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests && pendingRequests.length > 0 ? (
                pendingRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={request.requester.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`}
                          alt={`${request.requester.firstName} ${request.requester.lastName}`}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {request.requester.firstName} {request.requester.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">{request.requester.title}</p>
                          <Badge className={getUserRoleBadge(request.requester.role || 'student')}>
                            {request.requester.role?.charAt(0).toUpperCase() + request.requester.role?.slice(1)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => acceptConnectionMutation.mutate(request.id)}
                          disabled={acceptConnectionMutation.isPending}
                          className="flex-1"
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => rejectConnectionMutation.mutate(request.id)}
                          disabled={rejectConnectionMutation.isPending}
                          className="flex-1"
                        >
                          Decline
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No pending requests</h3>
                    <p className="text-gray-600">You don't have any pending connection requests.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="suggestions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions && suggestions.length > 0 ? (
                suggestions.map((person) => (
                  <ConnectionCard
                    key={person.id}
                    user={person}
                    isConnected={false}
                    onConnect={() => sendConnectionMutation.mutate(person.id)}
                    isConnecting={sendConnectionMutation.isPending}
                  />
                ))
              ) : (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center">
                    <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No suggestions available</h3>
                    <p className="text-gray-600">We'll show new connection suggestions as they become available.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="search">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchQuery.length > 2 ? (
                searchResults && searchResults.length > 0 ? (
                  searchResults.map((person) => (
                    <ConnectionCard
                      key={person.id}
                      user={person}
                      isConnected={false}
                      onConnect={() => sendConnectionMutation.mutate(person.id)}
                      isConnecting={sendConnectionMutation.isPending}
                    />
                  ))
                ) : (
                  <Card className="col-span-full">
                    <CardContent className="p-8 text-center">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
                      <p className="text-gray-600">Try searching with different keywords.</p>
                    </CardContent>
                  </Card>
                )
              ) : (
                <Card className="col-span-full">
                  <CardContent className="p-8 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Search for people</h3>
                    <p className="text-gray-600">Enter at least 3 characters to search for people in your network.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
