import React, { useState } from 'react';
import {
  IconRocket,
  IconCheck,
  IconArrowRight,
  IconChart,
  IconBulb,
  IconConstruction,
  IconBlueprint,
  IconX,
  IconPlus
} from './Icons';
import AuthModal from './AuthModal';

interface LandingPageProps {
  onEnterApp: () => void;
  onEnterDemo: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onEnterDemo }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('REGISTER');

  const openAuth = (mode: 'LOGIN' | 'REGISTER') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCheckout = async () => {
    const priceId = 'price_1SXR94F1yiAtAmIjmLg0JIkT';
    const mode: 'subscription' = 'subscription';

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, mode }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('❌ Réponse non OK de /api/create-checkout-session :', errorData);
        throw new Error('Réponse non OK');
      }

      const data = await response.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('❌ Pas d\'URL dans la réponse Stripe :', data);
        alert("Impossible de démarrer le paiement Stripe.");
      }
    } catch (error) {
      console.error('❌ Erreur lors du démarrage du paiement Stripe :', error);
      alert('Impossible de démarrer le paiement Stripe.');
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased">
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={onEnterApp}
      />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {/* New Bildr Logo - Stacked blocks */}
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex flex-col items-center justify-center gap-0.5 p-1">
              <div className="w-5 h-1.5 bg-white rounded-sm"></div>
              <div className="w-4 h-1.5 bg-white/80 rounded-sm"></div>
              <div className="w-3 h-1.5 bg-white/60 rounded-sm"></div>
            </div>
            <span className="font-bold text-xl text-gray-900">Bildr</span>
          </div>

          <div className="flex items-center gap-4">
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Pricing</a>
            <button
              onClick={() => openAuth('LOGIN')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Sign in
            </button>
            <button
              onClick={() => openAuth('REGISTER')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Get started free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero with emojis */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-900 leading-tight">
            You have a SaaS idea 💡<br/>
            No code skills 👨‍💻 No clue where to start 🤷‍♂️
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed">
            Sound familiar?
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            Bildr gives you everything you need to go from idea to launched MVP. Validated ideas, technical roadmap, and production-ready code. No developer needed.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <button
              onClick={() => openAuth('REGISTER')}
              className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Start building for free
              <IconArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 rounded-lg font-semibold border border-gray-300 transition-colors"
            >
              See how it works
            </button>
          </div>

          <p className="text-sm text-gray-500">
            ✓ Free forever plan · ✓ No credit card required · ✓ 30 seconds to set up
          </p>
        </div>
      </section>

      {/* Quantified Benefits with emojis */}
      <section className="py-16 px-6 bg-gray-50 border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">⚡ 4 weeks</div>
              <div className="text-gray-600">From idea to launched MVP (not 6+ months)</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">💰 $15K+</div>
              <div className="text-gray-600">Saved vs hiring a developer</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">🎯 3 steps</div>
              <div className="text-gray-600">Not 100 scattered YouTube tutorials</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main value prop with emojis (UserJot style) */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Generate ideas 💡 validate instantly ✅ build with production code 🚀 and ship in weeks ⚡
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Bildr is the complete platform for non-technical founders. Beautiful idea generation that finds market gaps, validation that actually works, blueprints that guide you step-by-step, and code that's ready to ship.
          </p>
        </div>
      </section>

      {/* Features Grid (UserJot style) */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              💼 SaaS Builder Platform
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to launch
            </h2>
            <p className="text-lg text-gray-600">
              From idea validation to production deployment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "💡",
                color: "bg-yellow-100",
                title: "Idea generation",
                description: "Market-validated SaaS ideas based on your skills"
              },
              {
                icon: "📊",
                color: "bg-blue-100",
                title: "SWOT analysis",
                description: "Viability score, competition check, market size"
              },
              {
                icon: "🎯",
                color: "bg-purple-100",
                title: "Smart validation",
                description: "Know if it's worth building before you code"
              },
              {
                icon: "📋",
                color: "bg-green-100",
                title: "Technical blueprint",
                description: "Complete stack, architecture, and 4-week plan"
              },
              {
                icon: "⚙️",
                color: "bg-red-100",
                title: "Kanban workflow",
                description: "Turn your plan into actionable weekly tasks"
              },
              {
                icon: "💻",
                color: "bg-indigo-100",
                title: "Production code",
                description: "Copy-paste ready snippets that actually work"
              },
              {
                icon: "🔐",
                color: "bg-cyan-100",
                title: "Auth & payments",
                description: "Stripe integration, user management, everything"
              },
              {
                icon: "📦",
                color: "bg-pink-100",
                title: "Deploy guides",
                description: "Step-by-step deployment to Vercel/Railway"
              }
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature 1: Idea Generation with updated mockup */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Step 1
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              No idea what to build? 🤔
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Enter your interests and skills. Get personalized micro-SaaS ideas that actually have market demand. No more guessing what might work.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Ideas based on your background</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Validated niches with real demand</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Competition analysis included</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  B
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Bildr</div>
                  <div className="text-xs text-gray-500">Idea Generator</div>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <div className="text-sm text-gray-500 mb-3">💡 Generated idea:</div>
                <div className="font-semibold text-gray-900 mb-3">Screenshot Feedback Tool for Designers</div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-2">
                    <div className="text-green-600 font-medium">Market size</div>
                    <div className="text-gray-900 font-bold">$2.4M</div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                    <div className="text-yellow-600 font-medium">Competition</div>
                    <div className="text-gray-900 font-bold">Medium</div>
                  </div>
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-2">
                    <div className="text-indigo-600 font-medium">Viability</div>
                    <div className="text-gray-900 font-bold">87/100</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Validation with updated mockup */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">📊</span>
                <div className="font-semibold text-gray-900">SWOT Analysis</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                  <span>✅</span> Strengths
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Low competition in niche</li>
                  <li>• Recurring revenue model</li>
                  <li>• Easy to integrate</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                  <span>⚠️</span> Weaknesses
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Requires design tool integration</li>
                  <li>• Network effects limited</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                  <span>🚀</span> Opportunities
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Growing remote design market</li>
                  <li>• API integrations possible</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Step 2
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Is it actually worth building? 🎯
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Get a viability score out of 100, complete SWOT analysis, and competitor landscape. Know if your idea has legs before writing a single line of code.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Viability score with detailed breakdown</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Competitor analysis and positioning</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Market size estimation</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Feature 3: Blueprint with updated mockup */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Step 3
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What tech stack? What features first? 🛠️
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Get a complete technical blueprint. Recommended tech stack, 4-week roadmap, and architecture diagrams. Everything a developer would charge $5K to plan.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Personalized tech stack recommendation</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Week-by-week development roadmap</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Database schema and API design</span>
              </li>
            </ul>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🏗️</span>
                <div className="font-semibold text-gray-900">Recommended Stack</div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <span className="text-sm">⚛️</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Frontend</div>
                    <div className="text-xs text-gray-600">React + Tailwind CSS</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <span className="text-sm">🗄️</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Backend</div>
                    <div className="text-xs text-gray-600">Supabase (auth + database)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                    <span className="text-sm">💳</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Payments</div>
                    <div className="text-xs text-gray-600">Stripe</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                    <span className="text-sm">🚀</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Hosting</div>
                    <div className="text-xs text-gray-600">Vercel</div>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated cost:</span>
                    <span className="font-bold text-gray-900">$25/month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 4: Code with updated mockup */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-gray-500 text-xs ml-2">auth.ts</span>
              </div>
              <div className="font-mono text-sm text-green-400">
                <div className="text-gray-500">// 🔐 Authentication setup</div>
                <div className="mt-3">
                  <span className="text-purple-400">const</span>{' '}
                  <span className="text-blue-400">supabase</span> ={' '}
                  <span className="text-yellow-400">createClient</span>(
                </div>
                <div className="ml-4 text-cyan-400">
                  process.env.SUPABASE_URL,
                </div>
                <div className="ml-4 text-cyan-400">
                  process.env.SUPABASE_KEY
                </div>
                <div>);</div>
                <div className="mt-4 text-gray-500">// ✅ Copy-paste ready</div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2">
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold mb-4">
              Step 4
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Stuck? Get the exact code you need 💻
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Production-ready code snippets for every step. Authentication, payments, database queries—all ready to copy-paste. Your technical co-founder, on demand.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Code that actually works (tested)</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Explained in plain English</span>
              </li>
              <li className="flex items-start gap-3">
                <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Unlimited code requests</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            How does Bildr compare? 🤔
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            We built Bildr because we were tired of piecing together solutions that don't talk to each other.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-6 text-gray-900 font-semibold">Feature</th>
                  <th className="text-center py-4 px-6 text-gray-900 font-semibold">Bildr</th>
                  <th className="text-center py-4 px-6 text-gray-600">ChatGPT</th>
                  <th className="text-center py-4 px-6 text-gray-600">Hiring a Dev</th>
                  <th className="text-center py-4 px-6 text-gray-600">No-Code Tools</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Idea generation</td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-indigo-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Market validation</td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-indigo-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Technical blueprint</td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-indigo-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400 text-sm">Partial</span></td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Production code</td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-indigo-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400 text-sm">Buggy</span></td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><span className="text-gray-400 text-sm">Limited</span></td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="py-4 px-6 text-gray-700">Guided workflow</td>
                  <td className="text-center py-4 px-6"><IconCheck className="w-5 h-5 text-indigo-600 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                  <td className="text-center py-4 px-6"><IconX className="w-5 h-5 text-gray-300 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-4 px-6 text-gray-900 font-semibold">Cost</td>
                  <td className="text-center py-4 px-6 text-indigo-600 font-semibold">19€/mo</td>
                  <td className="text-center py-4 px-6 text-gray-600">20€/mo</td>
                  <td className="text-center py-4 px-6 text-gray-600">$15K+</td>
                  <td className="text-center py-4 px-6 text-gray-600">$30-100/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust Signal */}
      <section className="py-16 px-6 bg-indigo-50 border-y border-indigo-100">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-indigo-900 font-medium">
            "Built by indie founders 👨‍💻 for indie founders who can't code 🚫💻 but have million-dollar ideas 💡"
          </p>
          <p className="text-indigo-700 mt-2">
            We're not VC-funded 🚫💰 We're bootstrapped 🛠️ We get it.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6" id="pricing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, honest pricing 💸
            </h2>
            <p className="text-lg text-gray-600">
              Start free. Upgrade when you're ready to build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free */}
            <div className="border-2 border-gray-200 rounded-lg p-8 bg-white">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-600">/forever</span>
                </div>
                <p className="text-gray-600">
                  Try Bildr. Generate your first idea.
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">1 complete idea generated</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Viability analysis</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <IconX className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Technical blueprint</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-400">
                  <IconX className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>Production code</span>
                </li>
              </ul>

              <button
                onClick={() => openAuth('REGISTER')}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors"
              >
                Start free
              </button>
            </div>

            {/* Launch */}
            <div className="border-2 border-indigo-600 rounded-lg p-8 bg-white relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-sm font-semibold rounded-full">
                Most popular
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Launch</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-5xl font-bold text-gray-900">19€</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">
                  Everything to launch your SaaS
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited ideas generated</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Complete validations</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Technical blueprints</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Production-ready code</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <IconCheck className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited code requests</span>
                </li>
              </ul>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
              >
                Get started
              </button>
              <p className="text-xs text-gray-500 text-center mt-4">
                Cancel anytime. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-50" id="faq">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently asked questions
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Do I need to know how to code?",
                a: "Nope. Bildr is built for non-developers. We give you code that's ready to copy-paste, with explanations in plain English. If you can follow a recipe, you can use Bildr."
              },
              {
                q: "How is this different from ChatGPT?",
                a: "ChatGPT is amazing, but it's not structured. You need to know what to ask, when to ask it, and how to piece everything together. Bildr guides you through the entire process: idea → validation → plan → code. It's the full workflow, not just scattered answers."
              },
              {
                q: "Can I really build a SaaS in 4 weeks?",
                a: "Yes—if you follow the roadmap and put in 10-15 hours per week. We break it down into doable weekly milestones. Week 1: Auth. Week 2: Core feature. Week 3: Payments. Week 4: Launch."
              },
              {
                q: "What if I get stuck?",
                a: "That's exactly what the code generator is for. Describe what you're stuck on, and you'll get the exact code you need to move forward. It's like having a senior developer on speed dial."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. One click, no hoops. You keep access to everything you've already generated."
              },
              {
                q: "Is the free plan really free forever?",
                a: "Yes. No credit card required. You get 1 complete idea generation and validation. Enough to see if Bildr is right for you."
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                <summary className="flex items-center justify-between w-full px-6 py-5 cursor-pointer list-none">
                  <span className="font-semibold text-gray-900 text-left pr-6">
                    {faq.q}
                  </span>
                  <IconPlus className="w-5 h-5 text-gray-400 group-open:rotate-45 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to build your SaaS? 🚀
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Join indie founders who are shipping their ideas instead of waiting for "someday."
          </p>
          <button
            onClick={() => openAuth('REGISTER')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-100 text-indigo-600 rounded-lg font-bold text-lg transition-colors"
          >
            Start building for free
            <IconArrowRight className="w-5 h-5" />
          </button>
          <p className="text-indigo-200 text-sm mt-6">
            Free forever plan · No credit card · 30 seconds to start
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex flex-col items-center justify-center gap-0.5 p-1">
                <div className="w-5 h-1.5 bg-white rounded-sm"></div>
                <div className="w-4 h-1.5 bg-white/80 rounded-sm"></div>
                <div className="w-3 h-1.5 bg-white/60 rounded-sm"></div>
              </div>
              <span className="font-bold text-xl text-gray-900">Bildr</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
              <span>© 2025 Bildr</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
