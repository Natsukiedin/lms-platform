-- Tenants Table
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  plan TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN', 'TENANT_ADMIN', 'USER')),
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses Table
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  cloudflare_video_id TEXT NOT NULL, -- Replaced videoUrl with Cloudflare Stream Video ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course Licenses Table (出し分けロジック)
CREATE TABLE course_licenses (
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  deadline TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (tenant_id, course_id)
);

-- User Progress Table
CREATE TABLE user_progress (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  progress_percent INTEGER DEFAULT 0,
  status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  quiz_score INTEGER,
  feedback TEXT,
  completed_at TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (user_id, course_id)
);

-- Row Level Security (RLS)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Policies for RLS
-- SUPER_ADMIN can see everything.
-- TENANT_ADMIN can see their own tenant data.
-- USER can only see their own progress.
CREATE POLICY "Tenant isolation" ON users
  FOR ALL
  USING (
    tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()) 
    OR (SELECT role FROM users WHERE id = auth.uid()) = 'SUPER_ADMIN'
  );

CREATE POLICY "Users can see own progress" ON user_progress
  FOR ALL
  USING (
    user_id = auth.uid()
    OR (SELECT role FROM users WHERE id = auth.uid() AND tenant_id = user_progress.tenant_id) = 'TENANT_ADMIN'
    OR (SELECT role FROM users WHERE id = auth.uid()) = 'SUPER_ADMIN'
  );
