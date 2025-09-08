import { json, type MetaFunction } from '@remix-run/cloudflare';
import { useState, useEffect } from 'react';
import { useAuth } from '~/components/auth/WorkingAuthProvider';
import { toast } from 'react-toastify';
import { createClient } from '@supabase/supabase-js';

export const meta: MetaFunction = () => {
  return [
    { title: 'Profile Settings – Code Launch' },
    { name: 'description', content: 'Manage your CodeLaunch account settings and preferences.' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ];
};

export const loader = () => json({});

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://avogdxfjgkxrswdmhzff.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Settings() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Preferences State
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: true,
  });

  // Initialize form data
  useEffect(() => {
    if (user) {
      setPersonalInfo({
        name: user.name || user.email.split('@')[0],
        email: user.email,
      });
    }
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  // Handle Personal Info Update
  const handlePersonalInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: personalInfo.name,
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Personal information updated successfully!');
    } catch (error) {
      toast.error('Failed to update personal information');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Update
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        throw error;
      }

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast.success('Password updated successfully!');
    } catch (error) {
      toast.error('Failed to update password');
      console.error('Password update error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Preferences Update
  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      // Save preferences to localStorage for now
      localStorage.setItem('codelaunch_preferences', JSON.stringify(preferences));
      toast.success('Preferences saved successfully!');
    } catch (error) {
      toast.error('Failed to save preferences');
      console.error('Preferences error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('codelaunch_preferences');
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen text-white antialiased flex items-center justify-center" style={{ background: 'var(--ink, #0B1020)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-white/70 mb-6">Please sign in to access settings.</p>
          <a href="/signin" className="btn rounded-lg px-6 py-3 font-semibold" style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}>
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white antialiased flex flex-col" style={{ background: 'var(--ink, #0B1020)' }}>
      {/* Header */}
      <header className="border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="inline-flex items-center gap-2 font-extrabold tracking-tight text-[--mint]">
            <span className="h-2.5 w-2.5 rounded-full bg-[--mint]"></span>
            <span className="text-lg sm:text-xl">Code Launch</span>
          </a>
          <ul className="hidden md:flex items-center gap-8 text-sm text-white/80">
            <li><a className="hover:text-white" href="/">Home</a></li>
            <li><a className="hover:text-white" href="/projects">Projects</a></li>
            <li><a className="hover:text-white" href="/profile">Profile</a></li>
            <li><a className="hover:text-white text-[--mint] font-semibold" href="/settings">Settings</a></li>
            <li><a className="hover:text-white" href="#">Docs</a></li>
          </ul>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSignOut}
              className="btn bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full text-sm"
            >
              Sign out
            </button>
          </div>
        </nav>
      </header>

      {/* Settings */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-10">
        <h1 className="text-3xl font-bold mb-6">Profile Settings</h1>

        {/* Personal Info */}
        <section className="panel rounded-2xl p-6" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Full Name</label>
              <input 
                type="text" 
                value={personalInfo.name}
                onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                className="w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-[--mint] focus:ring-2 focus:ring-[--mint]/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input 
                type="email" 
                value={personalInfo.email}
                readOnly
                className="w-full rounded-lg px-3 py-2 bg-white/5 border border-white/5 text-white/50 cursor-not-allowed"
              />
              <p className="text-xs text-white/50 mt-1">Email cannot be changed</p>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </section>

        {/* Password */}
        <section className="panel rounded-2xl p-6" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Current Password</label>
              <input 
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[--mint] focus:ring-2 focus:ring-[--mint]/20"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">New Password</label>
              <input 
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[--mint] focus:ring-2 focus:ring-[--mint]/20"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Confirm Password</label>
              <input 
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[--mint] focus:ring-2 focus:ring-[--mint]/20"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </section>

        {/* Preferences */}
        <section className="panel rounded-2xl p-6" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <form onSubmit={handlePreferencesSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="notif" 
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
                className="accent-[--mint]"
              />
              <label htmlFor="notif">Receive email notifications</label>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="darkmode" 
                checked={preferences.darkMode}
                onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                className="accent-[--mint]"
              />
              <label htmlFor="darkmode">Enable dark mode</label>
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="btn px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
              style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </form>
        </section>

        {/* Account Actions */}
        <section className="panel rounded-2xl p-6" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <div>
                <h3 className="font-semibold text-red-400">Delete Account</h3>
                <p className="text-sm text-red-300/70">Permanently delete your account and all data</p>
              </div>
              <button 
                onClick={() => toast.info('Account deletion feature coming soon')}
                className="btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Delete Account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} Code Launch</p>
          <div className="flex gap-4">
            <a href="/terms" className="hover:text-white">Terms</a>
            <a href="/privacy" className="hover:text-white">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
