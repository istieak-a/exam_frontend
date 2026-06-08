'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { examApi } from '../../services/api';

export default function ExamResult() {
  const { id: submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examApi.getSubmission(submissionId)
      .then(async (sub) => {
        setSubmission(sub);
        if (sub.examId) {
          const e = await examApi.getExam(sub.examId).catch(() => null);
          setExam(e);
        }
      })
      .catch(() => setSubmission(null))
      .finally(() => setLoading(false));
  }, [submissionId]);

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
          <span className="material-symbols-outlined text-5xl text-muted-soft">assignment</span>
          <h3 className="mt-3 text-lg font-semibold text-ink">Result not found</h3>
          <Link to="/dashboard/my-exams" className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-on-primary">
            Back to My Exams
          </Link>
        </div>
      </div>
    );
  }

  const isPending = submission.status !== 'FULLY_GRADED';

  const isPassed = !isPending && submission.maxScore > 0
    && submission.totalScore >= (exam?.passingMarks ?? submission.maxScore * 0.5);
  const pct = !isPending && submission.maxScore > 0
    ? ((submission.totalScore / submission.maxScore) * 100).toFixed(1)
    : '—';

  const answerMap = {};
  (submission.submissionAnswers || []).forEach((a) => {
    answerMap[a.questionId] = { answer: a.answer, awardedMarks: a.awardedMarks };
  });

  const questions = exam?.questions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/my-exams')}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline text-body transition-colors hover:bg-surface-soft"
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
        </button>
        <div>
          <h1 className="font-display text-[32px] leading-tight tracking-[-0.02em] text-ink">
            {submission.examTitle}
          </h1>
          <p className="mt-1 text-sm text-body">Exam result</p>
        </div>
      </div>

      {/* Score Card */}
      <div className={`rounded-xl border p-8 text-center ${
        isPending
          ? 'border-warning/30 bg-warning/5'
          : isPassed
          ? 'border-success/30 bg-success/5'
          : 'border-error/30 bg-error/5'
      }`}>
        {isPending ? (
          <>
            <span className="material-symbols-outlined text-5xl text-[#7a5a0e]">rate_review</span>
            <h2 className="mt-3 font-display text-[28px] tracking-tight text-ink">Waiting for CQ Review</h2>
            <p className="mt-2 text-body">Your answers have been submitted. Your teacher will review and grade them soon.</p>
          </>
        ) : (
          <>
            <span className={`material-symbols-outlined text-5xl ${isPassed ? 'text-[#2f6e3d]' : 'text-[#8a3636]'}`}>
              {isPassed ? 'emoji_events' : 'sentiment_dissatisfied'}
            </span>
            <p className="mt-3 font-display text-[72px] leading-none text-ink">{pct}%</p>
            <p className="mt-1 text-lg text-body">
              {submission.totalScore}/{submission.maxScore} marks
            </p>
            <span className={`mt-3 inline-block rounded-full px-4 py-1.5 text-sm font-medium ${
              isPassed
                ? 'bg-success/15 text-[#2f6e3d]'
                : 'bg-error/15 text-[#8a3636]'
            }`}>
              {isPassed ? 'Passed' : 'Failed'}
            </span>
          </>
        )}
      </div>

      {/* Stats */}
      {!isPending && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatItem icon="military_tech" label="Score" value={`${submission.totalScore}/${submission.maxScore}`} />
          {submission.mcqScore > 0 && (
            <StatItem icon="radio_button_checked" label="MCQ Score" value={`${submission.mcqScore}`} />
          )}
          {submission.submittedAt && (
            <StatItem icon="schedule" label="Submitted" value={new Date(submission.submittedAt).toLocaleDateString()} />
          )}
        </div>
      )}

      {/* Per-question breakdown */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-[24px] leading-tight tracking-[-0.015em] text-ink">
            Question Breakdown
          </h2>
          {questions.map((q, idx) => {
            const a = answerMap[q.id] || {};
            const answered = !!a.answer;
            const awarded = a.awardedMarks;
            const isMcq = (q.type || '').toUpperCase() === 'MCQ';
            const isCorrect = !isPending && isMcq && answered && a.answer?.trim().toLowerCase() === (q.correctAnswer || '').trim().toLowerCase();

            return (
              <div key={q.id} className="rounded-lg border border-hairline bg-canvas p-5">
                <div className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium text-on-primary ${
                    !isPending && isMcq
                      ? isCorrect ? 'bg-success' : 'bg-error'
                      : 'bg-primary'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-ink">{q.questionText}</p>
                    <p className="mt-0.5 text-xs text-muted">{q.marks} marks</p>

                    <div className="mt-3 rounded-lg bg-surface-soft p-3 border border-hairline">
                      <p className="text-xs font-semibold uppercase tracking-wide text-body-strong mb-1">Your Answer:</p>
                      <p className="text-sm text-ink">{a.answer || <span className="text-muted-soft italic">No answer</span>}</p>
                    </div>

                    {!isPending && isMcq && q.correctAnswer && (
                      <div className="mt-2 rounded-lg bg-success/5 p-3 border border-success/25">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#2f6e3d] mb-1">Correct Answer:</p>
                        <p className="text-sm text-[#2f6e3d]">{q.correctAnswer}</p>
                      </div>
                    )}

                    {!isPending && awarded != null && (
                      <p className="mt-2 text-sm font-medium text-primary">
                        Awarded: {awarded}/{q.marks}
                      </p>
                    )}

                    {isPending && !isMcq && (
                      <p className="mt-2 text-xs text-[#7a5a0e]">Awaiting teacher grading</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end">
        <Link
          to="/dashboard/my-exams"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to My Exams
        </Link>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-hairline bg-canvas p-4">
      <span className="material-symbols-outlined text-2xl text-primary">{icon}</span>
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}
