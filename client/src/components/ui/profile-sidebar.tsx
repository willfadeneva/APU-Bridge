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
      <Card className="overflow-hidden">
        {/* Cover Photo */}
        <div className="h-16 university-gradient"></div>
        
        {/* Profile Info */}
        <CardContent className="px-4 pb-4 -mt-8 relative">
          <img 
            src={user.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`}
            alt={`${user.firstName} ${user.lastName}`} 
            className="w-16 h-16 rounded-full border-4 border-white object-cover"
          />
          
          <div className="mt-3">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-800">
                {user.firstName} {user.lastName}
              </h3>
              <Badge className={getUserRoleBadge(user.role || 'student')}>
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Student'}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mb-1">{user.title || 'University Student'}</p>
            <div className="flex flex-col space-y-1 text-xs text-gray-500">
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
          </div>

          {/* Stats */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span>Profile views</span>
              </div>
              <span className="font-medium text-blue-600">23</span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span>Connections</span>
              </div>
              <span className="font-medium text-blue-600">156</span>
            </div>
          </div>

          <Link href="/profile">
            <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white">
              View Profile
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Quick Links</h4>
          <div className="space-y-2">
            <a href="#" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Campus Events</span>
            </a>
            <a href="#" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>Course Registration</span>
            </a>
            <Link href="/connections">
              <a className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
                <Users className="h-4 w-4 mr-2" />
                <span>Study Groups</span>
              </a>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
