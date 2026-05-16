import { Card, Container, IconBox, SectionHeader, SectionWrapper } from '../ui';

const features = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Auto-grading, where it earns the trust',
    description:
      'MCQ, true/false, and short-answer questions grade instantly. Free response goes to the human — with the right rubric pre-loaded.',
    variant: 'primary',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Conversations that go on the record',
    description:
      'In-app threads between teacher and student. Clarifications, regrade requests, and a permanent record — no inbox archaeology.',
    variant: 'teal',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: 'A question type for every kind of thinking',
    description:
      'MCQ, true/false, short answer, essay. Each one rendered as if it were the only thing on the page.',
    variant: 'amber',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Feedback that lands on the same day',
    description:
      'Auto-graded sections post immediately. Essay grading is two clicks per question, with rubric anchors that move fast.',
    variant: 'primary',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Quiet integrity',
    description:
      'Time windows, paste-detection, and tab tracking are on by default. Students get to feel like students, not suspects.',
    variant: 'teal',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
    ),
    title: 'Analytics in the margins',
    description:
      'A small set of well-chosen charts: question difficulty, cohort drift, time-on-question. The ones that change how you teach.',
    variant: 'amber',
  },
];

export function FeaturesSection() {
  return (
    <SectionWrapper background="soft" id="features">
      <Container>
        <SectionHeader
          badge="Features"
          title="Everything an exam needs. Nothing it doesn't."
          subtitle="Six considered surfaces. Each one is opinionated, fast, and quietly built around how teaching actually happens."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {features.map((feature) => (
            <Card key={feature.title} variant="cream" padding="default">
              <IconBox icon={feature.icon} variant={feature.variant} size="md" className="mb-6" />
              <h3 className="font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">
                {feature.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-body">{feature.description}</p>
            </Card>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}

export default FeaturesSection;
