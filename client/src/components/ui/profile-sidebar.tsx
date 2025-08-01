import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Users, Calendar, BookOpen, MapPin } from "lucide-react";
import { Link } from "wouter";
import type { User } from "@shared/schema";

interface ProfileSidebarProps {
  user: User;
}

export default function ProfileSidebar({ user }: ProfileSidebarProps) {
  const getUserRoleBadge = (role: string) => {
    const roleColors = {
      student: "role-badge-student",
      alumni: "role-badge-alumni", 
      faculty: "role-badge-faculty",
      admin: "role-badge-admin"
    };
    return roleColors[role as keyof typeof roleColors] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-4">
      {/* Main Profile Card */}
      <Card className="overflow-hidden bg-white">
        {/* Cover Photo */}
        <div className="h-16 university-gradient relative group cursor-pointer">
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
            <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Change Cover
            </span>
          </div>
        </div>
        
        {/* Profile Info */}
        <CardContent className="px-4 pb-4 pt-6 bg-white relative">
          {/* Profile Image - positioned above the content area */}
          <div className="absolute -top-8 left-4 z-30">
            <div className="relative group cursor-pointer inline-block">
              <img 
                src={user.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`}
                alt={`${user.firstName} ${user.lastName}`} 
                className="w-16 h-16 rounded-full border-4 border-white object-cover bg-white shadow-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-full flex items-center justify-center">
                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Change
                </span>
              </div>
            </div>
          </div>
          
          {/* Content with top margin to avoid profile image */}
          <div className="mt-10">
            <div className="flex flex-col space-y-2 mb-3">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-800 text-base">
                  {user.firstName} {user.lastName}
                </h3>
                <Badge className={getUserRoleBadge(user.role || 'student')}>
                  {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Student'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{user.title || 'University Student'}</p>
            </div>
            
            <div className="flex flex-col space-y-1 text-xs text-gray-500 mb-4">
              {user.university && (
                <div className="flex items-center">
                  <BookOpen className="h-3 w-3 mr-1" />
                  <span>{user.university}</span>
                </div>
              )}
              {user.graduationYear && (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Class of {user.graduationYear}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  <span>Profile views</span>
                </div>
                <span className="font-medium" style={{color: '#aa003e'}}>23</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1" />
                  <span>Connections</span>
                </div>
                <span className="font-medium" style={{color: '#aa003e'}}>156</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-4">
              <Link href="/profile" className="flex-1">
                <Button className="w-full text-white text-sm" style={{backgroundColor: '#aa003e'}} onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#880032'} onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#aa003e'}>
                  View Profile
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                className="px-3 text-sm hover:bg-red-50"
                style={{borderColor: '#aa003e', color: '#aa003e'}}
                onClick={() => window.location.href = '/profile?edit=true'}
              >
                Edit
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Quick Links</h4>
          <div className="space-y-2">
            <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-800 transition-colors duration-200">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Campus Events</span>
            </a>
            <a href="#" className="flex items-center text-sm text-gray-600 hover:text-red-800 transition-colors duration-200">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Course Registration</span>
            </a>
            <Link href="/connections">
              <div className="flex items-center text-sm text-gray-600 hover:text-red-800 transition-colors duration-200 cursor-pointer">
                <Users className="h-4 w-4 mr-2" />
                <span>Study Groups</span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
