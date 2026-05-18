'use client';
import FloatingNav from '@/components/FloatingNav';
import HeroBg from '@/components/HeroBg';
import Hero from '@/components/Hero';
import PositioningStatement from '@/components/PositioningStatement';
import FeaturedWork from '@/components/FeaturedWork';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <FloatingNav />

      <div style={{ background: 'var(--bg-hero)' }}>

        {/* Hero — full viewport (dvh = dynamic viewport, accounts for mobile browser chrome) */}
        <div className="relative overflow-hidden" style={{ minHeight: '100dvh' }}>
          <HeroBg />
          <div className="relative z-10 flex flex-col" style={{ minHeight: '100dvh' }}>
            <Hero />
          </div>
        </div>

        {/* Conviction line + stats marquee */}
        <PositioningStatement />

      </div>

      {/* Featured projects */}
      <FeaturedWork />

      <Footer />
    </>
  );
}
