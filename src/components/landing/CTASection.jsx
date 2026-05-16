import { Link } from 'react-router-dom';
import { Button, Container, SectionWrapper } from '../ui';

export function CTASection() {
  return (
    <SectionWrapper background="canvas" spacing="md">
      <Container>
        <div className="rounded-xl bg-primary px-8 py-14 text-on-primary sm:px-12 md:px-16 md:py-20">
          <div className="grid items-end gap-10 md:grid-cols-12">
            <div className="md:col-span-8">
              <p className="mb-4 text-[11px] uppercase tracking-[0.18em] text-on-primary/75">
                Start with a single exam
              </p>
              <h2 className="font-display text-[36px] leading-[1.1] tracking-[-0.02em] text-on-primary md:text-[48px]">
                The next exam you write could be the first one your students actually enjoy taking.
              </h2>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-on-primary/85">
                Free for individual instructors. No card required. Five minutes from sign-up to your first published draft.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:col-span-4 md:items-end">
              <Link to="/signup" className="w-full md:w-auto">
                <Button variant="secondary-on-coral" size="lg" className="w-full md:w-auto">
                  Try ExamHub
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link to="/about" className="w-full md:w-auto">
                <button className="inline-flex h-11 w-full items-center justify-center rounded-md border border-on-primary/30 px-6 text-sm font-medium text-on-primary transition-colors hover:bg-on-primary/10 md:w-auto">
                  Read the manifesto
                </button>
              </Link>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-on-primary/20 pt-6 text-xs text-on-primary/70">
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Encrypted in transit and at rest
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              No credit card to start
            </span>
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime, export everything
            </span>
          </div>
        </div>
      </Container>
    </SectionWrapper>
  );
}

export default CTASection;
