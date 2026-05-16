import { Badge, Container, SectionHeader, SectionWrapper } from '../ui';

const steps = [
  {
    number: '01',
    title: 'Write the exam like a long letter.',
    description:
      'Compose questions in one quiet editor. Switch between MCQ, true/false, short answer, and essay without ever changing tools. Set a window, set a length, save a draft.',
    tags: ['Multi-type editor', 'Time windows', 'Question bank'],
  },
  {
    number: '02',
    title: 'Students sit the exam without ceremony.',
    description:
      'A single page, an honest timer, a save indicator that genuinely saves. Phone, tablet, laptop — the page reads the same. Auto-resume on accidental tab-close.',
    tags: ['Mobile-first', 'Auto-save', 'Honest timer'],
  },
  {
    number: '03',
    title: 'Grade what needs a human, publish the rest.',
    description:
      'The objective questions are graded by the time the student stands up. Essay grading happens in a side-by-side reader with rubric anchors and per-question notes.',
    tags: ['Instant objective', 'Rubric-led essays', 'One-click publish'],
  },
];

export function HowItWorksSection() {
  return (
    <SectionWrapper background="canvas" id="how-it-works">
      <Container>
        <SectionHeader
          badge="How it works"
          title="Three steps. None of them ceremonious."
          subtitle="The platform stays out of the way. The exam is the thing — the workflow around it shouldn't need explaining."
        />

        <div className="mt-4 divide-y divide-hairline border-t border-hairline">
          {steps.map((step) => (
            <div
              key={step.number}
              className="grid grid-cols-1 gap-6 py-10 md:grid-cols-12 md:gap-10 md:py-14"
            >
              <div className="md:col-span-3">
                <div className="font-display text-[64px] leading-none text-primary md:text-[80px]">
                  {step.number}
                </div>
              </div>
              <div className="md:col-span-9">
                <h3 className="font-display text-[28px] leading-tight tracking-[-0.02em] text-ink md:text-[32px]">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-body">
                  {step.description}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {step.tags.map((tag) => (
                    <Badge key={tag} variant="pill" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}

export default HowItWorksSection;
