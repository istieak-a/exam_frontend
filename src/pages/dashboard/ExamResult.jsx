'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getMySubmissionForExam, getExamById, parseExamResponse } from '../../services/examService';

// Mock exam result data - two types
const mockResults = {
  'exam-101': {
    id: 'exam-101',
    type: 'mcq',
    examTitle: 'Python Programming - MCQ',
    subject: 'Computer Science',
    submittedAt: '2026-01-18T14:30:00',
    totalMarks: 80,
    obtainedMarks: 68,
    percentage: 85,
    status: 'passed',
    duration: 55, // minutes taken
    totalQuestions: 8,
    correctAnswers: 7,
    incorrectAnswers: 1,
    questions: [
      {
        id: 'q1',
        question: 'What is the output of: print(type([]))?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'b',
        correctAnswer: 'b',
        options: [
          { id: 'a', text: '<class \'tuple\'>' },
          { id: 'b', text: '<class \'list\'>' },
          { id: 'c', text: '<class \'dict\'>' },
          { id: 'd', text: '<class \'set\'>' },
        ],
        status: 'correct',
      },
      {
        id: 'q2',
        question: 'Which keyword is used to define a function in Python?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'c',
        correctAnswer: 'c',
        options: [
          { id: 'a', text: 'function' },
          { id: 'b', text: 'func' },
          { id: 'c', text: 'def' },
          { id: 'd', text: 'define' },
        ],
        status: 'correct',
      },
      {
        id: 'q3',
        question: 'What is the correct way to create a dictionary in Python?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'a',
        correctAnswer: 'a',
        options: [
          { id: 'a', text: '{\'key\': \'value\'}' },
          { id: 'b', text: '[\'key\', \'value\']' },
          { id: 'c', text: '(\'key\', \'value\')' },
          { id: 'd', text: '<\'key\', \'value\'>' },
        ],
        status: 'correct',
      },
      {
        id: 'q4',
        question: 'Which method is used to add an element to the end of a list?',
        marks: 10,
        obtainedMarks: 0,
        userAnswer: 'b',
        correctAnswer: 'a',
        options: [
          { id: 'a', text: 'append()' },
          { id: 'b', text: 'add()' },
          { id: 'c', text: 'insert()' },
          { id: 'd', text: 'extend()' },
        ],
        status: 'incorrect',
      },
      {
        id: 'q5',
        question: 'What does the len() function return?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'b',
        correctAnswer: 'b',
        options: [
          { id: 'a', text: 'The type of an object' },
          { id: 'b', text: 'The length of an object' },
          { id: 'c', text: 'The value of an object' },
          { id: 'd', text: 'The id of an object' },
        ],
        status: 'correct',
      },
      {
        id: 'q6',
        question: 'Which operator is used for floor division in Python?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'd',
        correctAnswer: 'd',
        options: [
          { id: 'a', text: '/' },
          { id: 'b', text: '%' },
          { id: 'c', text: '//' },
          { id: 'd', text: '//' },
        ],
        status: 'correct',
      },
      {
        id: 'q7',
        question: 'What is the output of: print(3 ** 2)?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'c',
        correctAnswer: 'c',
        options: [
          { id: 'a', text: '6' },
          { id: 'b', text: '5' },
          { id: 'c', text: '9' },
          { id: 'd', text: '8' },
        ],
        status: 'correct',
      },
      {
        id: 'q8',
        question: 'Which of these is a mutable data type in Python?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'b',
        correctAnswer: 'b',
        options: [
          { id: 'a', text: 'Tuple' },
          { id: 'b', text: 'List' },
          { id: 'c', text: 'String' },
          { id: 'd', text: 'Integer' },
        ],
        status: 'correct',
      },
    ],
  },
  'exam-103': {
    id: 'exam-103',
    type: 'mcq',
    examTitle: 'Algorithm Analysis - MCQ',
    subject: 'Computer Science',
    submittedAt: '2026-01-10T14:30:00',
    totalMarks: 120,
    obtainedMarks: 98,
    percentage: 82,
    status: 'passed',
    duration: 70, // minutes taken
    totalQuestions: 12,
    correctAnswers: 10,
    incorrectAnswers: 2,
    questions: [
      {
        id: 'q1',
        question: 'What is the best-case time complexity of Bubble Sort?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'a',
        correctAnswer: 'a',
        options: [
          { id: 'a', text: 'O(n)' },
          { id: 'b', text: 'O(n log n)' },
          { id: 'c', text: 'O(n²)' },
          { id: 'd', text: 'O(log n)' },
        ],
        status: 'correct',
      },
      {
        id: 'q2',
        question: 'Which sorting algorithm is most efficient for small datasets?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'd',
        correctAnswer: 'd',
        options: [
          { id: 'a', text: 'Merge Sort' },
          { id: 'b', text: 'Quick Sort' },
          { id: 'c', text: 'Heap Sort' },
          { id: 'd', text: 'Insertion Sort' },
        ],
        status: 'correct',
      },
      {
        id: 'q3',
        question: 'What is the space complexity of Merge Sort?',
        marks: 10,
        obtainedMarks: 0,
        userAnswer: 'c',
        correctAnswer: 'a',
        options: [
          { id: 'a', text: 'O(n)' },
          { id: 'b', text: 'O(log n)' },
          { id: 'c', text: 'O(1)' },
          { id: 'd', text: 'O(n²)' },
        ],
        status: 'incorrect',
      },
      {
        id: 'q4',
        question: 'Which data structure is best for implementing a priority queue?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'c',
        correctAnswer: 'c',
        options: [
          { id: 'a', text: 'Array' },
          { id: 'b', text: 'Linked List' },
          { id: 'c', text: 'Heap' },
          { id: 'd', text: 'Stack' },
        ],
        status: 'correct',
      },
      {
        id: 'q5',
        question: 'What is the average time complexity of Hash Table lookup?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'a',
        correctAnswer: 'a',
        options: [
          { id: 'a', text: 'O(1)' },
          { id: 'b', text: 'O(log n)' },
          { id: 'c', text: 'O(n)' },
          { id: 'd', text: 'O(n log n)' },
        ],
        status: 'correct',
      },
      {
        id: 'q6',
        question: 'Which algorithm uses divide and conquer strategy?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'b',
        correctAnswer: 'b',
        options: [
          { id: 'a', text: 'Bubble Sort' },
          { id: 'b', text: 'Merge Sort' },
          { id: 'c', text: 'Selection Sort' },
          { id: 'd', text: 'Insertion Sort' },
        ],
        status: 'correct',
      },
      {
        id: 'q7',
        question: 'What is the time complexity of accessing an element in an array by index?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'd',
        correctAnswer: 'd',
        options: [
          { id: 'a', text: 'O(n)' },
          { id: 'b', text: 'O(log n)' },
          { id: 'c', text: 'O(n²)' },
          { id: 'd', text: 'O(1)' },
        ],
        status: 'correct',
      },
      {
        id: 'q8',
        question: 'Which tree traversal visits nodes in ascending order for BST?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'b',
        correctAnswer: 'b',
        options: [
          { id: 'a', text: 'Preorder' },
          { id: 'b', text: 'Inorder' },
          { id: 'c', text: 'Postorder' },
          { id: 'd', text: 'Level order' },
        ],
        status: 'correct',
      },
      {
        id: 'q9',
        question: 'What is the maximum number of children a binary tree node can have?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'a',
        correctAnswer: 'a',
        options: [
          { id: 'a', text: '2' },
          { id: 'b', text: '3' },
          { id: 'c', text: '1' },
          { id: 'd', text: 'Unlimited' },
        ],
        status: 'correct',
      },
      {
        id: 'q10',
        question: 'Which algorithm is used to find the shortest path in a weighted graph?',
        marks: 10,
        obtainedMarks: 0,
        userAnswer: 'c',
        correctAnswer: 'a',
        options: [
          { id: 'a', text: 'Dijkstra\'s Algorithm' },
          { id: 'b', text: 'Prim\'s Algorithm' },
          { id: 'c', text: 'Kruskal\'s Algorithm' },
          { id: 'd', text: 'Bellman-Ford (also correct but not the best answer)' },
        ],
        status: 'incorrect',
      },
      {
        id: 'q11',
        question: 'What data structure is used for BFS traversal?',
        marks: 10,
        obtainedMarks: 10,
        userAnswer: 'b',
        correctAnswer: 'b',
        options: [
          { id: 'a', text: 'Stack' },
          { id: 'b', text: 'Queue' },
          { id: 'c', text: 'Array' },
          { id: 'd', text: 'Tree' },
        ],
        status: 'correct',
      },
      {
        id: 'q12',
        question: 'What is the time complexity of building a heap from an array?',
        marks: 10,
        obtainedMarks: 8,
        userAnswer: 'b',
        correctAnswer: 'a',
        options: [
          { id: 'a', text: 'O(n)' },
          { id: 'b', text: 'O(n log n)' },
          { id: 'c', text: 'O(n²)' },
          { id: 'd', text: 'O(log n)' },
        ],
        status: 'incorrect',
      },
    ],
  },
  'exam-102': {
    id: 'exam-102',
    type: 'short',
    examTitle: 'Web Development - Short Answer',
    subject: 'Computer Science',
    submittedAt: '2026-01-15T14:30:00',
    totalMarks: 100,
    obtainedMarks: 78,
    percentage: 78,
    status: 'graded',
    duration: 85, // minutes taken
    totalQuestions: 5,
    questions: [
      {
        id: 'q1',
        question: 'Explain the difference between CSS Grid and Flexbox. When would you use one over the other?',
        marks: 20,
        obtainedMarks: 18,
        userAnswer: 'CSS Grid is a two-dimensional layout system that works with rows and columns simultaneously, making it ideal for complex page layouts. Flexbox is a one-dimensional layout system that works along a single axis (row or column), perfect for component layouts like navigation bars or card arrangements. Use Grid for overall page structure and Flexbox for aligning items within components.',
        status: 'graded',
        feedback: 'Excellent explanation with clear use cases. Minor: Could mention Grid\'s explicit placement capabilities.',
      },
      {
        id: 'q2',
        question: 'What is the Virtual DOM in React? How does it improve performance?',
        marks: 20,
        obtainedMarks: 15,
        userAnswer: 'Virtual DOM is a lightweight copy of the actual DOM kept in memory. When state changes, React creates a new Virtual DOM tree and compares it with the previous one (diffing). Only the changed elements are updated in the real DOM, avoiding expensive full DOM re-renders.',
        status: 'graded',
        feedback: 'Good understanding of the concept. However, you should also mention reconciliation process and batching updates.',
      },
      {
        id: 'q3',
        question: 'Describe the event loop in JavaScript and how it handles asynchronous operations.',
        marks: 20,
        obtainedMarks: 16,
        userAnswer: 'The event loop continuously checks the call stack and message queue. When the call stack is empty, it takes the first event from the queue and pushes it to the stack for execution. Asynchronous operations like setTimeout are handled by Web APIs, and their callbacks are added to the queue when complete.',
        status: 'graded',
        feedback: 'Good explanation. Would be better to mention microtasks vs macrotasks and Promise handling.',
      },
      {
        id: 'q4',
        question: 'What are HTTP status codes? Explain 2xx, 4xx, and 5xx series with examples.',
        marks: 20,
        obtainedMarks: 19,
        userAnswer: 'HTTP status codes indicate the result of an HTTP request. 2xx (Success): 200 OK - request succeeded, 201 Created - resource created. 4xx (Client Error): 400 Bad Request - invalid syntax, 404 Not Found - resource doesn\'t exist, 401 Unauthorized - authentication required. 5xx (Server Error): 500 Internal Server Error - server encountered an error, 503 Service Unavailable - server temporarily can\'t handle request.',
        status: 'graded',
        feedback: 'Comprehensive and accurate answer with excellent examples!',
      },
      {
        id: 'q5',
        question: 'What is CORS? Why is it important for web security?',
        marks: 20,
        obtainedMarks: 10,
        userAnswer: 'CORS (Cross-Origin Resource Sharing) is a security mechanism that allows or restricts resources on a web page to be requested from another domain. It prevents malicious websites from accessing sensitive data.',
        status: 'graded',
        feedback: 'Basic understanding shown but lacks depth. Should explain preflight requests, headers (Access-Control-Allow-Origin), and same-origin policy.',
      },
    ],
  },
  'exam-104': {
    id: 'exam-104',
    type: 'short',
    examTitle: 'Software Engineering - Descriptive',
    subject: 'Computer Science',
    submittedAt: '2026-01-22T14:30:00',
    totalMarks: 80,
    obtainedMarks: 0,
    percentage: 0,
    status: 'pending',
    duration: 110, // minutes taken
    totalQuestions: 4,
    pendingReview: 4,
    questions: [
      {
        id: 'q1',
        question: 'Explain the Agile software development methodology and its key principles.',
        marks: 20,
        obtainedMarks: 0,
        userAnswer: 'Agile is an iterative approach to software development that emphasizes flexibility and customer collaboration. Key principles include: working in short sprints (usually 2-4 weeks), daily stand-up meetings for team synchronization, continuous delivery of working software, welcoming changing requirements even late in development, and close collaboration between developers and stakeholders. Agile values individuals and interactions over processes, working software over documentation, and responding to change over following a rigid plan.',
        status: 'pending',
        feedback: null,
      },
      {
        id: 'q2',
        question: 'What is the difference between unit testing, integration testing, and system testing?',
        marks: 20,
        obtainedMarks: 0,
        userAnswer: 'Unit testing focuses on testing individual components or functions in isolation to ensure they work correctly. Integration testing verifies that different modules or services work together properly when combined. System testing tests the complete, integrated system to validate it meets specified requirements. Unit tests are fastest and most granular, while system tests are slowest but test the entire application flow. Each level serves a different purpose in ensuring software quality.',
        status: 'pending',
        feedback: null,
      },
      {
        id: 'q3',
        question: 'Describe the MVC (Model-View-Controller) architectural pattern and its benefits.',
        marks: 20,
        obtainedMarks: 0,
        userAnswer: 'MVC separates application into three interconnected components: Model (data and business logic), View (user interface), and Controller (handles user input and updates model/view). The Model manages data and notifies views of changes. The View displays data to users. The Controller processes user input and updates the model. Benefits include separation of concerns, easier maintenance, ability to modify UI without changing business logic, and support for multiple views of the same data.',
        status: 'pending',
        feedback: null,
      },
      {
        id: 'q4',
        question: 'What is technical debt? How can it be managed in a software project?',
        marks: 20,
        obtainedMarks: 0,
        userAnswer: 'Technical debt refers to the implied cost of additional work caused by choosing a quick, easy solution instead of a better approach that would take longer. It accumulates when developers take shortcuts, skip testing, or ignore best practices to meet deadlines. Management strategies include: regular code refactoring, maintaining good documentation, allocating time for addressing debt in each sprint, prioritizing critical debt items, conducting code reviews, and balancing new features with technical improvements.',
        status: 'pending',
        feedback: null,
      },
    ],
  },
};

