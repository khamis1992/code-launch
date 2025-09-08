import { json, type MetaFunction } from '@remix-run/cloudflare';
import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { GitHubImportButton } from '~/components/git/GitHubImportButton';
import { useAuth } from '~/components/auth/WorkingAuthProvider';

export const meta: MetaFunction = () => {
  return [
    { title: 'Code Launch – Build with AI' },
    { name: 'description', content: 'Create stunning mobile apps by chatting with AI. Built for Flutter-first teams.' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ];
};

export const loader = () => json({});

/**
 * CodeLaunch Landing Page - Professional Design
 * Modern hero page with the new branding and colors
 */
export default function Index() {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleGenerate = () => {
    if (prompt.trim()) {
      // Navigate to chat page with the prompt using Remix navigation
      const params = new URLSearchParams();
      params.set('prompt', prompt);
      navigate(`/chat/new?${params.toString()}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Stay on home page after sign out
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen text-white antialiased" style={{ background: 'var(--ink, #0B1020)' }}>
      {/* Top Navigation */}
      <header className="relative z-10">
        <nav className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <a className="inline-flex items-center gap-2 font-extrabold tracking-tight text-[--mint]" href="#">
            <span className="h-2.5 w-2.5 rounded-full bg-[--mint]"></span>
            <span className="text-xl">Code Launch</span>
          </a>
          <ul className="hidden md:flex items-center gap-8 text-sm/6 text-white/80">
            <li><a className="hover:text-white" href="/projects">Projects</a></li>
            <li><a className="hover:text-white" href="#">Docs</a></li>
            <li><a className="hover:text-white" href="/pricing">Pricing</a></li>
            {user && <li><a className="hover:text-white" href="/profile">Profile</a></li>}
          </ul>
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm text-white/70">مرحباً، {user.name || user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="hidden sm:inline-flex btn rounded-full px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-white/15"
                >
                  Sign out
                </button>
                <a href="/profile" className="w-8 h-8 bg-[--mint] rounded-full grid place-items-center text-[--marine] font-bold text-sm hover:scale-105 transition-transform cursor-pointer">
                  {user.name?.[0] || user.email[0].toUpperCase()}
                </a>
              </div>
            ) : (
              <>
                <a className="hidden sm:inline-flex btn rounded-full px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-white/15" href="/signin">Sign in</a>
                <a className="btn rounded-full px-4 py-2 text-sm font-semibold text-[--marine] bg-[--mint]" href="/signup">Get started</a>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0b1b34] to-[#0B1020]"></div>
        <div className="absolute inset-x-0 bottom-[-20vh] h-[65vh] planet-arc"></div>
      </div>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl px-6 pt-16 pb-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          {user ? (
            <>
              Welcome back, <span className="text-[--mint]">{user.name || user.email.split('@')[0]}</span>!
            </>
          ) : (
            <>
              What should we <span className="text-[--mint]">launch</span> today?
            </>
          )}
        </h1>
        <p className="mt-4 text-lg text-white/80">
          {user ? (
            'Ready to continue building amazing apps? Start a new project or continue where you left off.'
          ) : (
            'Create stunning mobile apps by chatting with AI. Built for Flutter-first teams.'
          )}
        </p>

        {/* Prompt Card */}
        <div className="mx-auto mt-10 max-w-3xl">
          <div className="rounded-2xl input-dark p-2">
            <div className="flex items-center gap-3 rounded-xl bg-black/30 px-4 py-4">
              <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-60">
                <path fill="currentColor" d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7z"/>
              </svg>
              <input 
                placeholder="Type your idea and we'll build it together."
                className="w-full bg-transparent outline-none placeholder:text-white/40"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button 
                className="rounded-full px-4 py-2 text-sm font-semibold bg-[--mint] text-[--marine] btn"
                onClick={handleGenerate}
              >
                Generate
              </button>
            </div>
            <div className="flex items-center gap-4 px-4 pb-3 pt-2 text-xs text-white/50">
              <span className="inline-flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M3 6h18v2H3zm0 5h12v2H3zm0 5h18v2H3z"/>
                </svg>
                Commands
              </span>
              <span className="inline-flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2l3 7h7l-5.5 4 2 7-6.5-4.5L5.5 20l2-7L2 9h7z"/>
                </svg>
                AI Tips
              </span>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="mt-8 flex justify-center gap-4">
          <GitHubImportButton className="rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-150">
            <div className="flex items-center">
              <svg width="16" height="16" viewBox="0 0 24 24" className="inline mr-2">
                <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Clone a repo
            </div>
          </GitHubImportButton>
          
          {user && (
            <a 
              href="/projects"
              className="rounded-full px-4 py-2 text-sm font-medium text-white transition-all duration-150 bg-white/10 hover:bg-white/15"
            >
              <div className="flex items-center">
                <svg width="16" height="16" viewBox="0 0 24 24" className="inline mr-2">
                  <path fill="currentColor" d="M3 4v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8a1 1 0 0 0-.293-.707l-4-4A1 1 0 0 0 16 3H4a1 1 0 0 0-1 1zm9 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/>
                </svg>
                View Projects
              </div>
            </a>
          )}
        </div>

        {/* Quick Stats for Logged in Users */}
        {user && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-6 text-center">Your Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
                <div className="text-2xl font-bold text-[--mint] mb-2">0</div>
                <div className="text-sm text-white/70">Active Projects</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
                <div className="text-2xl font-bold text-[--mint] mb-2">0</div>
                <div className="text-sm text-white/70">Deployments</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-6 text-center">
                <div className="text-2xl font-bold text-[--mint] mb-2">Free</div>
                <div className="text-sm text-white/70">Current Plan</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Feature Strip */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="h-10 w-10 rounded-lg bg-[--mint] text-[--marine] grid place-items-center font-bold">AI</div>
            <h3 className="mt-4 font-semibold">AI-Powered Generation</h3>
            <p className="mt-1 text-white/70">Turn ideas into Flutter code with guardrails and diffs.</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="h-10 w-10 rounded-lg bg-[--marine] text-[--sand] grid place-items-center font-bold">DB</div>
            <h3 className="mt-4 font-semibold">Supabase Ready</h3>
            <p className="mt-1 text-white/70">Auth, SQL drafts, RLS templates out of the box.</p>
          </div>
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <div className="h-10 w-10 rounded-lg bg-[--sand] text-[--marine] grid place-items-center font-bold">CI</div>
            <h3 className="mt-4 font-semibold">CI/CD Bundles</h3>
            <p className="mt-1 text-white/70">Signed .aab builds with one tag push.</p>
          </div>
        </div>
      </section>


      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} Code Launch</p>
          <div className="flex items-center gap-4">
            <a className="hover:text-white" href="#">Privacy</a>
            <a className="hover:text-white" href="#">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
