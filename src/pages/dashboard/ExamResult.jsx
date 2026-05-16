'use client';

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  completedExams as mockCompletedExams,
  availableExams as mockAvailableExams,
  examQuestions as mockExamQuestions,
} from '../../data/mockData';

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

const buildSubmissionFromCompletedExam = (id) => {
  const completed = mockCompletedExams.find((c) => c.id === id);
  if (!completed) return null;

  const questions = mockExamQuestions[id] || [];
  const answers = {};
  const questionGrades = {};
  questions.forEach((q) => {
    const qid = q.id ?? `q-${q.questionOrder ?? 0}`;
    if ((q.type || '').toUpperCase() === 'MCQ' && Array.isArray(q.options)) {
      answers[qid] = q.options[q.correctAnswer] ?? '';
      questionGrades[qid] = q.marks;
    } else {
      answers[qid] = 'Mock answer for demo purposes — written response would appear here.';
      questionGrades[qid] = Math.round((q.marks || 0) * 0.8);
    }
  });

  const totalScore = completed.score ?? null;
  const maxScore = completed.totalMarks ?? null;
  const percentage = totalScore != null && maxScore
    ? Math.round((totalScore / maxScore) * 100)
    : null;

  return {
    id: `mock-${id}`,
    examId: id,
    examTitle: completed.title,
    examType: completed.examType,
    status: completed.status,
    totalScore,
    maxScore,
    percentage,
    submittedAt: completed.completedAt,
    answers,
    questionGrades,
  };
};

const buildExamFromMock = (id) => {
  const base =
    mockCompletedExams.find((c) => c.id === id) ||
    mockAvailableExams.find((a) => a.id === id);
  if (!base) return null;
  return {
    ...base,
    duration: base.duration ?? base.durationMinutes ?? null,
    questions: mockExamQuestions[id] || [],
  };
};

