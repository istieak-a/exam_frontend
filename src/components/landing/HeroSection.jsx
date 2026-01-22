import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { Badge } from '../ui';

export function HeroSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const examQuestions = [
    { type: 'MCQ', text: 'What is the capital of France?' },
    { type: 'Essay', text: 'Explain photosynthesis...' },
    { type: 'True/False', text: 'The Earth is flat.' },
  ];

  const questionsCount = examQuestions.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestion((prev) => (prev + 1) % questionsCount);
    }, 3000);
    return () => clearInterval(interval);
  }, [questionsCount]);

  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Full Viewport Background - extends from top of page */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background-light to-accent/5 -z-10"></div>
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-1/4 left-1/4 animate-float opacity-20">
          <svg className="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14l9-5-9-5-9 5 9 5z"/>
            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
          </svg>
        </div>
        <div className="absolute bottom-1/3 right-1/4 animate-float opacity-20" style={{ animationDelay: '1s' }}>
          <svg className="w-12 h-12 text-accent" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-h-[calc(100vh-5rem)]">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-12rem)] py-12">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <Badge variant="primary" pulse className="mb-6">
              🎓 Modern Exam Platform
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-light-primary leading-tight mb-6">
              Modernize <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">University Exams</span>
              <br className="hidden sm:inline" />
              with Ease
            </h1>
            
            <p className="text-lg sm:text-xl text-text-light-secondary mb-8 max-w-xl mx-auto lg:mx-0">
              A complete digital exam management system. Create exams, auto-grade answers, 
              and connect with students in real-time. No paperwork, no hassle.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-8 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-text-light-primary">50+</div>
                <div className="text-sm text-text-light-muted">Universities</div>
              </div>
              <div className="w-px h-10 bg-border-light"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-light-primary">10K+</div>
                <div className="text-sm text-text-light-muted">Exams Created</div>
              </div>
              <div className="w-px h-10 bg-border-light"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-text-light-primary">99.9%</div>
                <div className="text-sm text-text-light-muted">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Content - Exam Dashboard Preview */}
          <div className="relative hidden lg:block">
            <div className="relative z-10">
              {/* Main Dashboard Card */}
              <div className="bg-white rounded-2xl shadow-2xl border border-border-light p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-light-primary">Create Exam</h3>
                      <p className="text-sm text-text-light-muted">Midterm 2026</p>
                    </div>
                  </div>
                  <Badge variant="success">Draft</Badge>
                </div>

                {/* Question Preview */}
                <div className="bg-background-light rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded">
                      {examQuestions[currentQuestion].type}
                    </span>
                    <span className="text-xs text-text-light-muted">Question {currentQuestion + 1}</span>
                  </div>
                  <p className="text-text-light-primary font-medium transition-all duration-300">
                    {examQuestions[currentQuestion].text}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-text-light-muted">65%</span>
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -left-8 top-1/2 bg-white rounded-xl shadow-lg border border-border-light p-4 transform -translate-y-1/2 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-text-light-primary">127</div>
                    <div className="text-xs text-text-light-muted">Auto-graded</div>
                  </div>
                </div>
              </div>

              {/* Floating Chat Card */}
              <div className="absolute -right-4 bottom-8 bg-white rounded-xl shadow-lg border border-border-light p-4 animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-white text-xs font-bold">S</div>
                  <span className="text-sm font-medium text-text-light-primary">Student Question</span>
                </div>
                <p className="text-xs text-text-light-muted">"When is the deadline?"</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-24 text-white" viewBox="0 0 1440 100" fill="currentColor" preserveAspectRatio="none">
          <path d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"></path>
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;
