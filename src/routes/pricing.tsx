import { json, type MetaFunction } from '@remix-run/cloudflare';
import { useState } from 'react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Code Launch – Pricing' },
    { name: 'description', content: 'Choose the plan that fits you. Simple pricing, powerful features. Scale with ease.' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ];
};

export const loader = () => json({});

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for individuals and small projects',
      monthlyPrice: '$0',
      yearlyPrice: '$0',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      features: [
        'Up to 3 projects',
        'Basic AI assistance',
        'Community support',
        'Standard templates',
        'Basic export options'
      ],
      buttonText: 'Get Started',
      buttonStyle: 'secondary',
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Best for growing teams and businesses',
      monthlyPrice: '$29',
      yearlyPrice: '$290',
      period: billingCycle === 'monthly' ? '/month' : '/year',
      features: [
        'Unlimited projects',
        'Advanced AI features',
        'Priority support',
        'Premium templates',
        'Advanced export options',
        'Team collaboration',
        'Custom integrations'
      ],
      buttonText: 'Start Free Trial',
      buttonStyle: 'primary',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with custom needs',
      monthlyPrice: 'Custom',
      yearlyPrice: 'Custom',
      period: '',
      features: [
        'Everything in Pro',
        'Custom AI models',
        'Dedicated support',
        'Custom templates',
        'White-label solution',
        'Advanced security',
        'SLA guarantee',
        'Custom integrations'
      ],
      buttonText: 'Contact Sales',
      buttonStyle: 'secondary',
    }
  ];

  const getCurrentPrice = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 'Custom') return 'Custom';
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  return (
    <div className="min-h-screen text-white antialiased" style={{ background: 'var(--ink, #0B1020)' }}>
      {/* Navigation */}
      <header className="relative z-10 border-b border-white/10">
        <nav className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <a className="inline-flex items-center gap-2 font-extrabold tracking-tight text-[--mint]" href="/">
            <span className="h-2.5 w-2.5 rounded-full bg-[--mint]"></span>
            <span className="text-xl">Code Launch</span>
          </a>
          <ul className="hidden md:flex items-center gap-8 text-sm text-white/80">
            <li><a className="hover:text-white" href="/projects">Projects</a></li>
            <li><a className="hover:text-white" href="#">Templates</a></li>
            <li><a className="hover:text-white" href="#">Docs</a></li>
            <li><a className="hover:text-white text-[--mint] font-semibold" href="/pricing">Pricing</a></li>
          </ul>
          <div className="flex items-center gap-2">
            <a className="hidden sm:inline-flex btn rounded-full px-4 py-2 text-sm font-semibold bg-white/10 hover:bg-white/15" href="/signin">Sign in</a>
            <a className="btn rounded-full px-4 py-2 text-sm font-semibold" style={{ color: '#1E3A8A', backgroundColor: '#98FF98' }} href="/signup">Get started</a>
          </div>
        </nav>
      </header>

      {/* Ambient Background */}
      <div className="absolute inset-x-0 bottom-[-20vh] h-[60vh] -z-10 ambient"></div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="mt-4 text-xl text-white/70 max-w-2xl mx-auto">
          Choose the plan that fits your needs. Start free, scale as you grow.
        </p>

        {/* Billing Toggle */}
        <div className="mt-8 w-full max-w-sm mx-auto">
          <div 
            role="tablist" 
            className="flex items-center bg-white/5 border border-white/10 rounded-full p-1"
          >
            <button
              role="tab"
              aria-selected={billingCycle === 'monthly'}
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[--mint] focus:ring-opacity-50 ${
                billingCycle === 'monthly'
                  ? 'bg-[--mint] text-[--marine]'
                  : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              role="tab"
              aria-selected={billingCycle === 'yearly'}
              onClick={() => setBillingCycle('yearly')}
              className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[--mint] focus:ring-opacity-50 ${
                billingCycle === 'yearly'
                  ? 'bg-[--mint] text-[--marine]'
                  : 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                Yearly
                <span className="inline-flex items-center rounded-full bg-[--mint] text-[--marine] px-2 py-0.5 text-xs font-semibold">
                  Save 20%
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`card rounded-2xl p-8 relative ${
                plan.popular ? 'ring-2 ring-[--mint] scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: '#98FF98', color: '#1E3A8A' }}>
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p className="mt-2 text-white/60">{plan.description}</p>
                
                <div className="mt-6">
                  <span className="text-4xl font-extrabold">{getCurrentPrice(plan)}</span>
                  {plan.period && <span className="text-white/60 ml-1">{plan.period}</span>}
                </div>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 flex-shrink-0" style={{ color: '#98FF98' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`btn w-full mt-8 rounded-xl px-6 py-3 font-semibold ${
                  plan.buttonStyle === 'primary'
                    ? 'text-white bg-white/10 hover:bg-white/15'
                    : 'bg-white/5 hover:bg-white/10 text-white/80'
                }`}
                style={plan.buttonStyle === 'primary' ? { backgroundColor: '#98FF98', color: '#1E3A8A' } : {}}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold">Frequently asked questions</h2>
          <p className="mt-4 text-white/60">Can't find the answer you're looking for? Contact our support team.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            {
              question: 'Can I change plans anytime?',
              answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.'
            },
            {
              question: 'Is there a free trial?',
              answer: 'Yes, we offer a 14-day free trial for the Pro plan. No credit card required to get started.'
            },
            {
              question: 'What payment methods do you accept?',
              answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.'
            },
            {
              question: 'Can I cancel anytime?',
              answer: 'Absolutely. You can cancel your subscription at any time. Your account will remain active until the end of your billing period.'
            }
          ].map((faq, index) => (
            <div key={index} className="panel rounded-xl p-6">
              <h3 className="font-semibold mb-2">{faq.question}</h3>
              <p className="text-white/70 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-6 pb-20 text-center">
        <div className="panel rounded-2xl p-12">
          <h2 className="text-3xl font-extrabold mb-4">Ready to get started?</h2>
          <p className="text-white/70 mb-8">Join thousands of developers building amazing apps with Code Launch.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/signup" 
              className="btn rounded-xl px-8 py-3 font-semibold"
              style={{ backgroundColor: '#98FF98', color: '#1E3A8A' }}
            >
              Start Building Now
            </a>
            <a href="/signin" className="btn rounded-xl px-8 py-3 font-semibold bg-white/10 hover:bg-white/15">
              Sign In
            </a>
          </div>
        </div>
      </section>

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