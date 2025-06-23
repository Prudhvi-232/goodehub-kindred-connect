
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Edit, Save, Trophy, Users, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
}

interface UserStats {
  points: number;
  rank: number;
  friendsCount: number;
  messagesCount: number;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats>({
    points: 0,
    rank: 0,
    friendsCount: 0,
    messagesCount: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    full_name: "",
    avatar_url: ""
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setEditData({
        full_name: data.full_name || "",
        avatar_url: data.avatar_url || ""
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch points and rank
      const { data: pointsData } = await supabase
        .from('user_points')
        .select('points, rank')
        .eq('user_id', user?.id)
        .single();

      // Fetch friends count
      const { count: friendsCount } = await supabase
        .from('friends')
        .select('*', { count: 'exact' })
        .eq('user_id', user?.id)
        .eq('status', 'accepted');

      // Fetch messages count
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact' })
        .eq('sender_id', user?.id);

      setStats({
        points: pointsData?.points || 0,
        rank: pointsData?.rank || 0,
        friendsCount: friendsCount || 0,
        messagesCount: messagesCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editData.full_name,
          avatar_url: editData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      setProfile(prev => prev ? {
        ...prev,
        full_name: editData.full_name,
        avatar_url: editData.avatar_url
      } : null);

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-6 h-6" />
              <span>My Profile</span>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="text-2xl">
                {profile?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={editData.full_name}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        full_name: e.target.value
                      }))}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avatar_url">Avatar URL</Label>
                    <Input
                      id="avatar_url"
                      value={editData.avatar_url}
                      onChange={(e) => setEditData(prev => ({
                        ...prev,
                        avatar_url: e.target.value
                      }))}
                      placeholder="Enter avatar image URL"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">{profile?.full_name || 'Anonymous User'}</h2>
                  <p className="text-gray-600">{profile?.email}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Member since {new Date(user?.created_at || '').toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">{stats.points}</div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-600">#{stats.rank || 'N/A'}</div>
              <div className="text-sm text-gray-600">Rank</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{stats.friendsCount}</div>
              <div className="text-sm text-gray-600">Friends</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <MessageSquare className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">{stats.messagesCount}</div>
              <div className="text-sm text-gray-600">Messages</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
