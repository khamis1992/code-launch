import { json, type MetaFunction } from '@remix-run/cloudflare';

export const meta: MetaFunction = () => {
  return [
    { title: 'Code Launch – Terms of Service' },
    { name: 'description', content: 'Terms of Service for Code Launch platform' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ];
};

export const loader = () => json({});

export default function Terms() {
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
        <h1 className="text-3xl font-extrabold mb-4">Terms of Service</h1>
        <section className="space-y-4 text-white/80 leading-relaxed">
          <p>By accessing or using Code Launch, you agree to these Terms of Service. Please read them carefully.</p>

          <h2 className="text-xl font-semibold text-[--mint]">1. Acceptance of Terms</h2>
          <p>By creating an account or using our services, you agree to comply with these terms and all applicable laws.</p>

          <h2 className="text-xl font-semibold text-[--mint]">2. Use of the Platform</h2>
          <p>You may not misuse the platform for unlawful activities. We reserve the right to suspend accounts that violate our policies.</p>

          <h2 className="text-xl font-semibold text-[--mint]">3. Intellectual Property</h2>
          <p>All content, logos, and code within Code Launch remain the property of the company. You retain rights to applications you generate.</p>

          <h2 className="text-xl font-semibold text-[--mint]">4. Limitation of Liability</h2>
          <p>We are not liable for damages caused by use or inability to use the platform. Use at your own risk.</p>

          <h2 className="text-xl font-semibold text-[--mint]">5. Updates</h2>
          <p>We may update these Terms occasionally. Continued use of the platform after updates means acceptance of the new terms.</p>

          <h2 className="text-xl font-semibold text-[--mint]">6. Account Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>

          <h2 className="text-xl font-semibold text-[--mint]">7. Service Availability</h2>
          <p>We strive to maintain high availability but do not guarantee uninterrupted service. Scheduled maintenance may occur with prior notice.</p>

          <h2 className="text-xl font-semibold text-[--mint]">8. Data and Privacy</h2>
          <p>Your use of our services is also governed by our Privacy Policy. We collect and use information as described in that policy.</p>

          <h2 className="text-xl font-semibold text-[--mint]">9. Termination</h2>
          <p>Either party may terminate the agreement at any time. Upon termination, your access to the service will cease immediately.</p>

          <h2 className="text-xl font-semibold text-[--mint]">10. Governing Law</h2>
          <p>These terms are governed by the laws of the jurisdiction in which Code Launch operates, without regard to conflict of law principles.</p>

          <div className="mt-8 p-4 panel rounded-lg">
            <p className="text-sm text-white/60">
              <strong>Last updated:</strong> {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            <p className="text-sm text-white/60 mt-2">
              If you have questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@codelaunch.ai" className="text-[--mint] hover:opacity-80">
                legal@codelaunch.ai
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 text-xs text-white/50 flex justify-between">
          <p>© {new Date().getFullYear()} Code Launch</p>
          <a href="/privacy" className="hover:text-white">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
