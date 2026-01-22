import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  StatsSection,
  FAQSection,
  CTASection,
} from '../components/landing';

function Home() {
  return (
    <div className="font-display text-text-light-secondary antialiased">
      <main className="relative">
        <HeroSection />
        <div className="relative bg-background-light z-10">
          <FeaturesSection />
          <HowItWorksSection />
          <StatsSection />
          <FAQSection />
          <CTASection />
        </div>
      </main>
    </div>
  );
}

export default Home;
