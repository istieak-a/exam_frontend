'use client';

import { useState, useEffect } from 'react';

export default function Support() {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    message: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Support request:', formData);
    // Reset form
    setFormData({ subject: '', category: 'general', message: '' });
    // Show success message (in real app)
  };

  const faqItems = [
    {
      question: 'How do I take an exam?',
      answer: 'Go to "Available Exams" from the sidebar, select the exam you want to take, and click "Take Exam". Make sure you have a stable internet connection.',
    },
    {
      question: 'Can I pause an exam and resume later?',
      answer: 'No, once you start an exam, you must complete it in one session. Make sure you have enough time before starting.',
    },
    {
      question: 'When will I receive my grades?',
      answer: 'MCQ questions are graded automatically. Short answer questions are graded by teachers, which may take 2-3 business days.',
    },
    {
      question: 'How do I contact my teacher?',
      answer: 'Use the Chat feature from the sidebar to send messages to your teachers and classmates.',
    },
    {
      question: 'What if I face technical issues during an exam?',
      answer: 'Contact support immediately using this page. Include your exam ID and a description of the issue.',
    },
  ];

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">Help & Support</h1>
        <p className="mt-1 text-sm text-body">
          Get help or submit a support request
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Help */}
          <div className="grid gap-4 sm:grid-cols-3">
            <a
              href="mailto:support@examhub.com"
              className="flex flex-col items-center gap-3 rounded-xl bg-canvas p-6 text-center border border-hairline transition-colors hover:bg-surface-soft"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">mail</span>
              </div>
              <div>
                <p className="font-semibold text-ink">Email Us</p>
                <p className="text-sm text-body">support@examhub.com</p>
              </div>
            </a>

            <a
              href="tel:+1234567890"
              className="flex flex-col items-center gap-3 rounded-xl bg-canvas p-6 text-center border border-hairline transition-colors hover:bg-surface-soft"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-[#2f6e3d]">
                <span className="material-symbols-outlined text-2xl">call</span>
              </div>
              <div>
                <p className="font-semibold text-ink">Call Us</p>
                <p className="text-sm text-body">+1 (234) 567-890</p>
              </div>
            </a>

            <button className="flex flex-col items-center gap-3 rounded-xl bg-canvas p-6 text-center border border-hairline transition-colors hover:bg-surface-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-teal/10 text-accent-teal">
                <span className="material-symbols-outlined text-2xl">chat</span>
              </div>
              <div>
                <p className="font-semibold text-ink">Live Chat</p>
                <p className="text-sm text-body">Start a conversation</p>
              </div>
            </button>
          </div>

          {/* Support Form */}
          <div className="rounded-lg bg-canvas p-6 border border-hairline">
            <h3 className="mb-6 font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">Submit a Request</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-body-strong">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Brief description of your issue"
                  className="mt-1 h-10 w-full rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-body-strong">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 h-10 w-full rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="exam">Exam Related</option>
                  <option value="grading">Grading Issue</option>
                  <option value="account">Account Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-body-strong">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Provide detailed information about your issue..."
                  className="mt-1 h-10 w-full rounded-md border border-hairline bg-canvas px-3.5 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="rounded-lg bg-canvas p-6 border border-hairline">
            <h3 className="mb-6 font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  className="group rounded-lg bg-surface-soft p-4"
                >
                  <summary className="flex cursor-pointer items-start gap-3 font-medium text-ink">
                    <span className="material-symbols-outlined text-primary group-open:rotate-90 transition-transform">
                      chevron_right
                    </span>
                    <span className="flex-1">{item.question}</span>
                  </summary>
                  <p className="mt-3 pl-8 text-sm text-body">{item.answer}</p>
                </details>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-primary/5 p-4">
              <p className="text-sm text-body-strong">
                <strong>Response Time:</strong> We typically respond within 24 hours on business days.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 rounded bg-hairline animate-pulse" />
        <div className="mt-2 h-4 w-64 rounded bg-hairline animate-pulse" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-xl bg-hairline animate-pulse" />
            ))}
          </div>
          <div className="h-[500px] rounded-lg bg-hairline animate-pulse" />
        </div>
        <div className="h-[700px] rounded-lg bg-hairline animate-pulse" />
      </div>
    </div>
  );
}
