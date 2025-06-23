
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, Check, X, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Friend {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
  status: 'pending' | 'accepted' | 'blocked';
  friend_id: string;
  user_id: string;
}

interface User {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
}

const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Friend[]>([]);
  const [searchUsers, setSearchUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchFriends();
    fetchPendingRequests();
  }, [user]);

  const fetchFriends = async () => {
    try {
      // Get accepted friends where current user is the requester
      const { data: friendsAsRequester } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user?.id)
        .eq('status', 'accepted');

      // Get accepted friends where current user is the receiver
      const { data: friendsAsReceiver } = await supabase
        .from('friends')
        .select('user_id')
        .eq('friend_id', user?.id)
        .eq('status', 'accepted');

      const friendIds = [
        ...(friendsAsRequester?.map(f => f.friend_id) || []),
        ...(friendsAsReceiver?.map(f => f.user_id) || [])
      ];

      if (friendIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, email')
          .in('id', friendIds);

        const friendsList = profiles?.map(profile => ({
          id: profile.id,
          full_name: profile.full_name || 'Anonymous',
          avatar_url: profile.avatar_url || '',
          email: profile.email || '',
          status: 'accepted' as const,
          friend_id: profile.id,
          user_id: user?.id || ''
        })) || [];

        setFriends(friendsList);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      // Get pending requests sent to current user
      const { data: pendingData } = await supabase
        .from('friends')
        .select('user_id')
        .eq('friend_id', user?.id)
        .eq('status', 'pending');

      if (pendingData && pendingData.length > 0) {
        const senderIds = pendingData.map(p => p.user_id);
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, email')
          .in('id', senderIds);

        const pendingList = profiles?.map(profile => ({
          id: profile.id,
          full_name: profile.full_name || 'Anonymous',
          avatar_url: profile.avatar_url || '',
          email: profile.email || '',
          status: 'pending' as const,
          friend_id: user?.id || '',
          user_id: profile.id
        })) || [];

        setPendingRequests(pendingList);
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  const searchForUsers = async () => {
    if (!searchTerm.trim()) {
      setSearchUsers([]);
      return;
    }

    try {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, email')
        .neq('id', user?.id)
        .ilike('full_name', `%${searchTerm}%`)
        .limit(10);

      setSearchUsers(profiles || []);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const sendFriendRequest = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .insert({
          user_id: user?.id,
          friend_id: friendId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Friend request sent",
        description: "Your friend request has been sent successfully.",
      });

      // Remove from search results
      setSearchUsers(prev => prev.filter(u => u.id !== friendId));
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive",
      });
    }
  };

  const acceptFriendRequest = async (requesterId: string) => {
    try {
      // Update the existing request
      const { error: updateError } = await supabase
        .from('friends')
        .update({ status: 'accepted' })
        .eq('user_id', requesterId)
        .eq('friend_id', user?.id);

      if (updateError) throw updateError;

      // Create mutual friendship
      const { error: insertError } = await supabase
        .from('friends')
        .insert({
          user_id: user?.id,
          friend_id: requesterId,
          status: 'accepted'
        });

      if (insertError) throw insertError;

      toast({
        title: "Friend request accepted",
        description: "You are now friends!",
      });

      fetchFriends();
      fetchPendingRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive",
      });
    }
  };

  const rejectFriendRequest = async (requesterId: string) => {
    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('user_id', requesterId)
        .eq('friend_id', user?.id);

      if (error) throw error;

      toast({
        title: "Friend request rejected",
        description: "Friend request has been rejected.",
      });

      fetchPendingRequests();
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to reject friend request",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading friends...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <span>Friends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="friends" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="friends">My Friends ({friends.length})</TabsTrigger>
              <TabsTrigger value="requests">Requests ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="search">Add Friends</TabsTrigger>
            </TabsList>
            
            <TabsContent value="friends" className="mt-6">
              <div className="space-y-4">
                {friends.length > 0 ? (
                  friends.map((friend) => (
                    <div key={friend.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Avatar>
                        <AvatarImage src={friend.avatar_url} />
                        <AvatarFallback>{friend.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{friend.full_name}</p>
                        <p className="text-sm text-gray-500">{friend.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No friends yet. Add some friends to get started!</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="requests" className="mt-6">
              <div className="space-y-4">
                {pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={request.avatar_url} />
                          <AvatarFallback>{request.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{request.full_name}</p>
                          <p className="text-sm text-gray-500">wants to be your friend</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => acceptFriendRequest(request.user_id)}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => rejectFriendRequest(request.user_id)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No pending friend requests</p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="search" className="mt-6">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search for users by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchForUsers()}
                  />
                  <Button onClick={searchForUsers}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {searchUsers.map((searchUser) => (
                    <div key={searchUser.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={searchUser.avatar_url} />
                          <AvatarFallback>{searchUser.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{searchUser.full_name}</p>
                          <p className="text-sm text-gray-500">{searchUser.email}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => sendFriendRequest(searchUser.id)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Friend
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FriendsList;
