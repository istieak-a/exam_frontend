import { Badge, Container, SectionWrapper } from '../components/ui';

function About() {
  return (
    <>
      <SectionWrapper background="canvas" spacing="md" className="pt-28">
        <Container size="narrow">
          <Badge variant="coral" size="md" className="mb-7">
            About
          </Badge>
          <h1 className="font-display text-[44px] leading-[1.05] tracking-[-0.025em] text-ink md:text-[56px]">
            A platform written like a long essay, not a spec sheet.
          </h1>
          <p className="mt-7 max-w-2xl text-[17px] leading-relaxed text-body">
            ExamHub started as a question: what would the exam workflow look like if every screen tried to read like a
            considered editorial, and every interaction tried to be as quiet as possible? This is what we came back with.
          </p>
        </Container>
      </SectionWrapper>

      <SectionWrapper background="soft" spacing="sm">
        <Container size="narrow">
          <div className="prose max-w-none">
            <h2 className="font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">
              Three things we kept saying
            </h2>
            <div className="mt-8 space-y-8 border-t border-hairline pt-8">
              <article>
                <h3 className="font-display text-[22px] leading-snug tracking-[-0.015em] text-ink">
                  The page is the product.
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-body">
                  Every screen earns its existence. The chrome is small. The type is generous. Nothing flashes or
                  pulses unless a student is genuinely meant to look at it.
                </p>
              </article>
              <article>
                <h3 className="font-display text-[22px] leading-snug tracking-[-0.015em] text-ink">
                  The student is the reader.
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-body">
                  Exam-taking is a reading exercise as much as it is a writing exercise. The page lets the question be
                  the most important thing in the room.
                </p>
              </article>
              <article>
                <h3 className="font-display text-[22px] leading-snug tracking-[-0.015em] text-ink">
                  The teacher is the author.
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-body">
                  Writing an exam should feel like writing. Not assembling. Not configuring. The editor is one page, in
                  one font, with a save indicator that genuinely saves.
                </p>
              </article>
            </div>
          </div>
        </Container>
      </SectionWrapper>
    </>
  );
}

export default About;
