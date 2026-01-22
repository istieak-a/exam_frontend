import { Link } from 'react-router-dom';

// Exam Card Component
export function ExamCard({ exam, role = 'student', onAction }) {
  const statusConfig = {
    draft: { color: 'bg-slate-100 text-slate-600', icon: 'draft' },
    published: { color: 'bg-emerald-100 text-emerald-700', icon: 'check_circle' },
    scheduled: { color: 'bg-sky-100 text-sky-700', icon: 'schedule' },
    closed: { color: 'bg-red-100 text-red-700', icon: 'block' },
    active: { color: 'bg-primary/10 text-primary', icon: 'play_circle' },
    completed: { color: 'bg-slate-100 text-slate-600', icon: 'task_alt' },
  };

  const status = statusConfig[exam.status] || statusConfig.draft;

  const difficultyColors = {
    easy: 'text-emerald-600 bg-emerald-50',
    medium: 'text-amber-600 bg-amber-50',
    hard: 'text-red-600 bg-red-50',
  };

  const examTypeConfig = {
    mcq: { label: 'MCQ', color: 'bg-sky-100 text-sky-700', icon: 'radio_button_checked' },
    short: { label: 'Short Answer', color: 'bg-purple-100 text-purple-700', icon: 'edit_note' },
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80 transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-slate-900">{exam.title}</h3>
            {exam.type && examTypeConfig[exam.type] && (
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${examTypeConfig[exam.type].color}`}>
                <span className="material-symbols-outlined text-sm">{examTypeConfig[exam.type].icon}</span>
                {examTypeConfig[exam.type].label}
              </span>
            )}
            {exam.difficulty && (
              <span className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${difficultyColors[exam.difficulty]}`}>
                {exam.difficulty.charAt(0).toUpperCase() + exam.difficulty.slice(1)}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-600">{exam.subject || exam.course}</p>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium ${status.color}`}>
          <span className="material-symbols-outlined text-sm">{status.icon}</span>
          {exam.status.charAt(0).toUpperCase() + exam.status.slice(1)}
        </span>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-slate-400">quiz</span>
          <div>
            <p className="text-xs text-slate-500">Questions</p>
            <p className="font-semibold text-slate-900">{exam.totalQuestions || exam.questions}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-slate-400">schedule</span>
          <div>
            <p className="text-xs text-slate-500">Duration</p>
            <p className="font-semibold text-slate-900">{exam.duration} min</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-lg text-slate-400">star</span>
          <div>
            <p className="text-xs text-slate-500">Total Marks</p>
            <p className="font-semibold text-slate-900">{exam.totalMarks}</p>
          </div>
        </div>
        {role === 'teacher' && exam.submissions !== undefined && (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-slate-400">people</span>
            <div>
              <p className="text-xs text-slate-500">Submissions</p>
              <p className="font-semibold text-slate-900">{exam.submissions}</p>
            </div>
          </div>
        )}
        {role === 'student' && exam.score !== undefined && (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-lg text-slate-400">grade</span>
            <div>
              <p className="text-xs text-slate-500">Score</p>
              <p className="font-semibold text-slate-900">{exam.score}%</p>
            </div>
          </div>
        )}
      </div>

      {/* Date Info */}
      <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
        {exam.startDate && (
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">calendar_today</span>
            <span>Starts: {exam.startDate}</span>
          </div>
        )}
        {exam.dueDate && (
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">event</span>
            <span>Due: {exam.dueDate}</span>
          </div>
        )}
        {exam.completedAt && (
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            <span>Completed: {exam.completedAt}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2">
        {role === 'teacher' ? (
          <>
            <Link
              to={`/dashboard/exam/${exam.id}`}
              className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90"
            >
              View Details
            </Link>
            {exam.status === 'published' && (
              <Link
                to={`/dashboard/exam/${exam.id}/submissions`}
                className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                Submissions
              </Link>
            )}
          </>
        ) : (
          <>
            {exam.status === 'active' || exam.status === 'published' ? (
              <Link
                to={`/dashboard/take-exam/${exam.id}`}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                Take Exam
              </Link>
            ) : exam.status === 'graded' ? (
              <Link
                to={`/dashboard/exam-result/${exam.id}?type=${exam.type}`}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                View Results
              </Link>
            ) : exam.status === 'pending' ? (
              <Link
                to={`/dashboard/exam-result/${exam.id}?type=${exam.type}`}
                className="flex-1 rounded-lg bg-slate-100 px-4 py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
              >
                View Submission
              </Link>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

// Exam Card Skeleton
export function ExamCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="h-6 w-48 rounded bg-slate-200 animate-pulse" />
          <div className="h-4 w-32 rounded bg-slate-200 animate-pulse" />
        </div>
        <div className="h-7 w-20 rounded-lg bg-slate-200 animate-pulse" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 rounded bg-slate-200 animate-pulse" />
        ))}
      </div>
      <div className="mt-4 h-4 w-full rounded bg-slate-200 animate-pulse" />
      <div className="mt-4 flex gap-2">
        <div className="h-9 flex-1 rounded-lg bg-slate-200 animate-pulse" />
        <div className="h-9 w-24 rounded-lg bg-slate-200 animate-pulse" />
      </div>
    </div>
  );
}
