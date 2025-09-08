import { json, type MetaFunction } from '@remix-run/cloudflare';
import { useState, useEffect } from 'react';
import { useAuth } from '~/components/auth/WorkingAuthProvider';
import { toast } from 'react-toastify';
import { createClient } from '@supabase/supabase-js';

export const meta: MetaFunction = () => {
  return [
    { title: 'Profile – Code Launch' },
    { name: 'description', content: 'Manage your CodeLaunch profile and account settings.' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ];
};

export const loader = () => json({});

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://avogdxfjgkxrswdmhzff.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Profile() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || user.email.split('@')[0],
        email: user.email,
      });
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          name: formData.name,
        }
      });

      if (error) {
        throw error;
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const getInitials = () => {
    if (!user) return 'U';
    const name = user.name || user.email;
    return name.charAt(0).toUpperCase();
  };

  const getMemberSince = () => {
    // This would typically come from user creation date in database
    return 'Jan 2025';
  };

  if (!user) {
    return (
      <div className="min-h-screen text-white antialiased flex items-center justify-center" style={{ background: 'var(--ink, #0B1020)' }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-white/70 mb-6">Please sign in to view your profile.</p>
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
            <li><a className="hover:text-white text-[--mint] font-semibold" href="/profile">Profile</a></li>
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

      {/* Main Profile */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <section className="panel rounded-2xl p-8" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar */}
            <div 
              className="h-24 w-24 rounded-full grid place-items-center font-bold text-3xl"
              style={{ background: 'var(--mint)', color: 'var(--marine)' }}
            >
              {getInitials()}
            </div>
            
            {/* Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full rounded-lg bg-black/30 border border-white/10 px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[--mint]"
                    placeholder="Your name"
                  />
                  <input
                    type="email"
                    value={formData.email}
                    readOnly
                    className="block w-full rounded-lg bg-black/20 border border-white/5 px-4 py-2 text-white/50 cursor-not-allowed"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{user.name || user.email.split('@')[0]}</h1>
                  <p className="text-white/70">{user.email}</p>
                  <p className="text-sm text-white/50 mt-1">Member since: {getMemberSince()}</p>
                </>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="btn px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                    style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: user.name || user.email.split('@')[0],
                        email: user.email,
                      });
                    }}
                    className="btn bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn px-4 py-2 rounded-lg font-semibold"
                    style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}
                  >
                    Edit Profile
                  </button>
                  <a href="/settings" className="btn bg-white/10 hover:bg-white/15 px-4 py-2 rounded-lg">
                    Settings
                  </a>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Recent Projects */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Your Recent Projects</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {recentProjects.map((project) => (
              <article 
                key={project.id}
                className="panel rounded-xl p-5"
                style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}
              >
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-white/70">{project.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-white/50">{project.lastModified}</span>
                  <a href="/projects" className="text-[--mint] text-sm hover:underline">
                    View Project →
                  </a>
                </div>
              </article>
            ))}
          </div>
          
          {recentProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 grid place-items-center rounded-2xl font-extrabold mb-4" style={{ background: 'var(--sand)', color: 'var(--marine)' }}>
                CL
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-white/60 mb-4">Create your first project to get started</p>
              <a href="/" className="btn rounded-lg px-4 py-2 text-sm font-semibold" style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}>
                Create Project
              </a>
            </div>
          )}
        </section>

        {/* Account Stats */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">Account Overview</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="panel rounded-xl p-5 text-center" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
              <div className="text-2xl font-bold text-[--mint]">{recentProjects.length}</div>
              <div className="text-sm text-white/70">Total Projects</div>
            </div>
            <div className="panel rounded-xl p-5 text-center" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
              <div className="text-2xl font-bold text-[--mint]">0</div>
              <div className="text-sm text-white/70">Deployments</div>
            </div>
            <div className="panel rounded-xl p-5 text-center" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
              <div className="text-2xl font-bold text-[--mint]">Free</div>
              <div className="text-sm text-white/70">Plan</div>
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
