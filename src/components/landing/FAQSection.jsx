import { useState } from 'react';
import { Container, SectionHeader, SectionWrapper } from '../ui';

const faqs = [
  {
    question: 'How do I get started with ExamHub?',
    answer:
      'Sign up, open the editor, write the first question. Invite students by email or link. No setup call, no onboarding wizard — the editor is the onboarding.',
  },
  {
    question: 'What kinds of questions can I author?',
    answer:
      'Multiple choice, true/false, short answer, and essay. They mix freely inside the same exam, and each one is rendered as if it were the only question on the page.',
  },
  {
    question: 'How does the auto-grading actually work?',
    answer:
      'MCQ and true/false are graded the second a student submits. Short answers grade against either an exact match or a small set of accepted keywords. Essays are graded by you, in a side-by-side reader with rubric anchors.',
  },
  {
    question: 'Is exam data kept private?',
    answer:
      'Transport is TLS; storage is encrypted at rest. Submissions are scoped to the course staff that owns the exam. No model training, no third-party analytics.',
  },
  {
    question: 'Does it work on phones and tablets?',
    answer:
      'Yes — the student-facing surface is mobile-first. The teacher-facing editor is desktop-first by design; writing exams reads more like writing a document than tapping through a form.',
  },
  {
    question: 'What does the chat feature give you?',
    answer:
      'A permanent thread per student per exam. Teachers post clarifications; students post regrade requests. Everything stays attached to the exam record.',
  },
  {
    question: 'Is there a free tier?',
    answer:
      'Yes. Free for individual instructors, with a generous student cap. Departments and universities are on usage-based pricing — talk to us.',
  },
  {
    question: 'Can I export results?',
    answer:
      'CSV for grades, PDF for individual submissions. Most existing LMS systems pick up the CSV without further work.',
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-hairline last:border-none">
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-start justify-between gap-6 py-6 text-left"
      >
        <span className="font-display text-[20px] leading-snug tracking-[-0.015em] text-ink md:text-[22px]">
          {faq.question}
        </span>
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-hairline text-ink transition-transform duration-200 ${
            isOpen ? 'rotate-180 border-primary text-primary' : ''
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-[max-height,padding] duration-200 ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0 pb-0'
        }`}
      >
        <p className="max-w-3xl text-[15px] leading-relaxed text-body">{faq.answer}</p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SectionWrapper background="canvas" id="faq">
      <Container size="narrow">
        <SectionHeader
          badge="FAQ"
          title="Questions we've been asked enough to answer here."
          subtitle="If yours isn't on the list, the support inbox is genuinely staffed."
        />

        <div className="border-t border-hairline">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.question}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="mb-3 text-sm text-muted">Still have questions?</p>
          <a
            href="mailto:support@examhub.com"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact support
          </a>
        </div>
      </Container>
    </SectionWrapper>
  );
}

export default FAQSection;
