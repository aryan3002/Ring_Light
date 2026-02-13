import dynamic from 'next/dynamic';
import Link from 'next/link';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Navigation from '@/components/shared/Navigation';
import { LANDING_CONTENT } from '@/lib/landingContent';

const Demo = dynamic(() => import('@/components/landing/Demo'), {
  loading: () => <LandingSectionPlaceholder label="Loading demo" />,
});

const CTA = dynamic(() => import('@/components/landing/CTA'), {
  loading: () => <LandingSectionPlaceholder label="Loading call to action" />,
});

function LandingSectionPlaceholder({ label }: { label: string }) {
  return (
    <section className="landing-section px-6" aria-label={label}>
      <div className="mx-auto max-w-5xl">
        <div className="h-56 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-shell min-h-screen bg-deep-charcoal">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <Demo />
        <CTA />
      </main>

      <footer className="border-t border-white/10 px-6 py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="gradient-text font-display text-lg">
              {LANDING_CONTENT.brandName}
            </span>
          </div>

          <nav className="flex items-center gap-8 text-sm text-white/65" aria-label="Footer">
            <Link href="/studio" className="transition-colors hover:text-white">
              Studio
            </Link>
            <Link href="/presets" className="transition-colors hover:text-white">
              Presets
            </Link>
            <Link href="/settings" className="transition-colors hover:text-white">
              Settings
            </Link>
          </nav>

          <p className="text-xs text-white/55">{LANDING_CONTENT.footer.tagline}</p>
        </div>
      </footer>
    </div>
  );
}
