import { Container, SectionWrapper } from '../ui';

const stats = [
  { label: 'Universities', value: '50+' },
  { label: 'Exams authored', value: '10k' },
  { label: 'Students served', value: '100k' },
  { label: 'Questions graded', value: '5M' },
];

export function StatsSection() {
  return (
    <SectionWrapper background="dark" spacing="md">
      <Container>
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-xs uppercase tracking-[0.15em] text-on-dark-soft">
            By the numbers
          </p>
          <h2 className="font-display text-[36px] leading-tight tracking-[-0.02em] text-on-dark md:text-[44px]">
            Quietly trusted by universities — the kind that don't shout.
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-on-dark-soft/20 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface-dark px-6 py-10">
              <div className="font-display text-[44px] leading-none text-on-dark md:text-[52px]">
                {stat.value}
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.15em] text-on-dark-soft">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}

export default StatsSection;
