import { useState } from 'react';
import { SectionWrapper, Container, SectionHeader } from '../ui';

const steps = [
  {
    number: '01',
    title: 'Create Your Exam',
    description: 'Design exams with multiple question types. Add MCQs, essays, true/false questions. Set time limits and deadlines.',
    icon: (
      <svg className="w-full h-full p-4" viewBox="0 0 80 80" fill="none">
        <rect x="15" y="10" width="50" height="60" rx="4" stroke="currentColor" strokeWidth="2" className="text-primary" />
        <line x1="25" y1="25" x2="55" y2="25" stroke="currentColor" strokeWidth="2" className="text-primary/60" />
        <line x1="25" y1="35" x2="45" y2="35" stroke="currentColor" strokeWidth="2" className="text-primary/60" />
        <circle cx="28" cy="48" r="4" fill="currentColor" className="text-accent" />
        <line x1="36" y1="48" x2="55" y2="48" stroke="currentColor" strokeWidth="2" className="text-primary/60" />
        <circle cx="28" cy="58" r="4" stroke="currentColor" strokeWidth="2" className="text-primary/40" />
        <line x1="36" y1="58" x2="50" y2="58" stroke="currentColor" strokeWidth="2" className="text-primary/60" />
      </svg>
    ),
    features: ['Multiple question types', 'Time limits', 'Question bank'],
    gradient: 'from-primary to-primary-dark',
  },
  {
    number: '02',
    title: 'Students Take Exam',
    description: 'Students access exams online from any device. Clean interface, auto-save answers, and real-time progress tracking.',
    icon: (
      <svg className="w-full h-full p-4" viewBox="0 0 80 80" fill="none">
        <rect x="20" y="8" width="40" height="64" rx="6" stroke="currentColor" strokeWidth="2" className="text-secondary" />
        <rect x="28" y="20" width="24" height="4" rx="1" fill="currentColor" className="text-secondary/40" />
        <circle cx="32" cy="36" r="3" fill="currentColor" className="text-accent" />
        <rect x="40" y="34" width="12" height="4" rx="1" fill="currentColor" className="text-secondary/40" />
        <circle cx="32" cy="48" r="3" stroke="currentColor" strokeWidth="2" className="text-secondary/60" />
        <rect x="40" y="46" width="12" height="4" rx="1" fill="currentColor" className="text-secondary/40" />
        <rect x="26" y="58" width="28" height="8" rx="2" fill="currentColor" className="text-accent" />
      </svg>
    ),
    features: ['Mobile friendly', 'Auto-save', 'Timer display'],
    gradient: 'from-secondary to-secondary-dark',
  },
  {
    number: '03',
    title: 'Auto-Grade & Review',
    description: 'MCQs are graded instantly. Review essay answers, provide feedback, and publish results with one click.',
    icon: (
      <svg className="w-full h-full p-4" viewBox="0 0 80 80" fill="none">
        <path d="M20 40 L35 55 L60 25" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-accent" />
        <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="2" className="text-accent/30" />
        <circle cx="40" cy="40" r="24" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-accent/20" />
      </svg>
    ),
    features: ['Instant grading', 'Feedback system', 'One-click publish'],
    gradient: 'from-accent to-accent-dark',
  },
];

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <SectionWrapper background="gradient" id="how-it-works">
      <Container>
        <SectionHeader
          badge="📋 How It Works"
          title="Simple 3-Step Process"
          subtitle="Get started in minutes. Our intuitive platform makes exam management effortless for everyone."
        />

        {/* Desktop View */}
        <div className="hidden lg:block">
          {/* Step Numbers */}
          <div className="flex justify-between items-center mb-12 max-w-5xl mx-auto relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-border-light -translate-y-1/2 z-0">
              <div 
                className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-500"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`
                  relative z-10 w-16 h-16 rounded-full flex items-center justify-center font-bold text-lg
                  transition-all duration-300 cursor-pointer
                  ${index <= activeStep 
                    ? 'bg-gradient-to-br ' + step.gradient + ' text-white shadow-lg scale-110' 
                    : 'bg-white text-text-light-muted border-2 border-border-light hover:border-primary/30'
                  }
                `}
              >
                {step.number}
              </button>
            ))}
          </div>

          {/* Step Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Icon */}
            <div className="flex justify-center">
              <div className={`w-64 h-64 rounded-3xl bg-gradient-to-br ${steps[activeStep].gradient} p-1`}>
                <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center text-primary">
                  {steps[activeStep].icon}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center lg:text-left">
              <span className={`inline-block text-6xl font-bold bg-gradient-to-r ${steps[activeStep].gradient} bg-clip-text text-transparent mb-4`}>
                {steps[activeStep].number}
              </span>
              <h3 className="text-3xl font-bold text-text-light-primary mb-4">
                {steps[activeStep].title}
              </h3>
              <p className="text-lg text-text-light-secondary mb-6">
                {steps[activeStep].description}
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {steps[activeStep].features.map((feature, idx) => (
                  <span 
                    key={idx}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 bottom-0 w-0.5 bg-border-light">
                  <div className="w-full bg-gradient-to-b from-primary to-accent h-full"></div>
                </div>
              )}

              <div className="flex gap-6">
                <div className={`w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-lg bg-gradient-to-br ${step.gradient} text-white shadow-lg`}>
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-light-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-text-light-secondary mb-4">
                    {step.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
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
