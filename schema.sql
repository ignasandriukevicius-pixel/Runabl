-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('COACH', 'ATHLETE')),
  full_name TEXT
);

-- Create athletes table (links athletes to their coach)
CREATE TABLE athletes (
  coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  PRIMARY KEY (coach_id, athlete_id)
);

-- Create workouts_planned table
CREATE TABLE workouts_planned (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  workout_type TEXT NOT NULL CHECK (workout_type IN ('easy', 'intervals', 'long run')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create workouts_completed table
CREATE TABLE workouts_completed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  rpe INTEGER CHECK (rpe >= 1 AND rpe <= 10),
  notes TEXT,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(athlete_id, date)
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts_planned ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts_completed ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Athletes policies
CREATE POLICY "Coaches can see their own athletes" ON athletes
  FOR SELECT USING (auth.uid() = coach_id);

CREATE POLICY "Athletes can see their own coach mapping" ON athletes
  FOR SELECT USING (auth.uid() = athlete_id);

CREATE POLICY "Coaches can add athletes" ON athletes
  FOR INSERT WITH CHECK (auth.uid() = coach_id);

-- Workouts Planned policies
CREATE POLICY "Coaches can manage their athletes' planned workouts" ON workouts_planned
  FOR ALL USING (auth.uid() = coach_id);

CREATE POLICY "Athletes can view their own planned workouts" ON workouts_planned
  FOR SELECT USING (auth.uid() = athlete_id);

-- Workouts Completed policies
CREATE POLICY "Athletes can manage their own completed workouts" ON workouts_completed
  FOR ALL USING (auth.uid() = athlete_id);

CREATE POLICY "Coaches can view their athletes' completed workouts" ON workouts_completed
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM athletes 
      WHERE athletes.coach_id = auth.uid() 
      AND athletes.athlete_id = workouts_completed.athlete_id
    )
  );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'role', 'ATHLETE'), new.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
