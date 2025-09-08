import { json, type MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    { title: 'Code Launch – Privacy Policy' },
    { name: 'description', content: 'Privacy Policy for Code Launch platform' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ];
};

export const loader = () => json({});

export default function Privacy() {
  return (
    <div className="bg-[--ink] text-white antialiased min-h-screen flex flex-col">
      <header className="border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-[--mint] font-extrabold text-lg">Code Launch</a>
          <a 
            href="/signin" 
            className="px-4 py-2 rounded-full font-semibold text-sm"
            style={{ backgroundColor: '#98FF98', color: '#1E3A8A' }}
          >
            Sign in
          </a>
        </nav>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 space-y-8">
        <h1 className="text-3xl font-extrabold mb-4">Privacy Policy</h1>
        <section className="space-y-4 text-white/80 leading-relaxed">
          <p>Your privacy is important to us. This policy explains how Code Launch collects, uses, and protects your information.</p>

          <h2 className="text-xl font-semibold text-[--mint]">1. Information We Collect</h2>
          <p>We may collect personal details such as your name, email, and usage data to improve our services.</p>

          <h2 className="text-xl font-semibold text-[--mint]">2. How We Use Information</h2>
          <p>Information is used to provide and enhance the platform, offer support, and communicate updates.</p>

          <h2 className="text-xl font-semibold text-[--mint]">3. Data Protection</h2>
          <p>We implement technical measures to protect your information, but cannot guarantee absolute security.</p>

          <h2 className="text-xl font-semibold text-[--mint]">4. Sharing of Data</h2>
          <p>We do not sell your data. Limited sharing may occur with trusted providers necessary for platform operation.</p>

          <h2 className="text-xl font-semibold text-[--mint]">5. Updates</h2>
          <p>We may update this policy from time to time. Continued use of Code Launch means you agree to the updated policy.</p>

          <h2 className="text-xl font-semibold text-[--mint]">6. Cookies and Tracking</h2>
          <p>We use cookies and similar technologies to enhance your experience, analyze usage patterns, and remember your preferences.</p>

          <h2 className="text-xl font-semibold text-[--mint]">7. Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>

          <h2 className="text-xl font-semibold text-[--mint]">8. Data Retention</h2>
          <p>We retain your information only as long as necessary to provide our services and comply with legal obligations.</p>

          <h2 className="text-xl font-semibold text-[--mint]">9. Third-Party Services</h2>
          <p>Our platform may integrate with third-party services. Their privacy practices are governed by their own privacy policies.</p>

          <h2 className="text-xl font-semibold text-[--mint]">10. Children's Privacy</h2>
          <p>Our services are not intended for children under 13. We do not knowingly collect personal information from children.</p>

          <div className="mt-8 p-4 panel rounded-lg">
            <p className="text-sm text-white/60">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm text-white/60 mt-2">
              If you have questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@codelaunch.ai" className="text-[--mint] hover:opacity-80">
                privacy@codelaunch.ai
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 text-xs text-white/50 flex justify-between">
          <p>© {new Date().getFullYear()} Code Launch</p>
          <a href="/terms" className="hover:text-white">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