const getResultData = (examId, type) => {
  // Map specific exam IDs to their results
  if (mockResults[examId]) {
    return mockResults[examId];
  }
  // Fallback based on type
  return type === 'short' ? mockResults['exam-104'] : mockResults.mcq;
};

export default function ExamResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // State for real data
  const [submission, setSubmission] = useState(null);
  const [exam, setExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnswers, setShowAnswers] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First try to fetch submission for this exam
        const submissionData = await getMySubmissionForExam(id);
        setSubmission(submissionData);
        
        // Then try to fetch exam details
        try {
          const examData = await getExamById(id, { includeQuestions: true });
          if (examData) {
            setExam(parseExamResponse(examData));
          }
        } catch (examErr) {
          console.warn('Could not fetch exam details:', examErr);
          // Don't fail if we can't get exam details, we have submission data
        }
        
      } catch (err) {
        console.error('Failed to fetch exam result data:', err);
        setError(err.message || 'Failed to load exam results');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  // Handle errors
  if (error) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200/80 text-center">
        <span className="material-symbols-outlined mx-auto text-6xl text-red-300">error</span>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">Error Loading Results</h3>
        <p className="mt-2 text-sm text-slate-600">{error}</p>
        <div className="mt-4 flex gap-3 justify-center">
          <button
            onClick={() => navigate('/dashboard/my-exams')}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
          >
            Back to My Exams
          </button>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Handle case when no submission is found
  if (!submission) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200/80 text-center">
        <span className="material-symbols-outlined mx-auto text-6xl text-blue-300">pending</span>
        <h3 className="mt-4 text-lg font-semibold text-slate-900">Exam Submitted Successfully</h3>
        <p className="mt-2 text-sm text-slate-600">
          Your exam has been submitted successfully. Results will be available once your teacher completes the grading process.
        </p>
        <div className="mt-4 flex gap-3 justify-center">
          <button
            onClick={() => navigate('/dashboard/available-exams')}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
          >
            Back to Exams
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Use submission data with exam data as fallback
  const examTitle = submission.examTitle || exam?.title || 'Exam Results';
  const examType = (submission.examType || exam?.examType || 'MCQ').toLowerCase();
  const totalMarks = submission.maxScore || exam?.totalMarks || 0;
  const obtainedMarks = submission.totalScore || 0;
  const percentage = totalMarks > 0 ? ((obtainedMarks / totalMarks) * 100).toFixed(1) : 0;
  const normalizedStatus = submission.status?.toLowerCase();
  const isGraded = normalizedStatus === 'graded';
  const isInReview = normalizedStatus === 'in-review';
  const isPending = normalizedStatus === 'pending' || isInReview;
  const answersMap = submission.answers || {};
  const questionGradesMap = submission.questionGrades || {};
  const examQuestions = exam?.questions || [];
  const fallbackQuestions = !examQuestions.length
    ? Object.keys(answersMap).map((questionId, index) => ({
        id: questionId,
        questionText: `Question ${index + 1}`,
        type: submission.examType || examType,
        marks: null,
        options: [],
      }))
    : examQuestions;

  const resolveOptionText = (options, value) => {
    if (!options || options.length === 0) return value || '';
    const normalizedOptions = options.map((opt) => {
      if (typeof opt === 'string') return opt;
      return opt?.text || opt?.label || opt?.value || '';
    });
    if (normalizedOptions.includes(value)) return value;
    if (typeof value === 'string' && value.length === 1) {
      const index = value.toLowerCase().charCodeAt(0) - 97;
      if (index >= 0 && index < normalizedOptions.length) {
        return normalizedOptions[index];
      }
    }
    return value || '';
  };

  return (
    <div className="space-y-4">
      {/* Result Header */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex items-start justify-between gap-6">
          {/* Left: Icon and Title */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              {isPending ? (
                <span className="material-symbols-outlined text-2xl text-amber-600">schedule</span>
              ) : (
                <span className="material-symbols-outlined text-2xl text-emerald-600">verified</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {isGraded ? 'Exam Results' : isInReview ? 'Under Review' : 'Exam Submitted'}
              </h1>
              <p className="mt-0.5 text-sm text-slate-600">{exam?.title || submission.examTitle || 'Exam'}</p>
              <p className="text-xs text-slate-500">{exam?.course || 'Course'}</p>
            </div>
          </div>

          {/* Right: Score Display */}
          {isGraded && submission.totalScore !== undefined && submission.maxScore !== undefined && (
            <div className="shrink-0 text-right">
              <p className="text-xs font-medium text-slate-500">Score</p>
              <div className="mt-1 flex items-baseline justify-end gap-0.5">
                <span className="text-3xl font-bold text-slate-900">{submission.totalScore}</span>
                <span className="text-lg font-medium text-slate-400">/</span>
                <span className="text-lg font-semibold text-slate-600">{submission.maxScore}</span>
              </div>
              {submission.percentage && (
                <p className="text-xs text-slate-500">{submission.percentage}%</p>
              )}
            </div>
          )}
        </div>
        
        {/* Stats */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="material-symbols-outlined text-lg text-slate-400">quiz</span>
            <div>
              <p className="text-xs text-slate-500">Questions</p>
              <p className="text-sm font-bold text-slate-900">{exam?.questions?.length || Object.keys(submission.answers || {}).length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="material-symbols-outlined text-lg text-slate-400">schedule</span>
            <div>
              <p className="text-xs text-slate-500">Duration</p>
              <p className="text-sm font-bold text-slate-900">{exam?.duration ? `${exam.duration} min` : 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
            <span className="material-symbols-outlined text-lg text-slate-400">
              {examType === 'mcq' ? 'radio_button_checked' : 'edit_note'}
            </span>
            <div>
              <p className="text-xs text-slate-500">Type</p>
              <p className="text-sm font-bold text-slate-900">{examType === 'mcq' ? 'MCQ' : examType === 'cq' ? 'Descriptive' : examType.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {isPending && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 ring-1 ring-amber-200">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base text-amber-600">info</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900">Awaiting Teacher Review</p>
                <p className="mt-0.5 text-xs text-amber-700">
                  Your answers are being reviewed. Results will be available once grading is complete.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Summary - Only show for graded exams */}
      {isGraded && (
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/80">
        <h2 className="text-base font-semibold text-slate-900">Exam Summary</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {submission.totalScore !== undefined && submission.maxScore !== undefined && (
            <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 p-4 ring-1 ring-blue-200/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-white">
                  <span className="material-symbols-outlined text-xl">grade</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-blue-700">Total Score</p>
                  <p className="text-2xl font-bold text-blue-900">{submission.totalScore}/{submission.maxScore}</p>
                  {submission.percentage && (
                    <p className="text-xs text-blue-600">{submission.percentage}%</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50 p-4 ring-1 ring-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-500 text-white">
                <span className="material-symbols-outlined text-xl">
                  {submission.status === 'graded' ? 'verified' : 'schedule'}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700">Status</p>
                <p className="text-sm font-bold text-slate-900 capitalize">{submission.status.replace('-', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Questions & Answers */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-slate-900">Questions & Answers</h2>
          <button
            type="button"
            onClick={() => setShowAnswers((prev) => !prev)}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200"
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>
        </div>

        {fallbackQuestions.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No questions found for this submission.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {fallbackQuestions.map((question, index) => {
              const questionType = (question.type || examType || '').toLowerCase();
              const studentAnswer = answersMap[question.id];
              const correctAnswer = question.correctAnswer;
              const maxMarks = question.marks ?? null;
              const awardedMarks = questionGradesMap[question.id];
              const mcqAwarded = correctAnswer && studentAnswer != null
                ? studentAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
                  ? maxMarks
                  : 0
                : null;

              return (
                <div key={question.id || index} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Q{index + 1}. {question.questionText || question.question || 'Question'}
                      </p>
                      {maxMarks != null && (
                        <p className="mt-1 text-xs text-slate-500">Marks: {maxMarks}</p>
                      )}
                    </div>
                    {maxMarks != null && (
                      <div className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700">
                        {questionType === 'mcq'
                          ? (mcqAwarded != null ? `${mcqAwarded}/${maxMarks}` : 'Score N/A')
                          : (awardedMarks != null ? `${awardedMarks}/${maxMarks}` : isGraded ? 'Score N/A' : 'Not graded')}
                      </div>
                    )}
                  </div>

                  {questionType === 'mcq' && question.options?.length > 0 && (
                    <div className="mt-3 grid gap-2">
                      {question.options.map((option, optIndex) => {
                        const optionText = typeof option === 'string'
                          ? option
                          : option?.text || option?.label || option?.value || '';
                        const isSelected = resolveOptionText(question.options, studentAnswer) === optionText;
                        const isCorrect = correctAnswer
                          ? resolveOptionText(question.options, correctAnswer) === optionText
                          : false;

                        return (
                          <div
                            key={`${question.id || index}-opt-${optIndex}`}
                            className={`rounded-lg border px-3 py-2 text-sm ${
                              isCorrect
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                                : isSelected
                                  ? 'border-blue-200 bg-blue-50 text-blue-900'
                                  : 'border-slate-200 bg-white text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span>{optionText}</span>
                              <div className="flex items-center gap-2 text-xs font-medium">
                                {isSelected && <span className="text-blue-700">Your answer</span>}
                                {showAnswers && isCorrect && <span className="text-emerald-700">Correct</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {questionType !== 'mcq' && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-slate-500">Your Answer</p>
                      <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        {studentAnswer || 'No answer submitted.'}
                      </div>
                      {showAnswers && awardedMarks != null && (
                        <p className="mt-2 text-xs text-slate-600">Marks Awarded: {awardedMarks}{maxMarks != null ? `/${maxMarks}` : ''}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status Message */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
        <div className="text-center">
          {isPending && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <span className="material-symbols-outlined text-3xl text-blue-600">schedule</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Exam Submitted Successfully</h3>
              <p className="mt-2 text-sm text-slate-600">
                Your answers have been submitted and are being reviewed. 
                {submission.examType === 'mcq' 
                  ? ' MCQ results will be available shortly.' 
                  : ' Results will be available once your teacher completes the grading.'}
              </p>
            </>
          )}
          
          {isGraded && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <span className="material-symbols-outlined text-3xl text-green-600">verified</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Results Available</h3>
              <p className="mt-2 text-sm text-slate-600">
                Your exam has been graded. Check your score above for details.
              </p>
            </>
          )}
          
          {!isPending && !isGraded && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <span className="material-symbols-outlined text-3xl text-amber-600">pending</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">Under Review</h3>
              <p className="mt-2 text-sm text-slate-600">
                Your exam is currently being reviewed. Results will be available soon.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
        >
          <span className="material-symbols-outlined text-lg">dashboard</span>
          Go to Dashboard
        </button>
        <button
          onClick={() => navigate('/dashboard/available-exams')}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
        >
          <span className="material-symbols-outlined text-lg">quiz</span>
          Take Another Exam
        </button>
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
      <div className="h-48 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}
