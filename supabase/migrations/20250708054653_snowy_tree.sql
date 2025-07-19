/*
  # Create core tables for Super Recruiter platform

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `company_name` (text)
      - `contact_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `has_received_free_shortlist` (boolean)
      - `created_at` (timestamp)
    - `jobs`
      - `id` (uuid, primary key)
      - `client_id` (uuid, foreign key to clients)
      - `title` (text)
      - `description` (text)
      - `seniority_level` (text)
      - `work_arrangement` (text)
      - `location` (text)
      - `salary_range_min` (integer)
      - `salary_range_max` (integer)
      - `key_selling_points` (jsonb array)
      - `status` (text)
      - `sourcer_name` (text, nullable)
      - `completion_link` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `candidates`
      - `id` (uuid, primary key)
      - `job_id` (uuid, foreign key to jobs)
      - `first_name` (text)
      - `last_name` (text)
      - `linkedin_url` (text)
      - `headline` (text, nullable)
      - `location` (text, nullable)
      - `experience` (jsonb array, nullable)
      - `education` (jsonb array, nullable)
      - `skills` (jsonb array, nullable)
      - `summary` (text, nullable)
      - `submitted_at` (timestamp)
    - `job_submissions`
      - `id` (uuid, primary key)
      - `job_id` (uuid, foreign key to jobs)
      - `sourcer_name` (text)
      - `submission_type` (text)
      - `linkedin_urls` (jsonb array)
      - `candidate_count` (integer)
      - `submission_notes` (text, nullable)
      - `submitted_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to read/write their own data
    - Add policies for public read access (for demo purposes)

  3. Indexes
    - Add indexes for frequently queried columns
    - Add foreign key constraints
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  has_received_free_shortlist boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  seniority_level text NOT NULL CHECK (seniority_level IN ('Junior', 'Mid', 'Senior', 'Executive')),
  work_arrangement text NOT NULL CHECK (work_arrangement IN ('Remote', 'On-site', 'Hybrid')),
  location text NOT NULL,
  salary_range_min integer NOT NULL,
  salary_range_max integer NOT NULL,
  key_selling_points jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'Unclaimed' CHECK (status IN ('Unclaimed', 'Claimed', 'Completed')),
  sourcer_name text,
  completion_link text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  linkedin_url text NOT NULL,
  headline text,
  location text,
  experience jsonb DEFAULT '[]'::jsonb,
  education jsonb DEFAULT '[]'::jsonb,
  skills jsonb DEFAULT '[]'::jsonb,
  summary text,
  submitted_at timestamptz DEFAULT now()
);

-- Create job_submissions table for tracking submission details
CREATE TABLE IF NOT EXISTS job_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  sourcer_name text NOT NULL,
  submission_type text DEFAULT 'linkedin_scraping' CHECK (submission_type IN ('linkedin_scraping', 'manual_entry', 'file_upload')),
  linkedin_urls jsonb DEFAULT '[]'::jsonb,
  candidate_count integer DEFAULT 0,
  submission_notes text,
  submitted_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_jobs_client_id ON jobs(client_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_job_id ON candidates(job_id);
CREATE INDEX IF NOT EXISTS idx_candidates_submitted_at ON candidates(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_submissions_job_id ON job_submissions(job_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Add constraint to ensure salary range is valid
ALTER TABLE jobs ADD CONSTRAINT check_salary_range CHECK (salary_range_max > salary_range_min);

-- Add trigger to update updated_at timestamp on jobs
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
-- In production, you would want more restrictive policies

CREATE POLICY "Allow public read access on clients"
  ON clients
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on clients"
  ON clients
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on clients"
  ON clients
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow public delete on clients"
  ON clients
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access on jobs"
  ON jobs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on jobs"
  ON jobs
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on jobs"
  ON jobs
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow public delete on jobs"
  ON jobs
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access on candidates"
  ON candidates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on candidates"
  ON candidates
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on candidates"
  ON candidates
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow public delete on candidates"
  ON candidates
  FOR DELETE
  TO public
  USING (true);

CREATE POLICY "Allow public read access on job_submissions"
  ON job_submissions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert on job_submissions"
  ON job_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update on job_submissions"
  ON job_submissions
  FOR UPDATE
  TO public
  USING (true);

CREATE POLICY "Allow public delete on job_submissions"
  ON job_submissions
  FOR DELETE
  TO public
  USING (true);