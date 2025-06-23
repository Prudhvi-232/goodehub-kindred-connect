
-- Create friends table
CREATE TABLE public.friends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);

-- Create leaderboard/points table
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  points INTEGER DEFAULT 0,
  rank INTEGER,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat rooms table
CREATE TABLE public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  type TEXT CHECK (type IN ('direct', 'group')) DEFAULT 'direct',
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat room participants table
CREATE TABLE public.chat_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, user_id)
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for friends table
CREATE POLICY "Users can view their own friends" ON public.friends
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can insert friend requests" ON public.friends
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update friend status" ON public.friends
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- RLS policies for user_points table
CREATE POLICY "Everyone can view leaderboard" ON public.user_points
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own points" ON public.user_points
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own points" ON public.user_points
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for chat_rooms table
CREATE POLICY "Users can view rooms they participate in" ON public.chat_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants 
      WHERE room_id = public.chat_rooms.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create chat rooms" ON public.chat_rooms
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS policies for chat_participants table
CREATE POLICY "Users can view participants of their rooms" ON public.chat_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants cp 
      WHERE cp.room_id = public.chat_participants.room_id AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join rooms" ON public.chat_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for messages table
CREATE POLICY "Users can view messages in their rooms" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chat_participants 
      WHERE room_id = public.messages.room_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.chat_participants 
      WHERE room_id = public.messages.room_id AND user_id = auth.uid()
    )
  );

-- Insert initial user points for existing users
INSERT INTO public.user_points (user_id, points)
SELECT id, 0 FROM auth.users
ON CONFLICT (user_id) DO NOTHING;

-- Function to update user points ranking
CREATE OR REPLACE FUNCTION update_leaderboard_ranks()
RETURNS void AS $$
BEGIN
  UPDATE public.user_points
  SET rank = ranked.new_rank
  FROM (
    SELECT user_id, ROW_NUMBER() OVER (ORDER BY points DESC) as new_rank
    FROM public.user_points
  ) ranked
  WHERE public.user_points.user_id = ranked.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update ranks when points change
CREATE OR REPLACE FUNCTION trigger_update_ranks()
RETURNS trigger AS $$
BEGIN
  PERFORM update_leaderboard_ranks();
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_ranks_on_points_change
  AFTER INSERT OR UPDATE ON public.user_points
  FOR EACH STATEMENT EXECUTE FUNCTION trigger_update_ranks();
