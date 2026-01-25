import api from './api';

/**
 * Exam Service - API functions for exam management
 * Aligned with backend API requirements
 */

// ==================== EXAM CRUD ====================

/**
 * Create a new exam with all details and questions
 * POST /api/exams
 * 
 * @param {Object} examData - The exam data to create
 * @returns {Promise<Object>} Created exam with ID
 */
export async function createExam(examData) {
  const payload = formatExamPayload(examData);
  return api.post('/exams', payload);
}

/**
 * Update an existing exam
 * PUT /api/exams/{examId}
 * 
 * @param {string} examId - The exam ID to update
 * @param {Object} examData - The updated exam data
 * @returns {Promise<Object>} Updated exam data
 */
export async function updateExam(examId, examData) {
  const payload = formatExamPayload(examData);
  return api.put(`/exams/${examId}`, payload);
}

/**
 * Get exam details with questions
 * GET /api/exams/{examId}
 * 
 * @param {string} examId - The exam ID
 * @param {Object} options - Query options
 * @param {boolean} options.includeQuestions - Include questions (default: true)
 * @param {boolean} options.includeStats - Include statistics (default: false)
 * @returns {Promise<Object>} Exam details
 */
export async function getExamById(examId, options = {}) {
  const params = new URLSearchParams();
  if (options.includeQuestions !== undefined) {
    params.append('includeQuestions', options.includeQuestions);
  }
  if (options.includeStats !== undefined) {
    params.append('includeStats', options.includeStats);
  }
  const queryString = params.toString();
  return api.get(`/exams/${examId}${queryString ? `?${queryString}` : ''}`);
}

/**
 * Get teacher's exams list
 * GET /api/exams/my-exams
 * 
 * @param {Object} options - Query options
 * @param {number} options.page - Page number (default: 0)
 * @param {number} options.size - Page size (default: 20)
 * @param {string} options.sort - Sort field and direction
 * @param {string} options.status - Filter by status
 * @param {string} options.search - Search query
 * @returns {Promise<Object>} Paginated list of exams
 */
export async function getTeacherExams(options = {}) {
  const params = new URLSearchParams();
  if (options.page !== undefined) params.append('page', options.page);
  if (options.size !== undefined) params.append('size', options.size);
  if (options.sort) params.append('sort', options.sort);
  if (options.status) params.append('status', options.status);
  if (options.search) params.append('search', options.search);
  
  const queryString = params.toString();
  return api.get(`/exams/my-exams${queryString ? `?${queryString}` : ''}`);
}

/**
 * Get all published/available exams for students
 * GET /api/exams/published
 * 
 * @returns {Promise<Array>} List of available exams
 */
export async function getAvailableExams() {
  const response = await api.get('/exams/published');
  // API returns paginated response { content: [...], totalItems, ... }
  // Extract the content array for backward compatibility
  return response?.content || response || [];
}

/**
 * Delete an exam
 * DELETE /api/exams/{examId}
 * 
 * @param {string} examId - The exam ID to delete
 * @returns {Promise<void>}
 */
export async function deleteExam(examId) {
  return api.delete(`/exams/${examId}`);
}

// ==================== SUBMISSIONS ====================

/**
 * Submit exam answers
 * POST /api/exams/{examId}/submit
 * 
 * @param {string} examId - The exam ID
 * @param {Object} answers - Map of questionId to answer string (e.g., {"q1": "answer1", "q2": "answer2"})
 * @returns {Promise<Object>} Submission result
 */
export async function submitExam(examId, answers) {
  return api.post(`/exams/${examId}/submit`, answers);
}

/**
 * Get submissions for an exam (teacher view)
 * GET /api/exams/{examId}/submissions
 * 
 * @param {string} examId - The exam ID
 * @returns {Promise<Array>} List of submissions
 */
export async function getExamSubmissions(examId) {
  const data = await api.get(`/exams/${examId}/submissions`);
  const list = Array.isArray(data) ? data : data?.content || [];
  return list.map(normalizeSubmission);
}

/**
 * Get all submissions for teacher's exams
 * GET /api/exams/submissions (teacher only)
 * 
 * @returns {Promise<Array>} List of all submissions
 */
