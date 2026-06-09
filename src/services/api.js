const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include',
    ...options,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || (json && json.success === false)) {
    const msg = json?.message || json?.data?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return json?.data ?? json;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authApi = {
  session: () => apiFetch('/api/auth/session'),

  login: (email, password) =>
    apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  signup: (username, fullName, email, password, role) =>
    apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, fullName, email, password, role }),
    }),

  logout: () => apiFetch('/api/auth/logout', { method: 'POST' }),

  updateProfile: (fullName, email) =>
    apiFetch('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ fullName, email }),
    }),

  changePassword: (currentPassword, newPassword) =>
    apiFetch('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getTeachers: () => apiFetch('/api/auth/teachers'),
};

// ─── Exam helpers ─────────────────────────────────────────────────────────────

/** Map frontend form state → backend Exam JSON */
export function buildExamPayload(examData, questions, examType) {
  const startDateTime = new Date(
    `${examData.startDate}T${examData.startTime}`,
  ).getTime();
  const endDateTime = new Date(
    `${examData.endDate}T${examData.endTime}`,
  ).getTime();

  const mappedQuestions = questions.map((q, idx) => {
    const base = {
      questionText: q.text ?? q.questionText ?? '',
      marks: parseInt(q.marks, 10),
      questionOrder: idx + 1,
      type: examType.toUpperCase(),
    };

    if (examType.toLowerCase() === 'mcq') {
      const correctIdx = typeof q.correctAnswer === 'number' ? q.correctAnswer : 0;
      const correctText = Array.isArray(q.options) ? q.options[correctIdx] : q.correctAnswer;
      return {
        ...base,
        options: q.options,
        correctAnswer: correctText,
      };
    }

    return base;
  });

  return {
    title: examData.title,
    course: examData.course,
    description: examData.description || '',
    durationMinutes: parseInt(examData.duration ?? examData.durationMinutes, 10),
    totalMarks: parseInt(examData.totalMarks, 10),
    passingMarks: parseInt(examData.passingMarks, 10),
    startDateTime,
    endDateTime,
    examType: examType.toUpperCase(),
    status: 'PUBLISHED',
    questions: mappedQuestions,
  };
}

/** Map backend Exam → frontend form state for edit mode */
export function parseExamForForm(exam) {
  const toDate = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toISOString().slice(0, 10);
  };
  const toTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toTimeString().slice(0, 5);
  };

  const examData = {
    title: exam.title || '',
    course: exam.course || '',
    description: exam.description || '',
    duration: String(exam.durationMinutes || ''),
    totalMarks: String(exam.totalMarks || ''),
    passingMarks: String(exam.passingMarks || ''),
    startDate: toDate(exam.startDateTime),
    startTime: toTime(exam.startDateTime),
    endDate: toDate(exam.endDateTime),
    endTime: toTime(exam.endDateTime),
  };

  const questions = (exam.questions || []).map((q) => {
    const base = {
      id: q.id,
      text: q.questionText,
      marks: q.marks,
    };
    if ((exam.examType || '').toUpperCase() === 'MCQ') {
      const opts = q.options || [];
      const correctIdx = opts.findIndex(
        (o) => o?.trim().toLowerCase() === (q.correctAnswer || '').trim().toLowerCase(),
      );
      return { ...base, options: opts, correctAnswer: correctIdx >= 0 ? correctIdx : 0 };
    }
    return base;
  });

  return { examData, questions, examType: (exam.examType || 'MCQ').toLowerCase() };
}

/** Format epoch ms timestamp for display */
export function formatDateTime(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString();
}

export function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString();
}

// ─── Exam API ─────────────────────────────────────────────────────────────────

export const examApi = {
  getPublished: (page = 0, size = 50) =>
    apiFetch(`/api/exams/published?page=${page}&size=${size}`),

  getMyExams: (page = 0, size = 50) =>
    apiFetch(`/api/exams/my-exams?page=${page}&size=${size}`),

  getExam: (examId) => apiFetch(`/api/exams/${examId}`),

  createExam: (payload) =>
    apiFetch('/api/exams', { method: 'POST', body: JSON.stringify(payload) }),

  updateExam: (examId, payload) =>
    apiFetch(`/api/exams/${examId}`, { method: 'PUT', body: JSON.stringify(payload) }),

  deleteExam: (examId) => apiFetch(`/api/exams/${examId}`, { method: 'DELETE' }),

  submitExam: (examId, answers, integrity = {}) =>
    apiFetch(`/api/exams/${examId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, ...integrity }),
    }),

  getSubmissions: (page = 0, size = 50) =>
    apiFetch(`/api/exams/submissions?page=${page}&size=${size}`),

  getMySubmissions: (page = 0, size = 50) =>
    apiFetch(`/api/exams/my-submissions?page=${page}&size=${size}`),

  getSubmission: (submissionId) => apiFetch(`/api/exams/submissions/${submissionId}`),

  gradeSubmission: (submissionId, questionGrades, feedback) =>
    apiFetch(`/api/exams/submissions/${submissionId}/grade`, {
      method: 'POST',
      body: JSON.stringify({ questionGrades, feedback }),
    }),
};

// ─── Chat API ─────────────────────────────────────────────────────────────────

export const chatApi = {
  getGlobal: (page = 0, size = 50) =>
    apiFetch(`/api/chat/global?page=${page}&size=${size}`),

  sendGlobal: (content) =>
    apiFetch('/api/chat/global', { method: 'POST', body: JSON.stringify({ content }) }),

  getPrivate: (otherUserId) => apiFetch(`/api/chat/private/${otherUserId}`),

  sendPrivate: (receiverId, content) =>
    apiFetch('/api/chat/private', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content }),
    }),

  getConversations: () => apiFetch('/api/chat/conversations'),
};
