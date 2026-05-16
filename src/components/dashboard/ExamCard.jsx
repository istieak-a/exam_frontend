import { Link } from 'react-router-dom';
import { Badge } from '../ui';

const statusConfig = {
  draft: { variant: 'pill', icon: 'draft', label: 'Draft' },
  published: { variant: 'coral-soft', icon: 'check_circle', label: 'Published' },
  scheduled: { variant: 'info', icon: 'schedule', label: 'Scheduled' },
  closed: { variant: 'error', icon: 'block', label: 'Closed' },
  active: { variant: 'coral-soft', icon: 'play_circle', label: 'Active' },
  completed: { variant: 'success', icon: 'task_alt', label: 'Completed' },
  graded: { variant: 'success', icon: 'check_circle', label: 'Graded' },
  pending: { variant: 'warning', icon: 'schedule', label: 'Pending' },
  'in-review': { variant: 'warning', icon: 'rate_review', label: 'In review' },
  archived: { variant: 'pill', icon: 'archive', label: 'Archived' },
};

const difficultyConfig = {
  easy: { variant: 'success', label: 'Easy' },
  medium: { variant: 'warning', label: 'Medium' },
  hard: { variant: 'error', label: 'Hard' },
};

const examTypeConfig = {
  mcq: { label: 'MCQ', icon: 'radio_button_checked' },
  cq: { label: 'Written', icon: 'edit_note' },
  short: { label: 'Short answer', icon: 'edit_note' },
};

function Stat({ icon, label, value, valueClass = 'text-ink' }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="material-symbols-outlined text-[18px] text-muted">{icon}</span>
      <div className="leading-tight">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted-soft">{label}</p>
        <p className={`text-sm font-medium ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

export function ExamCard({ exam, role = 'student' }) {
  const examStatus = exam.status?.toLowerCase() || 'draft';
  const status = statusConfig[examStatus] || statusConfig.draft;

  const examType = exam.examType?.toLowerCase() || exam.type?.toLowerCase();
  const duration = exam.durationMinutes || exam.duration;
  const course = exam.course || exam.subject;
  const totalQuestions = exam.totalQuestions || exam.questions?.length || 0;

  return (
    <div className="group relative rounded-lg border border-hairline bg-canvas p-6 transition-colors duration-150 hover:border-primary/40">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">
            {exam.title}
          </h3>
          {course && <p className="mt-1.5 text-sm text-muted">{course}</p>}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {examType && examTypeConfig[examType] && (
              <Badge variant="pill" size="sm">
                <span className="material-symbols-outlined text-[13px]">
                  {examTypeConfig[examType].icon}
                </span>
                {examTypeConfig[examType].label}
              </Badge>
            )}
            {exam.difficulty && difficultyConfig[exam.difficulty] && (
              <Badge variant={difficultyConfig[exam.difficulty].variant} size="sm">
                {difficultyConfig[exam.difficulty].label}
              </Badge>
            )}
          </div>
        </div>
        <Badge variant={status.variant} size="sm">
          <span className="material-symbols-outlined text-[13px]">{status.icon}</span>
          {status.label}
        </Badge>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon="quiz" label="Questions" value={totalQuestions} />
        <Stat icon="schedule" label="Duration" value={`${duration || 0} min`} />
        <Stat icon="star" label="Total marks" value={exam.totalMarks || exam.maxScore} />
        {role === 'teacher' && exam.submissions !== undefined && (
          <Stat icon="people" label="Submissions" value={exam.submissions} />
        )}
        {role === 'student' &&
          (exam.totalScore !== undefined || exam.score !== undefined) &&
          examStatus === 'graded' && (
            <Stat
              icon="grade"
              label="Your score"
              value={`${exam.totalScore ?? exam.score}/${exam.maxScore || exam.totalMarks}`}
              valueClass="text-primary font-medium"
            />
          )}
      </div>

      {(exam.startDateTime || exam.startDate || exam.endDateTime || exam.dueDate || exam.submittedAt) && (
        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-hairline-soft pt-4 text-xs text-muted">
          {(exam.startDateTime || exam.startDate) && (
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              <span>
                Starts{' '}
                {exam.startDateTime
                  ? new Date(exam.startDateTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : exam.startDate}
              </span>
            </div>
          )}
          {(exam.endDateTime || exam.dueDate) && (
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">event</span>
              <span>
                Ends{' '}
                {exam.endDateTime
                  ? new Date(exam.endDateTime).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : exam.dueDate}
              </span>
            </div>
          )}
          {exam.submittedAt && (
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>
                Submitted{' '}
                {new Date(exam.submittedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2">
        {role === 'teacher' ? (
          <>
            <Link
              to={`/dashboard/exam/${exam.id}`}
              className="flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
            >
              View details
            </Link>
            {['published', 'active', 'completed'].includes(examStatus) && (
              <Link
                to={`/dashboard/exam/${exam.id}/submissions`}
                className="inline-flex h-10 items-center justify-center rounded-md border border-hairline bg-canvas px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
              >
                Submissions
              </Link>
            )}
          </>
        ) : (
          <>
            {examStatus === 'active' || examStatus === 'published' ? (
              <Link
                to={`/dashboard/take-exam/${exam.id}`}
                className="flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
              >
                Take exam
              </Link>
            ) : examStatus === 'graded' || examStatus === 'completed' ? (
              <Link
                to={`/dashboard/exam-result/${exam.id}?type=${examType || 'mcq'}`}
                className="flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary transition-colors hover:bg-primary-active"
              >
                View result
              </Link>
            ) : examStatus === 'pending' || examStatus === 'in-review' ? (
              <Link
                to={`/dashboard/exam-result/${exam.id}?type=${examType || 'mcq'}`}
                className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-hairline bg-canvas px-4 text-sm font-medium text-ink transition-colors hover:bg-surface-soft"
              >
                View submission
              </Link>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export function ExamCardSkeleton() {
  return (
    <div className="rounded-lg border border-hairline bg-canvas p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-6 w-48 animate-pulse rounded bg-hairline" />
          <div className="h-4 w-32 animate-pulse rounded bg-hairline" />
        </div>
        <div className="h-6 w-20 animate-pulse rounded-full bg-hairline" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-hairline" />
        ))}
      </div>
      <div className="mt-5 h-px w-full bg-hairline" />
      <div className="mt-5 flex gap-2">
        <div className="h-10 flex-1 animate-pulse rounded-md bg-hairline" />
      </div>
    </div>
  );
}
