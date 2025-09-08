import { json, type MetaFunction, type ActionFunctionArgs } from '@remix-run/cloudflare';
import { Form, useActionData } from '@remix-run/react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '~/components/auth/WorkingAuthProvider';

export const meta: MetaFunction = () => {
  return [
    { title: 'Code Launch – Sign Up' },
    { name: 'description', content: 'Join Code Launch and start building apps' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ];
};

export const loader = () => json({});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirm') as string;
  const terms = formData.get('terms') === 'on';

  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    return json({ 
      success: false, 
      message: 'All fields are required' 
    }, { status: 400 });
  }

  if (password !== confirmPassword) {
    return json({ 
      success: false, 
      message: 'Passwords do not match' 
    }, { status: 400 });
  }

  if (!terms) {
    return json({ 
      success: false, 
      message: 'You must agree to the Terms and Privacy Policy' 
    }, { status: 400 });
  }

  // Simulate account creation (replace with real logic)
  if (email && password && name) {
    return json({ 
      success: true, 
      message: 'Account created successfully!',
      user: { name, email }
    });
  }

  return json({ 
    success: false, 
    message: 'Failed to create account' 
  }, { status: 400 });
};

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const actionData = useActionData<typeof action>();
  const { signUp: authSignUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    
    // Basic client-side validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('يرجى ملء جميع الحقول');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (!terms) {
      setError('يجب الموافقة على الشروط والأحكام');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    
    try {
      await authSignUp(email, password, { name });
      toast.success('تم إنشاء الحساب بنجاح!');
      // Redirect to sign in page
      setTimeout(() => {
        window.location.href = '/signin';
      }, 2000);
    } catch (error) {
      setError('فشل في إنشاء الحساب. يرجى المحاولة مرة أخرى');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    toast.info(`${provider} signup coming soon!`);
  };

  return (
    <div className="bg-[--ink] text-white antialiased min-h-screen flex flex-col">
      {/* Top nav */}
      <header className="border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <a href="/" className="text-[--mint] font-extrabold text-xl">Code Launch</a>
          <a 
            href="/signin" 
            className="btn bg-white/10 hover:bg-white/15 px-4 py-2 rounded-full text-sm"
          >
            Sign in
          </a>
        </nav>
      </header>

      {/* Ambient curve */}
      <div className="absolute inset-x-0 bottom-[-20vh] h-[60vh] -z-10 ambient"></div>

      {/* Sign up card */}
      <main className="flex-1 grid place-items-center px-6 py-10">
        <section className="w-full max-w-md panel rounded-2xl p-6 sm:p-8">
          <div className="text-center">
            <div 
              className="mx-auto h-12 w-12 grid place-items-center rounded-2xl" 
              style={{ background: '#98FF98', color: '#1E3A8A' }}
            >
              <span className="font-extrabold">CL</span>
            </div>
            <h1 className="mt-4 text-2xl font-extrabold">Create your account</h1>
            <p className="mt-1 text-white/70">Join Code Launch and start building apps</p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold">Full Name</label>
              <input 
                id="name" 
                name="name"
                type="text" 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="mt-2 w-full rounded-xl px-3 py-2 input text-sm bg-white/5 placeholder:text-white/40" 
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold">Email</label>
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
              <label htmlFor="password" className="block text-sm font-semibold">Password</label>
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm" className="block text-sm font-semibold">Confirm Password</label>
              <input 
                id="confirm" 
                name="confirm"
                type="password" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full rounded-xl px-3 py-2 input text-sm bg-white/5 placeholder:text-white/40" 
              />
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 text-sm">
              <input 
                type="checkbox" 
                id="terms" 
                name="terms"
                required 
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="accent-[--mint]" 
              />
              <label htmlFor="terms">
                I agree to the{' '}
                <a href="/terms" className="text-[--mint] hover:opacity-90">Terms</a> and{' '}
                <a href="/privacy" className="text-[--mint] hover:opacity-90">Privacy Policy</a>
              </label>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              disabled={isLoading}
              className={`btn w-full rounded-xl px-4 py-2.5 font-semibold ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              style={{ backgroundColor: '#98FF98', color: '#1E3A8A' }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
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
                <span className="bg-transparent px-2 text-xs text-white/50">or sign up with</span>
              </div>
            </div>

            {/* Social */}
            <div className="grid grid-cols-3 gap-3">
              <button 
                type="button" 
                onClick={() => handleSocialSignup('Google')}
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
                onClick={() => handleSocialSignup('GitHub')}
                className="btn rounded-xl bg-white/10 hover:bg-white/15 py-2 text-sm flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
              <button 
                type="button" 
                onClick={() => handleSocialSignup('Apple')}
                className="btn rounded-xl bg-white/10 hover:bg-white/15 py-2 text-sm flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
                Apple
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-xs text-white/60">
            Already have an account?{' '}
            <a href="/signin" className="text-[--mint] hover:opacity-90">Sign in</a>
          </p>
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