export default function ExamResult() {
  const { id } = useParams();
  const navigate = useNavigate();
  const submission = mockResults[id]
    ? {
        id: `mock-${id}`,
        examId: id,
        examTitle: mockResults[id].examTitle,
        examType: mockResults[id].type === 'short' ? 'CQ' : 'MCQ',
        status: mockResults[id].status === 'pending' ? 'pending' : 'graded',
        totalScore: mockResults[id].obtainedMarks,
        maxScore: mockResults[id].totalMarks,
        percentage: mockResults[id].percentage,
        submittedAt: mockResults[id].submittedAt,
        answers: Object.fromEntries(
          mockResults[id].questions.map((q) => [q.id, q.userAnswer]),
        ),
        questionGrades: Object.fromEntries(
          mockResults[id].questions.map((q) => [q.id, q.obtainedMarks]),
        ),
      }
    : buildSubmissionFromCompletedExam(id);

  const exam = mockResults[id]
    ? {
        title: mockResults[id].examTitle,
        course: mockResults[id].subject,
        examType: mockResults[id].type === 'short' ? 'CQ' : 'MCQ',
        totalMarks: mockResults[id].totalMarks,
        duration: mockResults[id].duration,
        questions: mockResults[id].questions.map((q) => ({
          id: q.id,
          questionText: q.question,
          type: mockResults[id].type === 'short' ? 'CQ' : 'MCQ',
          marks: q.marks,
          options: q.options?.map((o) => o.text) || [],
          correctAnswer: q.options?.find((o) => o.id === q.correctAnswer)?.text,
        })),
      }
    : buildExamFromMock(id);

  const [showAnswers, setShowAnswers] = useState(true);

  // Handle case when no submission is found
  if (!submission) {
    return (
      <div className="rounded-lg bg-canvas p-8 border border-hairline text-center">
        <span className="material-symbols-outlined mx-auto text-6xl text-blue-300">pending</span>
        <h3 className="mt-4 font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">Exam Submitted Successfully</h3>
        <p className="mt-2 text-sm text-body">
          Your exam has been submitted successfully. Results will be available once your teacher completes the grading process.
        </p>
        <div className="mt-4 flex gap-3 justify-center">
          <button
            onClick={() => navigate('/dashboard/available-exams')}
            className="rounded-lg bg-surface-card px-4 py-2 text-sm font-medium text-body-strong transition-colors hover:bg-hairline"
          >
            Back to Exams
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
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
      <div className="rounded-lg bg-canvas p-6 border border-hairline">
        <div className="flex items-start justify-between gap-6">
          {/* Left: Icon and Title */}
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              {isPending ? (
                <span className="material-symbols-outlined text-2xl text-[#7a5a0e]">schedule</span>
              ) : (
                <span className="material-symbols-outlined text-2xl text-[#2f6e3d]">verified</span>
              )}
            </div>
            <div>
              <h1 className="font-display text-[24px] leading-tight tracking-[-0.015em] text-ink">
                {isGraded ? 'Exam Results' : isInReview ? 'Under Review' : 'Exam Submitted'}
              </h1>
              <p className="mt-0.5 text-sm text-body">{exam?.title || submission.examTitle || 'Exam'}</p>
              <p className="text-xs text-muted">{exam?.course || 'Course'}</p>
            </div>
          </div>

          {/* Right: Score Display */}
          {isGraded && submission.totalScore !== undefined && submission.maxScore !== undefined && (
            <div className="shrink-0 text-right">
              <p className="text-xs font-medium text-muted">Score</p>
              <div className="mt-1 flex items-baseline justify-end gap-0.5">
                <span className="font-display text-[40px] leading-tight tracking-[-0.02em] text-ink">{submission.totalScore}</span>
                <span className="text-lg font-medium text-muted-soft">/</span>
                <span className="text-lg font-semibold text-body">{submission.maxScore}</span>
              </div>
              {submission.percentage && (
                <p className="text-xs text-muted">{submission.percentage}%</p>
              )}
            </div>
          )}
        </div>
        
        {/* Stats */}
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-surface-soft px-3 py-2.5">
            <span className="material-symbols-outlined text-lg text-muted-soft">quiz</span>
            <div>
              <p className="text-xs text-muted">Questions</p>
              <p className="text-sm font-bold text-ink">{exam?.questions?.length || Object.keys(submission.answers || {}).length || 0}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-surface-soft px-3 py-2.5">
            <span className="material-symbols-outlined text-lg text-muted-soft">schedule</span>
            <div>
              <p className="text-xs text-muted">Duration</p>
              <p className="text-sm font-bold text-ink">{exam?.duration ? `${exam.duration} min` : 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-surface-soft px-3 py-2.5">
            <span className="material-symbols-outlined text-lg text-muted-soft">
              {examType === 'mcq' ? 'radio_button_checked' : 'edit_note'}
            </span>
            <div>
              <p className="text-xs text-muted">Type</p>
              <p className="text-sm font-bold text-ink">{examType === 'mcq' ? 'MCQ' : examType === 'cq' ? 'Descriptive' : examType.toUpperCase()}</p>
            </div>
          </div>
        </div>

        {isPending && (
          <div className="mt-4 rounded-lg bg-warning/10 p-3 border border-warning/30">
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-base text-[#7a5a0e]">info</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-[#7a5a0e]">Awaiting Teacher Review</p>
                <p className="mt-0.5 text-xs text-[#7a5a0e]">
                  Your answers are being reviewed. Results will be available once grading is complete.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance Summary - Only show for graded exams */}
      {isGraded && (
      <div className="rounded-lg bg-canvas p-5 border border-hairline">
        <h2 className="text-base font-semibold text-ink">Exam Summary</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {submission.totalScore !== undefined && submission.maxScore !== undefined && (
            <div className="group relative overflow-hidden rounded-lg border border-hairline bg-canvas p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-on-primary">
                  <span className="material-symbols-outlined text-xl">grade</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-primary">Total Score</p>
                  <p className="font-display text-[28px] leading-none text-ink">{submission.totalScore}/{submission.maxScore}</p>
                  {submission.percentage && (
                    <p className="text-xs text-primary">{submission.percentage}%</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="group relative overflow-hidden rounded-lg border border-hairline bg-surface-soft p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-soft text-ink">
                <span className="material-symbols-outlined text-xl">
                  {submission.status === 'graded' ? 'verified' : 'schedule'}
                </span>
              </div>
              <div>
                <p className="text-xs font-medium text-body-strong">Status</p>
                <p className="text-sm font-bold text-ink capitalize">{submission.status.replace('-', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Questions & Answers */}
      <div className="rounded-lg bg-canvas p-6 border border-hairline">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-ink">Questions & Answers</h2>
          <button
            type="button"
            onClick={() => setShowAnswers((prev) => !prev)}
            className="rounded-lg bg-surface-card px-3 py-1.5 text-xs font-medium text-body-strong transition-colors hover:bg-hairline"
          >
            {showAnswers ? 'Hide Answers' : 'Show Answers'}
          </button>
        </div>

        {fallbackQuestions.length === 0 ? (
          <p className="mt-3 text-sm text-body">No questions found for this submission.</p>
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
                <div key={question.id || index} className="rounded-xl border border-hairline p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        Q{index + 1}. {question.questionText || question.question || 'Question'}
                      </p>
                      {maxMarks != null && (
                        <p className="mt-1 text-xs text-muted">Marks: {maxMarks}</p>
                      )}
                    </div>
                    {maxMarks != null && (
                      <div className="rounded-lg bg-surface-soft px-3 py-1.5 text-xs font-semibold text-body-strong">
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
                                ? 'border-success/25 bg-success/10 text-emerald-900'
                                : isSelected
                                  ? 'border-primary/20 bg-primary/10 text-ink'
                                  : 'border-hairline bg-canvas text-body-strong'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span>{optionText}</span>
                              <div className="flex items-center gap-2 text-xs font-medium">
                                {isSelected && <span className="text-primary">Your answer</span>}
                                {showAnswers && isCorrect && <span className="text-[#2f6e3d]">Correct</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {questionType !== 'mcq' && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-muted">Your Answer</p>
                      <div className="mt-1 rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-sm text-body-strong">
                        {studentAnswer || 'No answer submitted.'}
                      </div>
                      {showAnswers && awardedMarks != null && (
                        <p className="mt-2 text-xs text-body">Marks Awarded: {awardedMarks}{maxMarks != null ? `/${maxMarks}` : ''}</p>
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
      <div className="rounded-lg bg-canvas p-6 border border-hairline">
        <div className="text-center">
          {isPending && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                <span className="material-symbols-outlined text-3xl text-primary">schedule</span>
              </div>
              <h3 className="mt-4 font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">Exam Submitted Successfully</h3>
              <p className="mt-2 text-sm text-body">
                Your answers have been submitted and are being reviewed. 
                {submission.examType === 'mcq' 
                  ? ' MCQ results will be available shortly.' 
                  : ' Results will be available once your teacher completes the grading.'}
              </p>
            </>
          )}
          
          {isGraded && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
                <span className="material-symbols-outlined text-3xl text-[#2f6e3d]">verified</span>
              </div>
              <h3 className="mt-4 font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">Results Available</h3>
              <p className="mt-2 text-sm text-body">
                Your exam has been graded. Check your score above for details.
              </p>
            </>
          )}
          
          {!isPending && !isGraded && (
            <>
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-warning/15">
                <span className="material-symbols-outlined text-3xl text-[#7a5a0e]">pending</span>
              </div>
              <h3 className="mt-4 font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">Under Review</h3>
              <p className="mt-2 text-sm text-body">
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
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
        >
          <span className="material-symbols-outlined text-lg">dashboard</span>
          Go to Dashboard
        </button>
        <button
          onClick={() => navigate('/dashboard/available-exams')}
          className="inline-flex items-center gap-2 rounded-lg bg-surface-card px-5 py-2.5 text-sm font-medium text-body-strong transition-colors hover:bg-hairline"
        >
          <span className="material-symbols-outlined text-lg">quiz</span>
          Take Another Exam
        </button>
      </div>
    </div>
  );
}

