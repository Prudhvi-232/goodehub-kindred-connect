
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Friend {
  id: string;
  full_name: string;
  avatar_url: string;
  user_id: string;
}

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender_name?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  friend: Friend;
}

const ChatPage = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeChat, setActiveChat] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchFriends();
  }, [user]);

  useEffect(() => {
    if (activeChat) {
      fetchMessages();
      subscribeToMessages();
    }
  }, [activeChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .select(`
          friend_id,
          profiles!friends_friend_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('user_id', user?.id)
        .eq('status', 'accepted');

      if (error) throw error;

      const friendsList = data?.map(friend => ({
        id: friend.profiles.id,
        full_name: friend.profiles.full_name || 'Anonymous',
        avatar_url: friend.profiles.avatar_url || '',
        user_id: friend.friend_id
      })) || [];

      setFriends(friendsList);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast({
        title: "Error",
        description: "Failed to load friends",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrGetChatRoom = async (friendId: string) => {
    try {
      // Check if chat room already exists
      const { data: existingRoom, error: roomError } = await supabase
        .from('chat_participants')
        .select(`
          room_id,
          chat_rooms(id, name)
        `)
        .eq('user_id', user?.id);

      if (roomError) throw roomError;

      // Find existing room with this friend
      let roomId = null;
      for (const participant of existingRoom || []) {
        const { data: otherParticipants } = await supabase
          .from('chat_participants')
          .select('user_id')
          .eq('room_id', participant.room_id)
          .neq('user_id', user?.id);

        if (otherParticipants?.some(p => p.user_id === friendId)) {
          roomId = participant.room_id;
          break;
        }
      }

      // Create new room if doesn't exist
      if (!roomId) {
        const { data: newRoom, error: createError } = await supabase
          .from('chat_rooms')
          .insert({
            type: 'direct',
            created_by: user?.id
          })
          .select()
          .single();

        if (createError) throw createError;
        roomId = newRoom.id;

        // Add participants
        await supabase.from('chat_participants').insert([
          { room_id: roomId, user_id: user?.id },
          { room_id: roomId, user_id: friendId }
        ]);
      }

      return roomId;
    } catch (error) {
      console.error('Error creating/getting chat room:', error);
      throw error;
    }
  };

  const startChat = async (friend: Friend) => {
    try {
      const roomId = await createOrGetChatRoom(friend.user_id);
      setActiveChat({
        id: roomId,
        name: friend.full_name,
        friend
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive",
      });
    }
  };

  const fetchMessages = async () => {
    if (!activeChat) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          sender_id,
          created_at,
          profiles!messages_sender_id_fkey(full_name)
        `)
        .eq('room_id', activeChat.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const messagesWithSender = data?.map(msg => ({
        ...msg,
        sender_name: msg.profiles?.full_name || 'Anonymous'
      })) || [];

      setMessages(messagesWithSender);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = () => {
    if (!activeChat) return;

    const channel = supabase
      .channel(`messages:${activeChat.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${activeChat.id}`
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          room_id: activeChat.id,
          sender_id: user?.id,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading chats...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[600px]">
      {/* Friends List */}
      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Friends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {friends.length > 0 ? (
                friends.map((friend) => (
                  <div
                    key={friend.id}
                    onClick={() => startChat(friend)}
                    className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                      activeChat?.friend.id === friend.id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <Avatar>
                      <AvatarImage src={friend.avatar_url} />
                      <AvatarFallback>{friend.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{friend.full_name}</p>
                      <p className="text-sm text-gray-500">Click to chat</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No friends yet. Add some friends to start chatting!
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="md:col-span-8">
        {activeChat ? (
          <>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Chat with {activeChat.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} size="sm">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a friend to start chatting</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ChatPage;