export async function getAllSubmissions() {
  const data = await api.get('/exams/submissions');
  const list = Array.isArray(data) ? data : data?.content || [];
  return list.map(normalizeSubmission);
}

/**
 * Get student's own submissions
 * GET /api/exams/my-submissions
 * 
 * @returns {Promise<Array>} List of student's submissions
 */
export async function getMySubmissions() {
  const data = await api.get('/exams/my-submissions');
  const list = Array.isArray(data) ? data : data?.content || [];
  return list.map(normalizeSubmission);
}

/**
 * Get student's submission for a specific exam
 * 
 * @param {string} examId - The exam ID
 * @returns {Promise<Object|null>} Submission details or null if not found
 */
export async function getMySubmissionForExam(examId) {
  const submissions = await getMySubmissions();
  return submissions.find(submission => submission.examId === examId) || null;
}

/**
 * Get submission details
 * GET /api/exams/submissions/{submissionId}
 * 
 * @param {string} submissionId - The submission ID
 * @returns {Promise<Object>} Submission details
 */
export async function getSubmissionById(submissionId) {
  const submission = await api.get(`/exams/submissions/${submissionId}`);
  return normalizeSubmission(submission);
}

/**
 * Grade a CQ submission
 * POST /api/exams/submissions/{submissionId}/grade
 * 
 * @param {string} submissionId - The submission ID
 * @param {Object} gradeData - The grading data
 * @returns {Promise<Object>} Graded submission
 */
