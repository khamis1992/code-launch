/**
 * Supabase Configuration for CodeLaunch Platform
 */

export const SUPABASE_CONFIG = {
  // Main Supabase project for CodeLaunch platform
  url: import.meta.env.VITE_SUPABASE_URL || 'https://avogdxfjgkxrswdmhzff.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key',
  serviceRoleKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY || 'your_supabase_service_role_key'
};

// Database schema for CodeLaunch platform
export const DATABASE_SCHEMA = {
  // Users management
  users: `
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      avatar_url TEXT,
      subscription_plan VARCHAR(50) DEFAULT 'free',
      usage_stats JSONB DEFAULT '{}',
      preferences JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,

  // Projects management  
  projects: `
    CREATE TABLE IF NOT EXISTS projects (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      type VARCHAR(50) DEFAULT 'flutter',
      framework VARCHAR(50) DEFAULT 'flutter',
      files_data JSONB DEFAULT '{}',
      settings JSONB DEFAULT '{}',
      status VARCHAR(20) DEFAULT 'draft',
      is_public BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,

  // Chat conversations
  chats: `
    CREATE TABLE IF NOT EXISTS chats (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
      title VARCHAR(255),
      messages_data JSONB DEFAULT '[]',
      model_used VARCHAR(100),
      total_tokens INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `,

  // Templates library
  templates: `
    CREATE TABLE IF NOT EXISTS templates (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100),
      description TEXT,
      files_structure JSONB,
      preview_image TEXT,
      popularity INTEGER DEFAULT 0,
      is_featured BOOLEAN DEFAULT false,
      created_by UUID REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW()
    );
  `,

  // Usage analytics
  usage_analytics: `
    CREATE TABLE IF NOT EXISTS usage_analytics (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      action_type VARCHAR(100),
      model_used VARCHAR(100),
      tokens_used INTEGER,
      cost_usd DECIMAL(10,4),
      project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
      metadata JSONB DEFAULT '{}',
      timestamp TIMESTAMP DEFAULT NOW()
    );
  `,

  // User sessions
  user_sessions: `
    CREATE TABLE IF NOT EXISTS user_sessions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      session_token VARCHAR(255) UNIQUE,
      refresh_token VARCHAR(255),
      expires_at TIMESTAMP,
      device_info JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT NOW()
    );
  `
};

// Row Level Security policies
export const RLS_POLICIES = {
  users: [
    'ALTER TABLE users ENABLE ROW LEVEL SECURITY;',
    `CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);`,
    `CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);`
  ],
  
  projects: [
    'ALTER TABLE projects ENABLE ROW LEVEL SECURITY;',
    `CREATE POLICY "Users can view own projects" ON projects FOR SELECT USING (auth.uid() = user_id OR is_public = true);`,
    `CREATE POLICY "Users can create projects" ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);`,
    `CREATE POLICY "Users can update own projects" ON projects FOR UPDATE USING (auth.uid() = user_id);`,
    `CREATE POLICY "Users can delete own projects" ON projects FOR DELETE USING (auth.uid() = user_id);`
  ],
  
  chats: [
    'ALTER TABLE chats ENABLE ROW LEVEL SECURITY;',
    `CREATE POLICY "Users can view own chats" ON chats FOR SELECT USING (auth.uid() = user_id);`,
    `CREATE POLICY "Users can create chats" ON chats FOR INSERT WITH CHECK (auth.uid() = user_id);`,
    `CREATE POLICY "Users can update own chats" ON chats FOR UPDATE USING (auth.uid() = user_id);`,
    `CREATE POLICY "Users can delete own chats" ON chats FOR DELETE USING (auth.uid() = user_id);`
  ],
  
  templates: [
    'ALTER TABLE templates ENABLE ROW LEVEL SECURITY;',
    `CREATE POLICY "Everyone can view templates" ON templates FOR SELECT TO authenticated, anon USING (true);`,
    `CREATE POLICY "Users can create templates" ON templates FOR INSERT WITH CHECK (auth.uid() = created_by);`
  ],
  
  usage_analytics: [
    'ALTER TABLE usage_analytics ENABLE ROW LEVEL SECURITY;',
    `CREATE POLICY "Users can view own analytics" ON usage_analytics FOR SELECT USING (auth.uid() = user_id);`,
    `CREATE POLICY "System can insert analytics" ON usage_analytics FOR INSERT WITH CHECK (true);`
  ]
};

// Authentication configuration
export const AUTH_CONFIG = {
  providers: ['email', 'google', 'github'],
  redirectUrls: {
    development: 'http://localhost:5174/auth/callback',
    production: 'https://codelaunch.ai/auth/callback'
  },
  emailSettings: {
    enableConfirmations: true,
    enablePasswordRecovery: true,
    customEmailTemplates: true
  }
};
