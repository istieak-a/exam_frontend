import {
  CTASection,
  FAQSection,
  FeaturesSection,
  HeroSection,
  HowItWorksSection,
  StatsSection,
} from '../components/landing';

function Home() {
  return (
    <div className="antialiased">
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <FAQSection />
        <CTASection />
      </main>
    </div>
  );
}

export default Home;
