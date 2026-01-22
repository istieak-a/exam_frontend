'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Mock exam data - supports two types: 'mcq' or 'short'
const mockExams = {
  'mcq-exam': {
    id: 'mcq-exam',
    type: 'mcq',
    title: 'Data Structures - Multiple Choice Test',
    subject: 'Computer Science',
    duration: 60, // minutes
    totalMarks: 50,
    instructions: [
      'Read all questions carefully before answering',
      'Each question carries equal marks',
      'Once submitted, you cannot change your answers',
      'Results will be shown immediately after submission',
      'You can navigate between questions using the question palette',
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the time complexity of binary search?',
        marks: 10,
        options: [
          { id: 'a', text: 'O(n)' },
          { id: 'b', text: 'O(log n)' },
          { id: 'c', text: 'O(n²)' },
          { id: 'd', text: 'O(1)' },
        ],
        correctAnswer: 'b',
      },
      {
        id: 'q2',
        question: 'Which data structure uses LIFO (Last In First Out) principle?',
        marks: 10,
        options: [
          { id: 'a', text: 'Queue' },
          { id: 'b', text: 'Stack' },
          { id: 'c', text: 'Array' },
          { id: 'd', text: 'Linked List' },
        ],
        correctAnswer: 'b',
      },
      {
        id: 'q3',
        question: 'What is the worst-case time complexity of Quick Sort?',
        marks: 10,
        options: [
          { id: 'a', text: 'O(n log n)' },
          { id: 'b', text: 'O(n²)' },
          { id: 'c', text: 'O(n)' },
          { id: 'd', text: 'O(log n)' },
        ],
        correctAnswer: 'b',
      },
      {
        id: 'q4',
        question: 'In a binary tree, what is the maximum number of nodes at level L?',
        marks: 10,
        options: [
          { id: 'a', text: '2^L' },
          { id: 'b', text: 'L²' },
          { id: 'c', text: '2L' },
          { id: 'd', text: 'L!' },
        ],
        correctAnswer: 'a',
      },
      {
        id: 'q5',
        question: 'Which of the following is NOT a linear data structure?',
        marks: 10,
        options: [
          { id: 'a', text: 'Array' },
          { id: 'b', text: 'Stack' },
          { id: 'c', text: 'Tree' },
          { id: 'd', text: 'Queue' },
        ],
        correctAnswer: 'c',
      },
    ],
  },
  'short-exam': {
    id: 'short-exam',
    type: 'short',
    title: 'Data Structures - Descriptive Exam',
    subject: 'Computer Science',
    duration: 90, // minutes
    totalMarks: 100,
    instructions: [
      'Answer all questions in detail',
      'Each question carries different marks as indicated',
      'Write clearly and provide examples where applicable',
      'Your answers will be reviewed by the teacher',
      'Results will be available once grading is complete',
    ],
    questions: [
      {
        id: 'q1',
        question: 'Explain the difference between an array and a linked list. Provide examples of when you would use each data structure.',
        marks: 20,
        minWords: 100,
      },
      {
        id: 'q2',
        question: 'Describe how a hash table works. Discuss the concept of hash collisions and explain at least two methods to resolve them.',
        marks: 25,
        minWords: 150,
      },
      {
        id: 'q3',
        question: 'What is recursion? Explain with an example and discuss the advantages and disadvantages of using recursion.',
        marks: 20,
        minWords: 100,
      },
      {
        id: 'q4',
        question: 'Compare and contrast Depth-First Search (DFS) and Breadth-First Search (BFS) algorithms. When would you use one over the other?',
        marks: 25,
        minWords: 150,
      },
      {
        id: 'q5',
        question: 'Explain the concept of time complexity and space complexity. Why are they important in algorithm analysis?',
        marks: 10,
        minWords: 80,
      },
    ],
  },
};

// Determine exam type from URL - in real app, fetch from API
const getExamData = (examId) => {
  // For demo: if id contains 'short', return short exam, otherwise MCQ
  if (examId && examId.includes('short')) {
    return mockExams['short-exam'];
  }
  return mockExams['mcq-exam'];
};

