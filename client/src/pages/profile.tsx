import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/ui/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Calendar, Building } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Profile() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

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
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="animate-pulse">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
              <div className="h-48 bg-gray-300"></div>
              <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
                  <div className="flex flex-col md:flex-row md:items-end">
                    <div className="w-32 h-32 bg-gray-300 rounded-full mb-4 md:mb-0 md:mr-6"></div>
                    <div className="space-y-2">
                      <div className="h-8 bg-gray-300 rounded w-48"></div>
                      <div className="h-6 bg-gray-300 rounded w-32"></div>
                      <div className="h-4 bg-gray-300 rounded w-64"></div>
                    </div>
                  </div>
                </div>
              </div>
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
      
      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Profile Header */}
        <Card className="overflow-hidden mb-6">
          {/* Cover Photo */}
          <div 
            className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white border-white/30"
            >
              <Camera className="h-4 w-4 mr-1" />
              Edit cover photo
            </Button>
          </div>

          <CardContent className="px-8 pb-8">
            {/* Profile Info */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
              <div className="flex flex-col md:flex-row md:items-end">
                <img 
                  src={user.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face`}
                  alt="Profile" 
                  className="w-32 h-32 rounded-full border-4 border-white object-cover mb-4 md:mb-0 md:mr-6"
                />
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {user.firstName} {user.lastName}
                    </h1>
                    <Badge className={getUserRoleBadge(user.role || 'student')}>
                      {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Student'}
                    </Badge>
                  </div>
                  <p className="text-lg text-gray-600 mb-2">{user.title || 'University Student'}</p>
                  <div className="flex flex-wrap items-center gap-4 text-gray-500">
                    {user.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{user.location}</span>
                      </div>
                    )}
                    {user.university && (
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        <span className="text-sm">{user.university}</span>
                      </div>
                    )}
                    {user.graduationYear && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className="text-sm">Class of {user.graduationYear}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4 md:mt-0">
                <Button onClick={() => setIsEditing(true)}>
                  Edit profile
                </Button>
                <Button variant="outline">
                  Share profile
                </Button>
              </div>
            </div>

            {/* About Section */}
            {user.about && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">About</h2>
                <p className="text-gray-700 leading-relaxed">{user.about}</p>
              </div>
            )}

            {/* Skills Section */}
            {user.skills && user.skills.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Education Section */}
        {user.university && (
          <Card className="mb-6">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Education</h2>
              
              <div className="flex">
                <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center mr-4">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {user.major ? `${user.major} - ${user.university}` : user.university}
                  </h3>
                  <p className="text-blue-600 mb-1">{user.university}</p>
                  {user.graduationYear && (
                    <p className="text-sm text-gray-500 mb-2">
                      Expected Graduation: {user.graduationYear}
                    </p>
                  )}
                  {user.major && (
                    <p className="text-gray-700 text-sm">
                      Major: {user.major}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800">Email</h4>
                <p className="text-gray-600">{user.email}</p>
              </div>
              
              {user.location && (
                <div>
                  <h4 className="font-medium text-gray-800">Location</h4>
                  <p className="text-gray-600">{user.location}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
