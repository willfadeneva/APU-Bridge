import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  Users, 
  Briefcase, 
  MessageCircle, 
  Check
} from "lucide-react";

export default function NotificationsDropdown() {
  const [notifications] = useState([
    {
      id: 1,
      type: 'connection',
      title: 'New connection request',
      message: 'Alice Johnson wants to connect with you',
      time: '2 hours ago',
      unread: true,
      icon: Users
    },
    {
      id: 2,
      type: 'job',
      title: 'Job opportunity',
      message: 'New Software Engineer position at Tech Corp',
      time: '4 hours ago',
      unread: true,
      icon: Briefcase
    },
    {
      id: 3,
      type: 'message',
      title: 'New message',
      message: 'John Doe sent you a message',
      time: '1 day ago',
      unread: false,
      icon: MessageCircle
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 relative p-2 rounded-md hover:bg-gray-50">
          <Bell className="text-lg" />
          <span className="text-xs mt-1">Notifications</span>
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0 border-2 border-white">
              {unreadCount}
            </Badge>
          )}
        </button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </button>
            )}
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      notification.unread ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      // Handle notification click based on type
                      if (notification.type === 'connection') {
                        window.location.href = '/connections';
                      } else if (notification.type === 'job') {
                        window.location.href = '/jobs';
                      } else if (notification.type === 'message') {
                        window.location.href = '/messages';
                      }
                    }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        notification.unread ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium truncate ${
                            notification.unread ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No notifications yet</p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-4 py-3">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all notifications
              </button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}