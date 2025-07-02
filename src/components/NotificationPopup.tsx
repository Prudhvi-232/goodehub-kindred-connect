
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, X, AlertTriangle, Heart, Users } from 'lucide-react';

interface Notification {
  id: string;
  type: 'urgent_help' | 'friend_request' | 'general';
  title: string;
  message: string;
  urgent: boolean;
  read: boolean;
  created_at: string;
}

const NotificationPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Mock notifications for demo
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'urgent_help',
        title: 'Urgent Help Needed',
        message: 'Someone nearby needs immediate assistance',
        urgent: true,
        read: false,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        type: 'friend_request',
        title: 'New Friend Request',
        message: 'John Doe wants to connect with you',
        urgent: false,
        read: false,
        created_at: new Date().toISOString()
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const getIcon = (type: string, urgent: boolean) => {
    if (urgent) return <AlertTriangle className="w-4 h-4 text-red-500" />;
    switch (type) {
      case 'friend_request': return <Users className="w-4 h-4 text-blue-500" />;
      default: return <Heart className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          size="sm"
          className="relative bg-white shadow-lg hover:bg-gray-50"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>

        {isOpen && (
          <Card className="absolute top-12 right-0 w-80 max-h-96 shadow-xl border bg-white z-50">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <ScrollArea className="max-h-80">
              <div className="p-2">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                        notification.read 
                          ? 'bg-gray-50 hover:bg-gray-100' 
                          : 'bg-blue-50 hover:bg-blue-100 border border-blue-200'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type, notification.urgent)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-sm font-medium truncate ${
                              notification.read ? 'text-gray-700' : 'text-gray-900'
                            }`}>
                              {notification.title}
                            </h4>
                            {notification.urgent && (
                              <Badge variant="destructive" className="text-xs ml-2">
                                URGENT
                              </Badge>
                            )}
                          </div>
                          <p className={`text-xs ${
                            notification.read ? 'text-gray-600' : 'text-gray-700'
                          }`}>
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8 text-sm">No notifications yet</p>
                )}
              </div>
            </ScrollArea>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
