'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamById, submitExam, parseExamResponse } from '../../services/examService';

// Default exam instructions when none provided by backend
const defaultInstructions = [
  'Read all questions carefully before answering',
  'Each question carries the marks shown',
  'Once submitted, you cannot change your answers',
  'Results will be available based on your teacher\'s review process',
  'You can navigate between questions using the question palette',
];

export default function TakeExam() {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  
  // State for exam data
  const [exam, setExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for exam taking
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch exam data on component mount
  useEffect(() => {
    const fetchExam = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const examData = await getExamById(examId, { includeQuestions: true });
        const parsedExam = parseExamResponse(examData);
        
        if (!parsedExam) {
          throw new Error('Exam not found');
        }
        
        // Check if exam is available to take
        if (parsedExam.status !== 'active' && parsedExam.status !== 'published') {
          throw new Error('This exam is not currently available');
        }
        
        setExam(parsedExam);
        setTimeRemaining((parsedExam.duration || 60) * 60); // Convert minutes to seconds
        
      } catch (err) {
        console.error('Failed to fetch exam:', err);
        setError(err.message || 'Failed to load exam');
      } finally {
        setIsLoading(false);
      }
    };

    if (examId) {
      fetchExam();
    } else {
      setError('No exam ID provided');
      setIsLoading(false);
    }
  }, [examId]);

  // Countdown timer
  useEffect(() => {
    if (showInstructions || isLoading || !exam) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showInstructions, isLoading, exam]);

  // Format exam questions for component use
  const formattedQuestions = exam?.questions?.map((q, index) => ({
    id: q.id || `q${index + 1}`,
    question: q.questionText || q.question,
    marks: q.marks,
    type: q.type?.toLowerCase() || exam.examType?.toLowerCase() || 'mcq',
    options: q.type?.toLowerCase() === 'mcq' ? 
      (q.options?.map((opt, i) => ({ id: String.fromCharCode(97 + i), text: opt })) || []) : 
      undefined,
    correctAnswer: q.correctAnswer, // This won't be used in the taking interface
    minWords: q.minWords || 50 // Default minimum words for CQ questions
  })) || [];

  const examInstructions = exam?.instructions || defaultInstructions;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = formattedQuestions[currentQuestionIndex];

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < formattedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionNavigate = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleAutoSubmit = useCallback(() => {
    console.log('Time up! Auto-submitting exam...', answers);
    handleSubmit();
  }, [answers, examId]);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setShowSubmitConfirm(false);
      
      // Format answers for submission - backend expects just Map<String, String>
      const formattedAnswers = {};
      Object.entries(answers).forEach(([questionId, answer]) => {
        // Ensure answer is a string
        formattedAnswers[questionId] = String(answer || '');
      });

      console.log('Submitting exam answers...', formattedAnswers);
      
      // Submit to backend - just send the answers map
      await submitExam(examId, formattedAnswers);
      
      // Navigate to result page
      navigate(`/dashboard/exam-result/${examId}?type=${exam.examType?.toLowerCase() || 'mcq'}`);
      
    } catch (err) {
      console.error('Failed to submit exam:', err);
      setError('Failed to submit exam. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuestionStatus = (questionId) => {
    if (answers[questionId]) {
      return 'answered';
    }
    return 'unanswered';
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-body">Loading exam...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !exam) {
    return (
      <div className="rounded-lg bg-canvas p-8 border border-hairline text-center">
        <span className="material-symbols-outlined mx-auto text-6xl text-red-300">error</span>
        <h3 className="mt-4 font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">Error Loading Exam</h3>
        <p className="mt-2 text-sm text-body">{error || 'Exam not found'}</p>
        <button
          onClick={() => navigate('/dashboard/available-exams')}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
        >
          Back to Available Exams
        </button>
      </div>
    );
  }

  // Instructions Screen
  if (showInstructions) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-lg bg-canvas p-8 border border-hairline">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-3xl text-primary">quiz</span>
            </div>
            <h1 className="mt-4 font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">{exam.title}</h1>
            <p className="mt-2 text-body">{exam.course}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-surface-soft p-4 text-center">
              <span className="material-symbols-outlined text-2xl text-body">schedule</span>
              <p className="mt-2 text-sm text-body">Duration</p>
              <p className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">{exam.duration} min</p>
            </div>
            <div className="rounded-lg bg-surface-soft p-4 text-center">
              <span className="material-symbols-outlined text-2xl text-body">quiz</span>
              <p className="mt-2 text-sm text-body">Questions</p>
              <p className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">{formattedQuestions.length}</p>
            </div>
            <div className="rounded-lg bg-surface-soft p-4 text-center">
              <span className="material-symbols-outlined text-2xl text-body">star</span>
              <p className="mt-2 text-sm text-body">Total Marks</p>
              <p className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">{exam.totalMarks}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">Instructions</h3>
            <ul className="mt-4 space-y-3">
              {examInstructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-primary">
                    check_circle
                  </span>
                  <span className="text-body-strong">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-lg bg-warning/10 p-4 border border-warning/30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#7a5a0e]">warning</span>
              <span className="text-sm font-medium text-[#7a5a0e]">
                Once you start, the timer will begin and cannot be paused
              </span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => navigate('/dashboard/available-exams')}
              className="flex-1 rounded-lg bg-surface-card px-6 py-3 text-sm font-medium text-body-strong transition-colors hover:bg-hairline"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowInstructions(false)}
              className="flex-1 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If no questions available
  if (!currentQuestion) {
    return (
      <div className="rounded-lg bg-canvas p-8 border border-hairline text-center">
        <span className="material-symbols-outlined mx-auto text-6xl text-muted-soft">quiz</span>
        <h3 className="mt-4 font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">No Questions Available</h3>
        <p className="mt-2 text-sm text-body">This exam doesn't have any questions yet.</p>
        <button
          onClick={() => navigate('/dashboard/available-exams')}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
        >
          Back to Available Exams
        </button>
      </div>
    );
  }

  // Exam Screen
  return (
    <div className="space-y-6">
      {/* Header with Timer */}
      <div className="sticky top-0 z-10 rounded-lg border border-hairline bg-canvas/95 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">{exam.title}</h1>
            <p className="text-sm text-body">
              Question {currentQuestionIndex + 1} of {formattedQuestions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-surface-soft px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-body">schedule</span>
                <span
                  className={`text-lg font-bold ${
                    timeRemaining < 300 ? 'text-[#8a3636]' : 'text-ink'
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowSubmitConfirm(true)}
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Question Area */}
        <div className="lg:col-span-3">
          <div className="rounded-lg bg-canvas p-6 border border-hairline">
            {/* Question Header */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-body">
                    <span className="material-symbols-outlined text-base">star</span>
                    {currentQuestion.marks} marks
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                      currentQuestion.type === 'mcq'
                        ? 'bg-accent-teal/10 text-accent-teal'
                        : 'bg-success/10 text-[#2f6e3d]'
                    }`}
                  >
                    {currentQuestion.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <p className="text-lg text-ink">{currentQuestion.question}</p>
            </div>

            {/* Answer Area */}
            {currentQuestion.type === 'mcq' ? (
              <div className="space-y-3">
                {currentQuestion.options?.map((option) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                      answers[currentQuestion.id] === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-hairline hover:border-hairline hover:bg-surface-soft'
                    }`}
                  >
                    <input
                      type="radio"
                      name={currentQuestion.id}
                      value={option.id}
                      checked={answers[currentQuestion.id] === option.id}
                      onChange={(e) =>
                        handleAnswerChange(currentQuestion.id, e.target.value)
                      }
                      className="h-5 w-5 text-primary"
                    />
                    <span className="flex-1 text-ink">{option.text}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div>
                <textarea
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                  placeholder="Type your answer here..."
                  rows={8}
                  className="w-full rounded-md border border-hairline bg-canvas px-3.5 py-3 text-ink placeholder:text-muted-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <div className="mt-2 flex items-center justify-between text-sm text-body">
                  <span>
                    {currentQuestion.minWords && (
                      <>Minimum {currentQuestion.minWords} words recommended</>
                    )}
                  </span>
                  <span>
                    {answers[currentQuestion.id]
                      ? answers[currentQuestion.id].split(/\s+/).filter(Boolean).length
                      : 0}{' '}
                    words
                  </span>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center gap-2 rounded-lg bg-surface-card px-4 py-2.5 text-sm font-medium text-body-strong transition-colors hover:bg-hairline disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined">chevron_left</span>
                Previous
              </button>
              {currentQuestionIndex === formattedQuestions.length - 1 ? (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                  <span className="material-symbols-outlined">check</span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
                >
                  Save & Next
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Palette */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg bg-canvas p-4 border border-hairline">
            <h3 className="mb-4 font-semibold text-ink">Question Palette</h3>
            
            <div className="mb-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-success" />
                <span className="text-body">Answered ({getAnsweredCount()})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-hairline" />
                <span className="text-body">
                  Not Answered ({formattedQuestions.length - getAnsweredCount()})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {formattedQuestions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => handleQuestionNavigate(index)}
                  className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                    currentQuestionIndex === index
                      ? 'bg-primary text-on-primary ring-2 ring-primary ring-offset-2'
                      : getQuestionStatus(q.id) === 'answered'
                      ? 'bg-success text-on-primary hover:bg-success/90'
                      : 'bg-surface-card text-body-strong hover:bg-hairline'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-warning/10 p-3 border border-warning/30">
              <p className="text-xs text-[#7a5a0e]">
                Make sure to answer all questions before submitting
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-w-md rounded-lg bg-canvas p-6 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning/15">
                <span className="material-symbols-outlined text-2xl text-[#7a5a0e]">
                  warning
                </span>
              </div>
              <h3 className="mt-4 font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">Submit Exam?</h3>
              <p className="mt-2 text-sm text-body">
                You have answered {getAnsweredCount()} out of {formattedQuestions.length}{' '}
                questions. Once submitted, you cannot change your answers.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-surface-card px-4 py-2.5 text-sm font-medium text-body-strong transition-colors hover:bg-hairline disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}