
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown, Trophy, Medal, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface LeaderboardEntry {
  user_id: string;
  points: number;
  rank: number;
  profile?: {
    full_name: string;
    avatar_url: string;
  };
}

const LeaderboardPage = () => {
  const [overallLeaderboard, setOverallLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaderboards();
  }, [user]);

  const fetchLeaderboards = async () => {
    try {
      // Fetch overall leaderboard
      const { data: overallPointsData, error: overallError } = await supabase
        .from('user_points')
        .select('user_id, points, rank')
        .order('points', { ascending: false })
        .limit(50);

      if (overallError) throw overallError;

      if (overallPointsData && overallPointsData.length > 0) {
        // Get profiles for the users
        const userIds = overallPointsData.map(entry => entry.user_id);
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url')
          .in('id', userIds);

        if (profilesError) throw profilesError;

        const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
        
        const overallData = overallPointsData.map(entry => ({
          ...entry,
          profile: profilesMap.get(entry.user_id)
        }));

        setOverallLeaderboard(overallData);
      }

      // Fetch friends leaderboard
      const { data: friendships, error: friendsError } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', user?.id)
        .eq('status', 'accepted');

      if (friendsError) throw friendsError;

      if (friendships && friendships.length > 0) {
        const friendIds = friendships.map(f => f.friend_id);
        
        // Get points for friends
        const { data: friendsPointsData, error: friendsPointsError } = await supabase
          .from('user_points')
          .select('user_id, points, rank')
          .in('user_id', friendIds)
          .order('points', { ascending: false });

        if (friendsPointsError) throw friendsPointsError;

        if (friendsPointsData && friendsPointsData.length > 0) {
          // Get profiles for friends
          const { data: friendProfiles, error: friendProfilesError } = await supabase
            .from('profiles')
            .select('id, full_name, avatar_url')
            .in('id', friendIds);

          if (friendProfilesError) throw friendProfilesError;

          const friendProfilesMap = new Map(friendProfiles?.map(p => [p.id, p]) || []);
          
          const friendsData = friendsPointsData.map(entry => ({
            ...entry,
            profile: friendProfilesMap.get(entry.user_id)
          }));

          setFriendsLeaderboard(friendsData);
        }
      }
    } catch (error) {
      console.error('Error fetching leaderboards:', error);
      toast({
        title: "Error",
        description: "Failed to load leaderboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <Award className="w-5 h-5 text-blue-500" />;
    }
  };

  const renderLeaderboard = (data: LeaderboardEntry[]) => (
    <div className="space-y-3">
      {data.map((entry, index) => (
        <Card key={entry.user_id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {getRankIcon(entry.rank || index + 1)}
                  <span className="font-bold text-lg">#{entry.rank || index + 1}</span>
                </div>
                <Avatar>
                  <AvatarImage src={entry.profile?.avatar_url} />
                  <AvatarFallback>
                    {entry.profile?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">
                    {entry.profile?.full_name || 'Anonymous User'}
                  </p>
                  <p className="text-sm text-gray-500">{entry.points} points</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{entry.points}</div>
                <div className="text-xs text-gray-500">points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span>Leaderboard</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overall" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="friends">Friends</TabsTrigger>
            </TabsList>
            <TabsContent value="overall" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Top Contributors</h3>
                {overallLeaderboard.length > 0 ? (
                  renderLeaderboard(overallLeaderboard)
                ) : (
                  <p className="text-gray-500 text-center py-8">No data available</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="friends" className="mt-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Friends Rankings</h3>
                {friendsLeaderboard.length > 0 ? (
                  renderLeaderboard(friendsLeaderboard)
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No friends found. Add some friends to see their rankings!
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
