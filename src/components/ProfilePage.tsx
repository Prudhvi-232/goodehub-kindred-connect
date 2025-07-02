
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Edit, Save, X, MapPin, Phone, Calendar, Briefcase } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  bio: string;
  location: string;
  phone: string;
  date_of_birth: string;
  occupation: string;
  created_at: string;
  updated_at: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      // Ensure all required fields exist with default values
      const profileData: UserProfile = {
        id: data.id,
        full_name: data.full_name || '',
        email: data.email || '',
        avatar_url: data.avatar_url || '',
        bio: data.bio || '',
        location: data.location || '',
        phone: data.phone || '',
        date_of_birth: data.date_of_birth || '',
        occupation: data.occupation || '',
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setProfile(profileData);
      setEditedProfile(profileData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setEditedProfile(profile);
  };

  const handleCancel = () => {
    setEditing(false);
    setEditedProfile(profile);
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editedProfile.full_name,
          bio: editedProfile.bio,
          location: editedProfile.location,
          phone: editedProfile.phone,
          date_of_birth: editedProfile.date_of_birth,
          occupation: editedProfile.occupation,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (error) throw error;

      setProfile(editedProfile);
      setEditing(false);
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

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile({
        ...editedProfile,
        [field]: value
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

  const currentProfile = editing ? editedProfile : profile;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="w-6 h-6" />
              <span>My Profile</span>
            </CardTitle>
            {!editing ? (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={currentProfile?.avatar_url} />
                <AvatarFallback className="text-2xl">
                  {currentProfile?.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                {editing ? (
                  <Input
                    value={editedProfile?.full_name || ''}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Full Name"
                    className="text-xl font-bold mb-2"
                  />
                ) : (
                  <h2 className="text-2xl font-bold">{currentProfile?.full_name}</h2>
                )}
                <p className="text-gray-600">{currentProfile?.email}</p>
                <Badge variant="secondary" className="mt-2">
                  Member since {new Date(currentProfile?.created_at || '').toLocaleDateString()}
                </Badge>
              </div>
            </div>

            {/* Bio Section */}
            <div>
              <h3 className="font-semibold mb-2">About Me</h3>
              {editing ? (
                <Textarea
                  value={editedProfile?.bio || ''}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              ) : (
                <p className="text-gray-700">{currentProfile?.bio || 'No bio added yet.'}</p>
              )}
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Location
                </h3>
                {editing ? (
                  <Input
                    value={editedProfile?.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Your location"
                  />
                ) : (
                  <p className="text-gray-700">{currentProfile?.location || 'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone
                </h3>
                {editing ? (
                  <Input
                    value={editedProfile?.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Your phone number"
                  />
                ) : (
                  <p className="text-gray-700">{currentProfile?.phone || 'Not specified'}</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Date of Birth
                </h3>
                {editing ? (
                  <Input
                    type="date"
                    value={editedProfile?.date_of_birth || ''}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-700">
                    {currentProfile?.date_of_birth 
                      ? new Date(currentProfile.date_of_birth).toLocaleDateString()
                      : 'Not specified'
                    }
                  </p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Occupation
                </h3>
                {editing ? (
                  <Input
                    value={editedProfile?.occupation || ''}
                    onChange={(e) => handleInputChange('occupation', e.target.value)}
                    placeholder="Your occupation"
                  />
                ) : (
                  <p className="text-gray-700">{currentProfile?.occupation || 'Not specified'}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
