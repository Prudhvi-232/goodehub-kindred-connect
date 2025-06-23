
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, AlertTriangle, Heart, MapPin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  type: 'urgent_help' | 'friend_request' | 'donation' | 'general';
  title: string;
  message: string;
  location?: string;
  urgent: boolean;
  read: boolean;
  created_at: string;
  user_name?: string;
  user_avatar?: string;
}

const NotificationsList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Mock notifications for demonstration
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'urgent_help',
        title: 'Urgent Help Needed',
        message: 'Someone nearby needs immediate assistance with medical emergency',
        location: 'Downtown Area, 2 blocks away',
        urgent: true,
        read: false,
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        user_name: 'Emergency Responder',
        user_avatar: ''
      },
      {
        id: '2',
        type: 'urgent_help',
        title: 'Food Distribution',
        message: 'Food distribution happening now at community center, volunteers needed',
        location: 'Community Center, 1.2 miles',
        urgent: true,
        read: false,
        created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        user_name: 'Food Bank Coordinator',
        user_avatar: ''
      },
      {
        id: '3',
        type: 'friend_request',
        title: 'New Friend Request',
        message: 'John Doe wants to connect with you',
        urgent: false,
        read: false,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user_name: 'John Doe',
        user_avatar: ''
      },
      {
        id: '4',
        type: 'urgent_help',
        title: 'Elderly Assistance',
        message: 'Elderly person needs help with groceries and transportation',
        location: 'Oak Street, 0.8 miles',
        urgent: true,
        read: true,
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        user_name: 'Community Helper',
        user_avatar: ''
      },
      {
        id: '5',
        type: 'donation',
        title: 'Donation Received',
        message: 'Thank you for your donation to the Children\'s Fund',
        urgent: false,
        read: true,
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        user_name: 'Goodhub Team',
        user_avatar: ''
      }
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  }, [user]);

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getNotificationIcon = (type: string, urgent: boolean) => {
    switch (type) {
      case 'urgent_help':
        return urgent ? (
          <AlertTriangle className="w-5 h-5 text-red-500" />
        ) : (
          <Heart className="w-5 h-5 text-blue-500" />
        );
      case 'friend_request':
        return <Bell className="w-5 h-5 text-green-500" />;
      case 'donation':
        return <Heart className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const urgentNotifications = notifications.filter(n => n.urgent && !n.read);
  const regularNotifications = notifications.filter(n => !n.urgent);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {urgentNotifications.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="w-6 h-6" />
              <span>Urgent Notifications ({urgentNotifications.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {urgentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-red-200 cursor-pointer hover:bg-red-50 transition-colors"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type, notification.urgent)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-red-800 truncate">{notification.title}</h4>
                        <div className="flex items-center space-x-2">
                          {notification.urgent && (
                            <Badge variant="destructive" className="text-xs">URGENT</Badge>
                          )}
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {getTimeAgo(notification.created_at)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                      {notification.location && (
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          <MapPin className="w-3 h-3" />
                          <span>{notification.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bell className="w-6 h-6" />
            <span>All Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {regularNotifications.length > 0 ? (
                regularNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      notification.read 
                        ? 'bg-gray-50 hover:bg-gray-100' 
                        : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={notification.user_avatar} />
                      <AvatarFallback className="text-xs">
                        {notification.user_name?.charAt(0) || 'N'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium truncate ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {getTimeAgo(notification.created_at)}
                        </span>
                      </div>
                      <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      {notification.location && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          <span>{notification.location}</span>
                        </div>
                      )}
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No notifications yet</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsList;