export default function TakeExam() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mockExam = getExamData(id);
  const [isLoading, setIsLoading] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(mockExam.duration * 60); // in seconds
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (showInstructions || isLoading) return;

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
  }, [showInstructions, isLoading]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = mockExam.questions[currentQuestionIndex];

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockExam.questions.length - 1) {
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
    navigate('/dashboard/exam-result/' + id);
  }, [answers, id, navigate]);

  const handleSubmit = () => {
    console.log('Submitting exam...', { examType: mockExam.type, answers });
    setShowSubmitConfirm(false);
    navigate('/dashboard/exam-result/' + id + '?type=' + mockExam.type);
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

  if (isLoading) {
    return <PageSkeleton />;
  }

  // Instructions Screen
  if (showInstructions) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200/80">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="material-symbols-outlined text-3xl text-primary">quiz</span>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-slate-900">{mockExam.title}</h1>
            <p className="mt-2 text-slate-600">{mockExam.subject}</p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-slate-50 p-4 text-center">
              <span className="material-symbols-outlined text-2xl text-slate-600">schedule</span>
              <p className="mt-2 text-sm text-slate-600">Duration</p>
              <p className="text-lg font-bold text-slate-900">{mockExam.duration} min</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 text-center">
              <span className="material-symbols-outlined text-2xl text-slate-600">quiz</span>
              <p className="mt-2 text-sm text-slate-600">Questions</p>
              <p className="text-lg font-bold text-slate-900">{mockExam.questions.length}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4 text-center">
              <span className="material-symbols-outlined text-2xl text-slate-600">star</span>
              <p className="mt-2 text-sm text-slate-600">Total Marks</p>
              <p className="text-lg font-bold text-slate-900">{mockExam.totalMarks}</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-900">Instructions</h3>
            <ul className="mt-4 space-y-3">
              {mockExam.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-primary">
                    check_circle
                  </span>
                  <span className="text-slate-700">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex items-center justify-between rounded-lg bg-amber-50 p-4 ring-1 ring-amber-200">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-600">warning</span>
              <span className="text-sm font-medium text-amber-900">
                Once you start, the timer will begin and cannot be paused
              </span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={() => navigate('/dashboard/available-exams')}
              className="flex-1 rounded-lg bg-slate-100 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowInstructions(false)}
              className="flex-1 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Exam Screen
  return (
    <div className="space-y-6">
      {/* Header with Timer */}
      <div className="sticky top-0 z-10 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-slate-200/80">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{mockExam.title}</h1>
            <p className="text-sm text-slate-600">
              Question {currentQuestionIndex + 1} of {mockExam.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-slate-50 px-4 py-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-600">schedule</span>
                <span
                  className={`text-lg font-bold ${
                    timeRemaining < 300 ? 'text-red-600' : 'text-slate-900'
                  }`}
                >
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Question Area */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
            {/* Question Header */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    Question {currentQuestionIndex + 1}
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                    <span className="material-symbols-outlined text-base">star</span>
                    {currentQuestion.marks} marks
                  </span>
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                      mockExam.type === 'mcq'
                        ? 'bg-sky-50 text-sky-700'
                        : 'bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {mockExam.type === 'mcq' ? 'Multiple Choice' : 'Short Answer'}
                  </span>
                </div>
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <p className="text-lg text-slate-900">{currentQuestion.question}</p>
            </div>

            {/* Answer Area */}
            {mockExam.type === 'mcq' ? (
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-all ${
                      answers[currentQuestion.id] === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
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
                    <span className="flex-1 text-slate-900">{option.text}</span>
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
                  className="w-full rounded-lg border-0 bg-slate-50 px-4 py-3 text-slate-900 ring-1 ring-slate-200/80 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-primary"
                />
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                  <span>
                    {currentQuestion.minWords && (
                      <>Minimum {currentQuestion.minWords} words required</>
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
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined">chevron_left</span>
                Previous
              </button>
              {currentQuestionIndex === mockExam.questions.length - 1 ? (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  Submit Exam
                  <span className="material-symbols-outlined">check</span>
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
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
          <div className="sticky top-24 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="mb-4 font-semibold text-slate-900">Question Palette</h3>
            
            <div className="mb-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-emerald-500" />
                <span className="text-slate-600">Answered ({getAnsweredCount()})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded bg-slate-200" />
                <span className="text-slate-600">
                  Not Answered ({mockExam.questions.length - getAnsweredCount()})
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {mockExam.questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => handleQuestionNavigate(index)}
                  className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                    currentQuestionIndex === index
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                      : getQuestionStatus(q.id) === 'answered'
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
              <p className="text-xs text-amber-900">
                Make sure to answer all questions before submitting
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                <span className="material-symbols-outlined text-2xl text-amber-600">
                  warning
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Submit Exam?</h3>
              <p className="mt-2 text-sm text-slate-600">
                You have answered {getAnsweredCount()} out of {mockExam.questions.length}{' '}
                questions. Once submitted, you cannot change your answers.
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
    </div>
  );
}
