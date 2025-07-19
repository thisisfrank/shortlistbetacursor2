-- Proper RLS Policies for Super Recruiter Platform
-- This migration implements role-based access control for all tables

-- Drop existing public policies to replace with proper RLS
DROP POLICY IF EXISTS "Allow public read access on clients" ON clients;
DROP POLICY IF EXISTS "Allow public insert on clients" ON clients;
DROP POLICY IF EXISTS "Allow public update on clients" ON clients;
DROP POLICY IF EXISTS "Allow public delete on clients" ON clients;

DROP POLICY IF EXISTS "Allow public read access on jobs" ON jobs;
DROP POLICY IF EXISTS "Allow public insert on jobs" ON jobs;
DROP POLICY IF EXISTS "Allow public update on jobs" ON jobs;
DROP POLICY IF EXISTS "Allow public delete on jobs" ON jobs;

DROP POLICY IF EXISTS "Allow public read access on candidates" ON candidates;
DROP POLICY IF EXISTS "Allow public insert on candidates" ON candidates;
DROP POLICY IF EXISTS "Allow public update on candidates" ON candidates;
DROP POLICY IF EXISTS "Allow public delete on candidates" ON candidates;

DROP POLICY IF EXISTS "Allow public read access on job_submissions" ON job_submissions;
DROP POLICY IF EXISTS "Allow public insert on job_submissions" ON job_submissions;
DROP POLICY IF EXISTS "Allow public update on job_submissions" ON job_submissions;
DROP POLICY IF EXISTS "Allow public delete on job_submissions" ON job_submissions;

-- ============================================================================
-- CLIENTS TABLE POLICIES
-- ============================================================================

-- Clients can read their own client record
CREATE POLICY "Clients can read own client record" ON clients
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'client' AND email = clients.email
    )
  );

-- Clients can insert their own client record
CREATE POLICY "Clients can insert own client record" ON clients
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'client' AND email = clients.email
    )
  );

-- Clients can update their own client record
CREATE POLICY "Clients can update own client record" ON clients
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'client' AND email = clients.email
    )
  );

-- Admins can read all client records
CREATE POLICY "Admins can read all client records" ON clients
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'admin'
    )
  );

-- Admins can update all client records
CREATE POLICY "Admins can update all client records" ON clients
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'admin'
    )
  );

-- ============================================================================
-- JOBS TABLE POLICIES
-- ============================================================================

-- Clients can read jobs they created
CREATE POLICY "Clients can read own jobs" ON jobs
  FOR SELECT USING (
    client_id IN (
      SELECT id FROM clients 
      WHERE email IN (
        SELECT email FROM user_profiles 
        WHERE id = auth.uid() AND role = 'client'
      )
    )
  );

-- Clients can insert jobs for themselves
CREATE POLICY "Clients can insert own jobs" ON jobs
  FOR INSERT WITH CHECK (
    client_id IN (
      SELECT id FROM clients 
      WHERE email IN (
        SELECT email FROM user_profiles 
        WHERE id = auth.uid() AND role = 'client'
      )
    )
  );

-- Clients can update their own jobs
CREATE POLICY "Clients can update own jobs" ON jobs
  FOR UPDATE USING (
    client_id IN (
      SELECT id FROM clients 
      WHERE email IN (
        SELECT email FROM user_profiles 
        WHERE id = auth.uid() AND role = 'client'
      )
    )
  );

-- Sourcers can read unclaimed jobs and jobs they claimed
CREATE POLICY "Sourcers can read available jobs" ON jobs
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'sourcer'
    ) AND (
      status = 'Unclaimed' OR 
      sourcer_name IN (
        SELECT email FROM user_profiles 
        WHERE id = auth.uid() AND role = 'sourcer'
      )
    )
  );

-- Sourcers can update jobs they claimed
CREATE POLICY "Sourcers can update claimed jobs" ON jobs
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'sourcer'
    ) AND sourcer_name IN (
      SELECT email FROM user_profiles 
      WHERE id = auth.uid() AND role = 'sourcer'
    )
  );

-- Admins can read all jobs
CREATE POLICY "Admins can read all jobs" ON jobs
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'admin'
    )
  );

-- Admins can update all jobs
CREATE POLICY "Admins can update all jobs" ON jobs
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'admin'
    )
  );

-- ============================================================================
-- CANDIDATES TABLE POLICIES
-- ============================================================================

-- Clients can read candidates for their jobs
CREATE POLICY "Clients can read candidates for own jobs" ON candidates
  FOR SELECT USING (
    job_id IN (
      SELECT id FROM jobs 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE email IN (
          SELECT email FROM user_profiles 
          WHERE id = auth.uid() AND role = 'client'
        )
      )
    )
  );

-- Sourcers can read candidates for jobs they claimed
CREATE POLICY "Sourcers can read candidates for claimed jobs" ON candidates
  FOR SELECT USING (
    job_id IN (
      SELECT id FROM jobs 
      WHERE sourcer_name IN (
        SELECT email FROM user_profiles 
        WHERE id = auth.uid() AND role = 'sourcer'
      )
    )
  );

-- Sourcers can insert candidates for jobs they claimed
CREATE POLICY "Sourcers can insert candidates for claimed jobs" ON candidates
  FOR INSERT WITH CHECK (
    job_id IN (
      SELECT id FROM jobs 
      WHERE sourcer_name IN (
        SELECT email FROM user_profiles 
        WHERE id = auth.uid() AND role = 'sourcer'
      )
    )
  );

-- Admins can read all candidates
CREATE POLICY "Admins can read all candidates" ON candidates
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'admin'
    )
  );

-- Admins can insert candidates
CREATE POLICY "Admins can insert candidates" ON candidates
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'admin'
    )
  );

-- ============================================================================
-- JOB_SUBMISSIONS TABLE POLICIES
-- ============================================================================

-- Sourcers can read their own submissions
CREATE POLICY "Sourcers can read own submissions" ON job_submissions
  FOR SELECT USING (
    sourcer_name IN (
      SELECT email FROM user_profiles 
      WHERE id = auth.uid() AND role = 'sourcer'
    )
  );

-- Sourcers can insert their own submissions
CREATE POLICY "Sourcers can insert own submissions" ON job_submissions
  FOR INSERT WITH CHECK (
    sourcer_name IN (
      SELECT email FROM user_profiles 
      WHERE id = auth.uid() AND role = 'sourcer'
    )
  );

-- Clients can read submissions for their jobs
CREATE POLICY "Clients can read submissions for own jobs" ON job_submissions
  FOR SELECT USING (
    job_id IN (
      SELECT id FROM jobs 
      WHERE client_id IN (
        SELECT id FROM clients 
        WHERE email IN (
          SELECT email FROM user_profiles 
          WHERE id = auth.uid() AND role = 'client'
        )
      )
    )
  );

-- Admins can read all submissions
CREATE POLICY "Admins can read all submissions" ON job_submissions
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'admin'
    )
  );

-- Admins can insert submissions
CREATE POLICY "Admins can insert submissions" ON job_submissions
  FOR INSERT WITH CHECK (
    auth.uid() IN (
      SELECT id FROM user_profiles 
      WHERE role = 'admin'
    )
  );

-- ============================================================================
-- TIERS TABLE POLICIES (Keep public read access for subscription plans)
-- ============================================================================

-- Keep existing public read policy for tiers (subscription plans should be visible to all)
-- No changes needed here as tiers should be publicly readable 