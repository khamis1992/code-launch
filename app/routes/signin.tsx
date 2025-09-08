import { json, type MetaFunction, type ActionFunctionArgs } from '@remix-run/cloudflare';
import { Form, useActionData } from '@remix-run/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '~/components/auth/WorkingAuthProvider';

export const meta: MetaFunction = () => {
  return [
    { title: 'Code Launch – Sign in' },
    { name: 'description', content: 'Sign in to your Code Launch account' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ];
};

export const loader = () => json({});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const remember = formData.get('remember') === 'on';

  // Simulate authentication (replace with real auth logic)
  if (email && password) {
    // Mock successful login
    return json({ 
      success: true, 
      message: 'Sign in successful!',
      user: { email, remember }
    });
  }

  return json({ 
    success: false, 
    message: 'Invalid email or password' 
  }, { status: 400 });
};

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const actionData = useActionData<typeof action>();
  const { signIn: authSignIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    if (!email.trim() || !password.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    setIsLoading(true);
    
    try {
      await authSignIn(email, password);
      // Redirect to home page on success
      window.location.href = '/';
    } catch (error) {
      setError('الحساب أو كلمة المرور غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast.info(`${provider} login coming soon!`);
  };

  return (
    <div className="bg-[--ink] text-white antialiased min-h-screen flex flex-col">
      {/* Top nav (minimal) */}
      <header className="relative z-10">
        <nav className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <a className="inline-flex items-center gap-2 font-extrabold tracking-tight text-[--mint]" href="/">
            <span className="h-2.5 w-2.5 rounded-full bg-[--mint]"></span>
            <span className="text-xl">Code Launch</span>
          </a>
          <div className="flex items-center gap-2 text-sm">
            <a className="hidden sm:inline-flex btn rounded-full px-4 py-2 bg-white/10 hover:bg-white/15" href="/projects">Projects</a>
            <a className="btn rounded-full px-4 py-2 text-[--marine] bg-[--mint]" href="/chat/new">Open Studio</a>
          </div>
        </nav>
      </header>

      {/* Ambient curve background */}
      <div className="absolute inset-x-0 bottom-[-20vh] h-[60vh] -z-10 ambient"></div>

      {/* Sign-in card */}
      <main className="flex-1 grid place-items-center px-6 py-10">
        <section className="w-full max-w-md panel rounded-2xl p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 grid place-items-center rounded-2xl" style={{ background: 'var(--mint)', color: 'var(--marine)' }}>
              <span className="font-extrabold">CL</span>
            </div>
            <h1 className="mt-4 text-2xl font-extrabold">Welcome back</h1>
            <p className="mt-1 text-white/70">Sign in to your Code Launch account</p>
            
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white/85">Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-2 w-full rounded-xl px-3 py-2 input text-sm bg-white/5 placeholder:text-white/40" 
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-semibold text-white/85">Password</label>
                <a className="text-xs text-[--mint] hover:opacity-90" href="/forgot-password">Forgot password?</a>
              </div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl px-3 py-2 input text-sm bg-white/5 placeholder:text-white/40" 
              />
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-[--mint] bg-white/10 rounded" 
                />
                <span className="text-white/80">Remember me</span>
              </label>
              <span className="text-white/60 text-xs">
                Need an account? <a className="text-[--mint] hover:opacity-90" href="/signup">Sign up</a>
              </span>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={isLoading}
              className={`btn w-full rounded-xl bg-[--mint] text-[--marine] px-4 py-2.5 font-semibold ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>

            {/* Error message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 text-red-400">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                  <span className="text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-transparent px-2 text-xs text-white/50">or continue with</span>
              </div>
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button 
                type="button" 
                onClick={() => handleSocialLogin('Google')}
                className="btn rounded-xl bg-white/10 hover:bg-white/15 py-2 text-sm flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button 
                type="button" 
                onClick={() => handleSocialLogin('GitHub')}
                className="btn rounded-xl bg-white/10 hover:bg-white/15 py-2 text-sm flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
              <button 
                type="button" 
                onClick={() => handleSocialLogin('Apple')}
                className="btn rounded-xl bg-white/10 hover:bg-white/15 py-2 text-sm flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                Apple
              </button>
            </div>
          </form>

          {/* Security note */}
          <p className="mt-6 text-center text-xs text-white/50">
            Protected by industry-standard encryption. By continuing you agree to our{' '}
            <a href="/terms" className="text-[--mint] hover:opacity-90">Terms</a> &{' '}
            <a href="/privacy" className="text-[--mint] hover:opacity-90">Privacy Policy</a>.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} Code Launch</p>
          <div className="flex items-center gap-4">
            <a className="hover:text-white" href="/privacy">Privacy</a>
            <a className="hover:text-white" href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
