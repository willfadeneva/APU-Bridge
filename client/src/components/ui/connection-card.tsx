import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, UserPlus, Users } from "lucide-react";
import type { User } from "@shared/schema";

interface ConnectionCardProps {
  user: User;
  isConnected: boolean;
  onConnect?: () => void;
  onMessage?: () => void;
  isConnecting?: boolean;
}

export default function ConnectionCard({ 
  user, 
  isConnected, 
  onConnect, 
  onMessage,
  isConnecting = false 
}: ConnectionCardProps) {
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
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`}
            alt={`${user.firstName} ${user.lastName}`}
            className="w-20 h-20 rounded-full object-cover mb-4"
          />
          
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 mb-1">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{user.title || 'University Student'}</p>
            
            <div className="flex flex-col items-center space-y-1">
              <Badge className={getUserRoleBadge(user.role || 'student')}>
                {user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || 'Student'}
              </Badge>
              
              {user.university && (
                <p className="text-xs text-gray-500">{user.university}</p>
              )}
              
              {user.graduationYear && (
                <p className="text-xs text-gray-500">Class of {user.graduationYear}</p>
              )}
            </div>
          </div>

          {user.skills && user.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap justify-center gap-1">
                {user.skills.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {user.skills.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{user.skills.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-2 w-full">
            {isConnected ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={onMessage}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Connected
                </Button>
              </>
            ) : (
              <Button
                onClick={onConnect}
                disabled={isConnecting}
                size="sm"
                className="flex-1 text-white"
                style={{backgroundColor: '#aa003e'}}
                onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#880032'}
                onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = '#aa003e'}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                {isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
