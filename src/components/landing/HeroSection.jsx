import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button, Container } from '../ui';

const examQuestions = [
  { type: 'MCQ', text: 'Which property of matter is conserved during a chemical reaction?' },
  { type: 'Essay', text: 'Explain the trade-offs of asymmetric vs symmetric encryption.' },
  { type: 'Short answer', text: 'Define the central limit theorem in plain language.' },
];

export function HeroSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % examQuestions.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-canvas pt-32 pb-20 lg:pt-40 lg:pb-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge variant="coral" size="md" className="mb-7">
              Considered exams
            </Badge>

            <h1 className="font-display text-[44px] leading-[1.04] tracking-[-0.03em] text-ink sm:text-[56px] lg:text-[68px]">
              Modernize university exams,
              <span className="block text-primary"> without the noise.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-body">
              A considered platform for the way universities actually run exams — author once, grade fairly, and talk
              to students without paperwork. Built for the curious teacher and the patient student.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Try ExamHub
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  See how it reads
                </Button>
              </Link>
            </div>

            <div className="mt-14 flex items-center gap-10 text-left">
              <div>
                <div className="font-display text-[28px] text-ink">50+</div>
                <div className="text-xs uppercase tracking-[0.15em] text-muted">Universities</div>
              </div>
              <div className="h-10 w-px bg-hairline" />
              <div>
                <div className="font-display text-[28px] text-ink">10k</div>
                <div className="text-xs uppercase tracking-[0.15em] text-muted">Exams authored</div>
              </div>
              <div className="h-10 w-px bg-hairline" />
              <div>
                <div className="font-display text-[28px] text-ink">99.9%</div>
                <div className="text-xs uppercase tracking-[0.15em] text-muted">Uptime</div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="rounded-xl bg-surface-dark p-7 text-on-dark shadow-[0_30px_80px_-30px_rgba(20,20,19,0.45)]">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-dark-soft">
                  <span className="flex h-2 w-2 rounded-full bg-error/80" />
                  <span className="flex h-2 w-2 rounded-full bg-warning/80" />
                  <span className="flex h-2 w-2 rounded-full bg-success/80" />
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-on-dark-soft">
                  midterm · draft
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-display text-[22px] leading-tight text-on-dark">Algorithms · Spring</p>
                  <p className="text-xs text-on-dark-soft">Q{currentQuestion + 1} of 12 · auto-paced</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-on-dark/10 px-2.5 py-1 text-[11px] font-medium text-on-dark">
                  Draft
                </span>
              </div>

              <div className="rounded-md bg-surface-dark-soft p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded-sm bg-primary/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-primary">
                    {examQuestions[currentQuestion].type}
                  </span>
                  <span className="text-[11px] text-on-dark-soft">Question {currentQuestion + 1}</span>
                </div>
                <p className="text-sm leading-relaxed text-on-dark transition-opacity duration-300">
                  {examQuestions[currentQuestion].text}
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-on-dark/15">
                  <div className="h-full rounded-full bg-primary" style={{ width: '65%' }} />
                </div>
                <span className="font-mono text-[11px] text-on-dark-soft">65%</span>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] text-on-dark-soft">
                <div className="rounded-md bg-surface-dark-elevated px-3 py-2">
                  <div className="text-on-dark font-display text-[18px] leading-none">127</div>
                  <div className="mt-1 uppercase tracking-[0.15em]">graded</div>
                </div>
                <div className="rounded-md bg-surface-dark-elevated px-3 py-2">
                  <div className="text-on-dark font-display text-[18px] leading-none">12</div>
                  <div className="mt-1 uppercase tracking-[0.15em]">in review</div>
                </div>
                <div className="rounded-md bg-surface-dark-elevated px-3 py-2">
                  <div className="text-on-dark font-display text-[18px] leading-none">3</div>
                  <div className="mt-1 uppercase tracking-[0.15em]">flagged</div>
                </div>
              </div>
            </div>

            <div className="absolute -left-6 top-12 hidden rounded-lg border border-hairline bg-canvas p-3.5 shadow-sm xl:block">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/12 text-primary">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </div>
                <div>
                  <div className="font-display text-[18px] leading-none text-ink">94%</div>
                  <div className="text-[11px] uppercase tracking-[0.15em] text-muted">auto-graded</div>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 -bottom-6 hidden rounded-lg border border-hairline bg-canvas p-3.5 shadow-sm xl:block">
              <div className="mb-1.5 flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-teal/15 text-[11px] font-medium text-accent-teal">
                  S
                </div>
                <span className="text-xs font-medium text-ink">Student question</span>
              </div>
              <p className="max-w-[200px] text-xs text-muted">
                "Is the proof in lecture 4 in scope for Q7?"
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
