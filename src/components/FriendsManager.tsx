
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users, UserPlus, Search, Check, X, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Friend {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  friend_name: string;
  friend_avatar?: string;
  location?: string;
  mutual_friends: number;
  created_at: string;
}

interface User {
  id: string;
  full_name: string;
  avatar_url?: string;
  location?: string;
  mutual_friends: number;
}

const FriendsManager = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'search'>('friends');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadFriends();
    loadPendingRequests();
  }, [user]);

  const loadFriends = () => {
    // Mock friends data
    const mockFriends: Friend[] = [
      {
        id: '1',
        user_id: user?.id || '',
        friend_id: '2',
        status: 'accepted',
        friend_name: 'Sarah Chen',
        location: 'Downtown',
        mutual_friends: 5,
        created_at: '2024-01-15'
      },
      {
        id: '2',
        user_id: user?.id || '',
        friend_id: '3',
        status: 'accepted',
        friend_name: 'Mike Johnson',
        location: 'Uptown',
        mutual_friends: 3,
        created_at: '2024-01-10'
      }
    ];
    setFriends(mockFriends);
  };

  const loadPendingRequests = () => {
    // Mock pending requests
    const mockRequests: Friend[] = [
      {
        id: '3',
        user_id: '4',
        friend_id: user?.id || '',
        status: 'pending',
        friend_name: 'Emma Wilson',
        location: 'City Center',
        mutual_friends: 2,
        created_at: '2024-01-20'
      }
    ];
    setPendingRequests(mockRequests);
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    
    try {
      // Mock search results
      const mockUsers: User[] = [
        {
          id: '5',
          full_name: 'David Kim',
          location: 'Oak Street',
          mutual_friends: 1
        },
        {
          id: '6',
          full_name: 'Lisa Park',
          location: 'Pine Avenue',
          mutual_friends: 0
        }
      ];
      
      const filtered = mockUsers.filter(u => 
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      // TODO: Implement actual friend request with Supabase
      console.log('Sending friend request to:', userId);
      
      toast({
        title: "Friend Request Sent!",
        description: "Your friend request has been sent successfully.",
      });
      
      // Remove from search results
      setSearchResults(prev => prev.filter(u => u.id !== userId));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send friend request.",
        variant: "destructive",
      });
    }
  };

  const respondToRequest = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      // TODO: Implement actual response with Supabase
      console.log('Responding to request:', requestId, action);
      
      if (action === 'accept') {
        // Move from pending to friends
        const request = pendingRequests.find(r => r.id === requestId);
        if (request) {
          setFriends(prev => [...prev, { ...request, status: 'accepted' }]);
        }
        
        toast({
          title: "Friend Request Accepted!",
          description: "You are now friends!",
        });
      } else {
        toast({
          title: "Friend Request Rejected",
          description: "The friend request has been declined.",
        });
      }
      
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to respond to friend request.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>Friends & Connections</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            {['friends', 'requests', 'search'].map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab as any)}
                className="capitalize"
              >
                {tab === 'friends' && `Friends (${friends.length})`}
                {tab === 'requests' && `Requests (${pendingRequests.length})`}
                {tab === 'search' && 'Find Friends'}
              </Button>
            ))}
          </div>

          {activeTab === 'friends' && (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <div key={friend.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {friend.friend_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{friend.friend_name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            {friend.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{friend.location}</span>
                              </div>
                            )}
                            <span>• {friend.mutual_friends} mutual friends</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">Friends</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No friends yet. Start connecting!</p>
                )}
              </div>
            </ScrollArea>
          )}

          {activeTab === 'requests' && (
            <ScrollArea className="h-96">
              <div className="space-y-3">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {request.friend_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{request.friend_name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            {request.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{request.location}</span>
                              </div>
                            )}
                            <span>• {request.mutual_friends} mutual friends</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => respondToRequest(request.id, 'accept')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => respondToRequest(request.id, 'reject')}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No pending requests</p>
                )}
              </div>
            </ScrollArea>
          )}

          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search for people to connect with..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                    className="pl-10"
                  />
                </div>
                <Button onClick={searchUsers} disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>

              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {searchResults.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {user.full_name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.full_name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            {user.location && (
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{user.location}</span>
                              </div>
                            )}
                            <span>• {user.mutual_friends} mutual friends</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => sendFriendRequest(user.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Friend
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsManager;
