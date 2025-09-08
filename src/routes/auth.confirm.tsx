import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from '@remix-run/react';
import { json, type MetaFunction } from '@remix-run/cloudflare';
import { createClient } from '@supabase/supabase-js';

export const meta: MetaFunction = () => {
  return [
    { title: 'Email Confirmation – Code Launch' },
    { name: 'description', content: 'Confirm your email address to activate your CodeLaunch account.' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ];
};

export const loader = () => json({});

// Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://avogdxfjgkxrswdmhzff.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your_supabase_anon_key';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function AuthConfirm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const confirmEmail = async () => {
      const token_hash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const redirect_to = searchParams.get('redirect_to') || '/projects';

      if (!token_hash || !type) {
        setStatus('error');
        setMessage('Invalid confirmation link');
        return;
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });

        if (error) {
          setStatus('error');
          setMessage('Failed to confirm email. The link may be expired or invalid.');
          console.error('Confirmation error:', error);
          return;
        }

        if (data.user) {
          setStatus('success');
          setMessage('Email confirmed successfully! Redirecting...');
          
          // Redirect after 2 seconds
          setTimeout(() => {
            navigate(redirect_to);
          }, 2000);
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        console.error('Unexpected error:', error);
      }
    };

    confirmEmail();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen text-white antialiased" style={{ background: 'var(--ink, #0B1020)' }}>
      {/* Header */}
      <header className="border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <a href="/" className="inline-flex items-center gap-2 font-extrabold tracking-tight text-[--mint]">
            <span className="h-2.5 w-2.5 rounded-full bg-[--mint]"></span>
            <span className="text-lg sm:text-xl">Code Launch</span>
          </a>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <section className="panel rounded-2xl max-w-md w-full p-8 text-center" style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)' }}>
          <div className="mx-auto h-14 w-14 grid place-items-center rounded-2xl mb-4" style={{ background: 'var(--mint)', color: 'var(--marine)' }}>
            {status === 'loading' && '⏳'}
            {status === 'success' && '✅'}
            {status === 'error' && '❌'}
          </div>
          
          <h1 className="text-2xl font-extrabold mb-2">
            {status === 'loading' && 'Confirming your email...'}
            {status === 'success' && 'Email confirmed!'}
            {status === 'error' && 'Confirmation failed'}
          </h1>
          
          <p className="text-white/70 mb-6">
            {message}
          </p>

          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[--mint]"></div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="text-sm text-[--mint]">
                Redirecting to your dashboard...
              </div>
              <a
                href="/projects"
                className="btn inline-block w-full rounded-xl px-4 py-2.5 font-semibold"
                style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}
              >
                Go to Dashboard
              </a>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <a
                href="/signin"
                className="btn inline-block w-full rounded-xl px-4 py-2.5 font-semibold"
                style={{ backgroundColor: 'var(--mint)', color: 'var(--marine)' }}
              >
                Back to Sign In
              </a>
              <p className="text-xs text-white/50">
                Need help? Contact support at support@codelaunch.ai
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 text-xs text-white/50 text-center">
          © {new Date().getFullYear()} Code Launch
        </div>
      </footer>
    </div>
  );
}
