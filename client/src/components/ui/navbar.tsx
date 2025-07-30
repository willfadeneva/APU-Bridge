import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  GraduationCap, 
  Search, 
  Home, 
  Users, 
  Briefcase, 
  MessageCircle, 
  Bell, 
  ChevronDown,
  User,
  Settings,
  LogOut
} from "lucide-react";

export default function Navbar() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/connections", icon: Users, label: "Network" },
    { path: "/jobs", icon: Briefcase, label: "Jobs" },
    { path: "/messages", icon: MessageCircle, label: "Messages" },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center h-14">
          {/* Logo and Search */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <GraduationCap className="text-white text-sm" />
              </div>
              <span className="text-xl font-bold text-blue-800">UniConnect</span>
            </Link>
            
            <div className="hidden md:block relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text" 
                className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
                placeholder="Search students, alumni, faculty..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link key={path} href={path}>
                <button className={`flex flex-col items-center transition-colors duration-200 ${
                  isActive(path) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                }`}>
                  <Icon className="text-lg" />
                  <span className="text-xs mt-1">{label}</span>
                </button>
              </Link>
            ))}
            
            <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 relative">
              <Bell className="text-lg" />
              <span className="text-xs mt-1">Notifications</span>
              <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center p-0">
                3
              </Badge>
            </button>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-1">
                <img 
                  src={user?.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`}
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-blue-600 transition-colors duration-200"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-800">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <div className="text-xs text-gray-600">
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Student'}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5 text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="px-2 py-1.5 text-xs text-gray-600">
                {user?.email}
              </div>
              <DropdownMenuSeparator />
              
              <Link href="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
              </Link>
              
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => window.location.href = '/api/logout'}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-6 pb-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            type="text" 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link key={path} href={path}>
              <button className={`flex flex-col items-center transition-colors duration-200 ${
                isActive(path) ? 'text-blue-600' : 'text-gray-600'
              }`}>
                <Icon className="text-lg" />
                <span className="text-xs mt-1">{label}</span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
