import { useState } from 'react';
import { SectionWrapper, Container, SectionHeader } from '../ui';

const faqs = [
  {
    question: 'How do I get started with ExamHub?',
    answer: 'Getting started is easy! Simply sign up for a free account, create your first exam using our intuitive editor, and invite students via email or a shareable link. No technical expertise required.',
  },
  {
    question: 'What types of questions can I create?',
    answer: 'ExamHub supports multiple question types including Multiple Choice (MCQ), True/False, Short Answer, and Essay questions. You can mix different types within a single exam to create comprehensive assessments.',
  },
  {
    question: 'How does auto-grading work?',
    answer: 'Multiple Choice and True/False questions are graded instantly and automatically. For short answers, you can set accepted answers or keywords. Essay questions require manual grading, but our interface makes it quick and easy.',
  },
  {
    question: 'Is my exam data secure?',
    answer: 'Absolutely. We use industry-standard encryption for all data transmission and storage. Exam submissions are securely stored, and we implement anti-cheating measures like time limits and question randomization.',
  },
  {
    question: 'Can students access exams on mobile devices?',
    answer: 'Yes! ExamHub is fully responsive and works seamlessly on desktops, tablets, and smartphones. Students can take exams from any device with an internet connection.',
  },
  {
    question: 'How does the real-time chat feature work?',
    answer: 'Teachers and students can communicate through built-in messaging. Teachers can make announcements, students can ask questions, and everyone stays connected during the exam process.',
  },
  {
    question: 'Is there a free plan available?',
    answer: 'Yes! We offer a free plan for individual educators with essential features. For departments and universities, we have flexible pricing plans based on the number of students and exams.',
  },
  {
    question: 'Can I export exam results?',
    answer: 'Yes, you can export all exam results and analytics in CSV or PDF format. This makes it easy to integrate with your existing grade management systems.',
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-border-light last:border-none">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-center justify-between text-left group cursor-pointer"
      >
        <span className="text-lg font-semibold text-text-light-primary group-hover:text-primary transition-colors pr-8">
          {faq.question}
        </span>
        <span className={`
          flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
          transition-all duration-300
          ${isOpen 
            ? 'bg-primary text-white rotate-180' 
            : 'bg-primary/10 text-primary group-hover:bg-primary/20'
          }
        `}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div 
        className={`
          overflow-hidden transition-all duration-300
          ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}
        `}
      >
        <p className="text-text-light-secondary leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SectionWrapper background="light" id="faq">
      <Container size="small">
        <SectionHeader
          badge="❓ FAQ"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about ExamHub. Can't find your answer? Contact our support team."
        />

        <div className="bg-white rounded-2xl border border-border-light shadow-sm p-2 md:p-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-text-light-secondary mb-4">
            Still have questions?
          </p>
          <a 
            href="mailto:support@examhub.com"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact Support
          </a>
        </div>
      </Container>
    </SectionWrapper>
  );
}

export default FAQSection;
