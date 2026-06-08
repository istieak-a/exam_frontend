'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examApi } from '../../services/api';

export default function GradeSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [submission, setSubmission] = useState(null);
  const [exam, setExam] = useState(null);
  const [grades, setGrades] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    examApi.getSubmission(id)
      .then(async (sub) => {
        setSubmission(sub);
        // Initialize grades from existing awardedMarks
        const initial = {};
        (sub.submissionAnswers || []).forEach((a) => {
          initial[a.questionId] = a.awardedMarks ?? 0;
        });
        setGrades(initial);
        // Also fetch the exam to get question text
        if (sub.examId) {
          const e = await examApi.getExam(sub.examId).catch(() => null);
          setExam(e);
        }
      })
      .catch(() => setSubmission(null))
      .finally(() => setLoading(false));
  }, [id]);

  const examType = (submission?.examType || '').toUpperCase();
  const isAutoGraded = examType === 'MCQ';

  const questions = exam?.questions || [];
  const answerMap = {};
  (submission?.submissionAnswers || []).forEach((a) => {
    answerMap[a.questionId] = a.answer;
  });

  const handleGradeChange = (questionId, value) => {
    const q = questions.find((q) => q.id === questionId);
    const max = q?.marks ?? Infinity;
    setGrades((prev) => ({
      ...prev,
      [questionId]: Math.min(Math.max(0, parseFloat(value) || 0), max),
    }));
  };

  const totalAwarded = Object.values(grades).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const maxScore = submission?.maxScore || 0;
  const pct = maxScore > 0 ? ((totalAwarded / maxScore) * 100).toFixed(1) : '0.0';

  const handleSubmit = async () => {
    setSaveError('');
    setSaving(true);
    try {
      // questionGrades expects {questionId(string): marks(int)}
      const questionGrades = {};
      Object.entries(grades).forEach(([qId, marks]) => {
        questionGrades[String(qId)] = Math.round(marks);
      });
      await examApi.gradeSubmission(id, questionGrades);
      navigate('/dashboard/submissions');
    } catch (err) {
      setSaveError(err.message || 'Failed to save grades.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (ts) => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-hairline border-t-primary" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface-card">
            <span className="material-symbols-outlined text-3xl text-muted-soft">fact_check</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-ink">Submission not found</h3>
          <p className="mb-4 text-sm text-body">The submission you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/dashboard/submissions')}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Submissions
          </button>
        </div>
      </div>
    );
  }

  if (isAutoGraded) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/submissions')}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline text-body transition-colors hover:bg-surface-soft"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <h1 className="font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">MCQ Submission</h1>
        </div>

        <div className="rounded-lg bg-canvas p-6 border border-hairline">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mx-auto mb-4">
            <span className="material-symbols-outlined text-3xl text-[#2f6e3d]">check_circle</span>
          </div>
          <h3 className="text-center text-lg font-semibold text-ink">Auto-Graded</h3>
          <p className="mt-2 text-center text-sm text-body">
            This MCQ exam was automatically graded.
          </p>
          <div className="mt-6 text-center">
            <p className="font-display text-[48px] leading-none text-ink">
              {submission.mcqScore ?? submission.totalScore ?? 0}/{maxScore}
            </p>
            <p className="mt-1 text-sm text-muted">
              Student: <span className="font-medium text-ink">{submission.studentName}</span>
              &nbsp;·&nbsp;{submission.examTitle}
            </p>
          </div>
        </div>

        {/* Show answers */}
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="rounded-lg border border-hairline bg-canvas p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-on-primary">{idx + 1}</div>
                <div className="flex-1">
                  <p className="font-medium text-ink">{q.questionText}</p>
                  <p className="mt-2 text-sm text-muted">
                    Correct: <span className="font-medium text-[#2f6e3d]">{q.correctAnswer}</span>
                    &nbsp;·&nbsp;Student answered: <span className="font-medium text-ink">{answerMap[q.id] || '(no answer)'}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/submissions')}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline text-body transition-colors hover:bg-surface-soft"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h1 className="font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">Grade Submission</h1>
            <p className="mt-1 text-sm text-body">Review and grade student's written answers</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate('/dashboard/submissions')}
            className="flex items-center gap-2 rounded-lg border border-hairline px-4 py-2.5 font-medium text-body-strong transition-all hover:bg-surface-soft"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:opacity-60"
          >
            <span className="material-symbols-outlined text-xl">check_circle</span>
            {saving ? 'Saving…' : 'Save Grades'}
          </button>
        </div>
      </div>

      {saveError && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{saveError}</div>
      )}

      {/* Student & Exam Info */}
      <div className="rounded-lg bg-canvas p-6 shadow-sm border border-hairline">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-[24px] leading-none text-primary">
              {(submission.studentName || 'S').split(' ').map((n) => n[0]).join('').toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-ink">{submission.studentName}</h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-muted-soft">assignment</span>
                <span className="font-medium text-body-strong">{submission.examTitle}</span>
              </div>
            </div>
          </div>
          <span className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
            submission.status === 'FULLY_GRADED'
              ? 'text-[#2f6e3d] bg-success/10 border-success/25'
              : 'text-[#7a5a0e] bg-warning/10 border-warning/30'
          }`}>
            {submission.status === 'FULLY_GRADED' ? 'Graded' : 'Pending Review'}
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3 border-t border-hairline pt-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-muted-soft">schedule</span>
            <div>
              <p className="text-xs text-muted">Submitted At</p>
              <p className="text-sm font-medium text-ink">{formatDate(submission.submittedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-muted-soft">quiz</span>
            <div>
              <p className="text-xs text-muted">Questions</p>
              <p className="text-sm font-medium text-ink">{questions.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-muted-soft">star</span>
            <div>
              <p className="text-xs text-muted">Max Score</p>
              <p className="text-sm font-medium text-ink">{maxScore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="rounded-lg bg-surface-card p-6 border border-hairline">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">Total score</h3>
            <p className="text-sm text-muted">Current grading progress</p>
          </div>
          <div className="text-right">
            <p className="font-display text-[40px] leading-none text-ink">
              {totalAwarded}/{maxScore}
            </p>
            <p className="mt-1 text-sm font-medium text-primary">{pct}%</p>
          </div>
        </div>
      </div>

      {/* Questions & Answers */}
      <div className="space-y-4">
        <h3 className="font-display text-[20px] leading-tight tracking-[-0.015em] text-ink">
          Questions & Answers
        </h3>

        {questions.length === 0 ? (
          <div className="rounded-lg bg-surface-soft p-8 text-center border border-hairline">
            <span className="material-symbols-outlined text-4xl text-muted-soft">quiz</span>
            <p className="mt-2 text-body">No questions loaded</p>
          </div>
        ) : (
          questions.map((question, index) => {
            const studentAnswer = answerMap[question.id] || '';
            const currentGrade = grades[question.id] ?? 0;

            return (
              <div key={question.id} className="rounded-lg bg-canvas p-6 shadow-sm border-2 border-hairline hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-sm font-medium text-on-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-medium text-ink mb-1">{question.questionText}</p>
                    <p className="text-xs text-muted mb-4">{question.marks} marks</p>

                    <div className="mb-4 rounded-lg bg-surface-soft p-4 border border-hairline">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body-strong">Student's Answer:</p>
                      {studentAnswer ? (
                        <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">{studentAnswer}</p>
                      ) : (
                        <p className="text-sm text-muted-soft italic">No answer provided</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 bg-primary/10 p-4 rounded-lg border border-primary/20">
                      <div className="flex-1 max-w-xs">
                        <label className="mb-2 block text-sm font-semibold text-ink">
                          Marks Awarded <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max={question.marks}
                            step="0.5"
                            value={currentGrade}
                            onChange={(e) => handleGradeChange(question.id, e.target.value)}
                            className="w-full rounded-lg border-2 border-blue-300 px-4 py-3 text-base font-semibold text-ink focus:outline-none focus:border-blue-500"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-body">
                            / {question.marks}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-primary">Enter 0–{question.marks}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate('/dashboard/submissions')}
          className="rounded-lg border border-hairline px-6 py-2.5 font-medium text-body-strong transition-all hover:bg-surface-soft"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Grades'}
        </button>
      </div>
    </div>
  );
}
