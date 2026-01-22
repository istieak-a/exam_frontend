import { Link } from 'react-router-dom';
import { SectionWrapper, Container, Button } from '../ui';

export function CTASection() {
  return (
    <SectionWrapper background="white" className="overflow-hidden">
      <Container>
        <div className="relative bg-gradient-to-br from-primary via-primary-dark to-accent rounded-3xl p-8 md:p-16 overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
            <svg className="absolute bottom-0 right-0 w-1/2 h-auto opacity-10" viewBox="0 0 200 200" fill="currentColor">
              <circle cx="100" cy="100" r="80" />
            </svg>
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Modernize Your Exams?
            </h2>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Join thousands of educators who have transformed their exam process. 
              Start for free, upgrade when you're ready.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto"
                >
                  Start Free Trial
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="mt-10 flex items-center justify-center gap-6 text-white/60 text-sm">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure & Encrypted
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                No Credit Card Required
              </span>
            </div>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}

export default CTASection;
