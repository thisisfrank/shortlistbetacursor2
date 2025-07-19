/*
  # Simple Super Recruiter Database Setup

  1. New Tables
    - `user_profiles` - User roles (client, sourcer, admin)
    - `clients` - Client company information
    - `jobs` - Job postings and requirements
    - `candidates` - Candidate profiles and data
    - `credit_transactions` - Credit usage tracking

  2. Security
    - Enable RLS on all tables
    - Basic policies for authenticated users
*/

-- User profiles for role management
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'sourcer', 'admin')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  available_credits integer DEFAULT 20,
  jobs_remaining integer DEFAULT 1,
  credits_reset_date timestamptz DEFAULT (now() + interval '30 days'),
  has_received_free_shortlist boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  seniority_level text NOT NULL,
  work_arrangement text NOT NULL,
  location text NOT NULL,
  salary_range_min integer NOT NULL,
  salary_range_max integer NOT NULL,
  key_selling_points text[] DEFAULT '{}',
  status text DEFAULT 'Unclaimed' CHECK (status IN ('Unclaimed', 'Claimed', 'Completed')),
  sourcer_name text,
  completion_link text,
  candidates_requested integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  linkedin_url text NOT NULL,
  headline text,
  location text,
  experience jsonb,
  education jsonb,
  skills text[],
  summary text,
  submitted_at timestamptz DEFAULT now()
);

-- Credit transactions table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  job_id uuid REFERENCES jobs(id) ON DELETE SET NULL,
  credits_used integer NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('job_submission', 'candidate_request', 'credit_refill')),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Clients can read own data"
  ON clients
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all clients"
  ON clients
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Jobs are readable by authenticated users"
  ON jobs
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clients can insert own jobs"
  ON jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM clients 
      WHERE id = client_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Sourcers and admins can update jobs"
  ON jobs
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('sourcer', 'admin')
    )
  );

CREATE POLICY "Candidates are readable by authenticated users"
  ON candidates
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Sourcers can insert candidates"
  ON candidates
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role IN ('sourcer', 'admin')
    )
  );

CREATE POLICY "Credit transactions are readable by owners and admins"
  ON credit_transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clients 
      WHERE id = client_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to automatically create user profile
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- Determine role based on email
  DECLARE
    user_role text := 'client';
  BEGIN
    IF NEW.email = 'thisisfrankgonzalez@gmail.com' THEN
      user_role := 'admin';
    ELSIF NEW.email = 'thisisjasongonzalez@gmail.com' THEN
      user_role := 'sourcer';
    END IF;
    
    INSERT INTO user_profiles (id, email, role)
    VALUES (NEW.id, NEW.email, user_role);
    
    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();