export async function gradeSubmission(submissionId, gradeData) {
  const submission = await api.post(`/exams/submissions/${submissionId}/grade`, gradeData);
  return normalizeSubmission(submission);
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Format exam data for API payload
 * Converts frontend form data to backend API format
 */
function formatExamPayload(examData) {
  const {
    examType,
    title,
    course,
    description,
    duration,
    totalMarks,
    passingMarks,
    startDate,
    startTime,
    endDate,
    endTime,
    questions,
    status = 'PUBLISHED', // Default to PUBLISHED
  } = examData;

  // Convert date/time to ISO 8601 timestamp (milliseconds)
  const startDateTime = combineDateTimeToTimestamp(startDate, startTime);
  const endDateTime = combineDateTimeToTimestamp(endDate, endTime);

  return {
    title,
    course,
    examType: examType?.toUpperCase() || 'MCQ',
    durationMinutes: parseInt(duration, 10),
    totalMarks: parseInt(totalMarks, 10),
    passingMarks: parseInt(passingMarks, 10),
    startDateTime,
    endDateTime,
    status: status?.toUpperCase() || 'PUBLISHED',
    description: description || '',
    questions: questions.map((q, index) => formatQuestion(q, examType, index)),
  };
}

/**
 * Format a question for API payload
 */
function formatQuestion(question, examType, index) {
  const type = examType?.toUpperCase() || 'MCQ';
  
  const formattedQuestion = {
    type,
    questionText: question.text || question.questionText || question.question,
    marks: parseInt(question.marks, 10),
    questionOrder: index + 1, // Backend expects 1-based indexing
  };

  if (type === 'MCQ') {
    formattedQuestion.options = question.options || [];
    // correctAnswer should be the actual answer string, not an index
    formattedQuestion.correctAnswer = 
      typeof question.correctAnswer === 'number' 
        ? (question.options || [])[question.correctAnswer] 
        : question.correctAnswer;
  }

  return formattedQuestion;
}

/**
 * Combine date and time strings to timestamp (milliseconds)
 */
function combineDateTimeToTimestamp(dateStr, timeStr) {
  if (!dateStr) return null;
  
  // Default to 00:00 if no time provided
  const time = timeStr || '00:00';
  const dateTimeStr = `${dateStr}T${time}:00`;
  
  return new Date(dateTimeStr).getTime();
}

/**
 * Parse exam response from API to frontend format
 */
export function parseExamResponse(exam) {
  if (!exam) return null;

  const startDate = exam.startDateTime ? new Date(exam.startDateTime) : null;
  const endDate = exam.endDateTime ? new Date(exam.endDateTime) : null;

  return {
    id: exam.id,
    title: exam.title,
    course: exam.course,
    description: exam.description,
    examType: exam.examType?.toLowerCase() || 'mcq',
    duration: exam.durationMinutes || exam.duration,
    totalMarks: exam.totalMarks,
    passingMarks: exam.passingMarks,
    status: exam.status?.toLowerCase() || 'draft',
    startDate: startDate ? formatDateForDisplay(startDate) : null,
    startTime: startDate ? formatTimeForDisplay(startDate) : null,
    endDate: endDate ? formatDateForDisplay(endDate) : null,
    endTime: endDate ? formatTimeForDisplay(endDate) : null,
    startDateTime: exam.startDateTime,
    endDateTime: exam.endDateTime,
    totalQuestions: exam.questions?.length || exam.totalQuestions || 0,
    questions: exam.questions?.map(parseQuestionResponse) || [],
    createdAt: exam.createdAt,
    updatedAt: exam.updatedAt,
    createdBy: exam.createdBy,
    stats: exam.stats,
    submissions: exam.totalSubmissions || 0,
  };
}

/**
 * Parse question response from API
 */
function parseQuestionResponse(question) {
  return {
    id: question.id,
    questionText: question.questionText,
    text: question.questionText, // For backwards compatibility
    marks: question.marks,
    type: question.type?.toLowerCase() || 'mcq',
    options: question.options || [],
    correctAnswer: question.correctAnswer,
    questionOrder: question.questionOrder,
  };
}

/**
 * Format date for display (YYYY-MM-DD for input fields)
 */
function formatDateForDisplay(date) {
  return date.toISOString().split('T')[0];
}

/**
 * Format time for display (HH:MM for input fields)
 */
function formatTimeForDisplay(date) {
  return date.toTimeString().slice(0, 5);
}

/**
 * Format date for user-friendly display
 */
export function formatDateDisplay(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format datetime for user-friendly display
 */
export function formatDateTimeDisplay(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Get exam status display config
 */
export function getExamStatusConfig(status) {
  const statusLower = status?.toLowerCase() || 'draft';
  
  const configs = {
    draft: {
      label: 'Draft',
      color: 'text-slate-600',
      bgColor: 'bg-slate-100',
      borderColor: 'border-slate-200',
      icon: 'draft',
    },
    published: {
      label: 'Published',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      icon: 'check_circle',
    },
    active: {
      label: 'Active',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: 'play_circle',
    },
    completed: {
      label: 'Completed',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: 'task_alt',
    },
    archived: {
      label: 'Archived',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      borderColor: 'border-gray-200',
      icon: 'archive',
    },
  };

  return configs[statusLower] || configs.draft;
}

/**
 * Normalize backend submission payload to UI-friendly shape
 */
function normalizeSubmission(submission) {
  if (!submission) return submission;

  const statusMap = {
    GRADED_MCQ: 'in-review',
    FULLY_GRADED: 'graded',
  };
  const normalizedStatus = statusMap[submission.status] || 'pending';

  const maxScore = submission.maxScore || submission.totalMarks || submission.totalScore || 0;
  const percentage = submission.totalScore != null && maxScore
    ? Math.round((submission.totalScore / maxScore) * 100)
    : null;

  return {
    ...submission,
    status: normalizedStatus,
    examTitle: submission.examTitle || submission.examId,
    examType: submission.examType?.toLowerCase() || 'mcq',
    student: {
      id: submission.studentId,
      name: submission.studentName || 'Student',
    },
    autoScore: submission.mcqScore,
    maxScore,
    percentage,
    submittedAt: submission.submittedAt,
  };
}

export default {
  createExam,
  updateExam,
  getExamById,
  getTeacherExams,
  getAvailableExams,
  deleteExam,
  submitExam,
  getExamSubmissions,
  getAllSubmissions,
  getMySubmissions,
  getMySubmissionForExam,
  getSubmissionById,
  gradeSubmission,
  parseExamResponse,
  formatDateDisplay,
  formatDateTimeDisplay,
  getExamStatusConfig,
};
