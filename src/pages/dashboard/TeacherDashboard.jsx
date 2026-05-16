'use client';

import { Link } from 'react-router-dom';
import {
  ExamCard,
  QuickActionCard,
  StatCard,
} from '../../components/dashboard';
import { useAuth } from '../../context/AuthContext';
import {
  submissions as mockSubmissions,
  teacherActivity,
  teacherExams as mockTeacherExams,
} from '../../data/mockData';

function ActivityItem({ activity }) {
  return (
    <div className="flex items-start gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-surface-soft">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
        <span className="material-symbols-outlined text-[18px]">{activity.icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-ink">{activity.title}</p>
        <p className="text-xs text-muted">{activity.time}</p>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const exams = mockTeacherExams;
  const activity = teacherActivity;

  const activeCount = exams.filter((e) => (e.status || '').toLowerCase() === 'active').length;
  const pendingCount = mockSubmissions.filter(
    (s) => s.status === 'pending' || s.status === 'in-review',
  ).length;
  const gradedSubmissions = mockSubmissions.filter((s) => s.totalScore !== undefined);
  const avgScore = gradedSubmissions.length
    ? gradedSubmissions.reduce((sum, s) => sum + (s.percentage || 0), 0) / gradedSubmissions.length
    : 0;

  const stats = {
    totalExams: exams.length,
    activeExams: activeCount,
    pendingSubmissions: pendingCount,
    averageScore: avgScore.toFixed(1),
  };

  const firstName = user?.name?.split(' ')[0] || 'professor';

  return (
    <div className="space-y-10">
      <header className="border-b border-hairline pb-8">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">Teacher workspace</p>
        <h1 className="mt-3 font-display text-[40px] leading-tight tracking-[-0.02em] text-ink md:text-[48px]">
          Welcome back, {firstName}.
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-body">
          {stats.pendingSubmissions > 0
            ? `${stats.pendingSubmissions} ${stats.pendingSubmissions === 1 ? 'submission is' : 'submissions are'} waiting for a human read. The rest of the world can wait.`
            : 'No submissions to review at the moment. Time to author something thoughtful.'}
        </p>
      </header>

      <section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total exams"
            value={stats.totalExams}
            subtitle="Authored to date"
            icon="assignment"
            variant="primary"
          />
          <StatCard
            title="Active"
            value={stats.activeExams}
            subtitle="Currently open"
            icon="play_circle"
            variant="success"
          />
          <StatCard
            title="In review"
            value={stats.pendingSubmissions}
            subtitle="Awaiting your read"
            icon="pending_actions"
            variant="warning"
          />
          <StatCard
            title="Class average"
            value={`${stats.averageScore}%`}
            subtitle="Across graded"
            icon="trending_up"
            variant="info"
          />
        </div>
      </section>

      <section>
        <div className="mb-5">
          <h2 className="font-display text-[24px] leading-tight tracking-[-0.015em] text-ink">
            Quick actions
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/dashboard/create-exam" className="contents">
            <QuickActionCard
              title="Write a new exam"
              description="Start with a blank page"
              icon="edit_note"
              tone="coral"
            />
          </Link>
          <Link to="/dashboard/submissions" className="contents">
            <QuickActionCard
              title="Grade submissions"
              description="Read & respond"
              icon="fact_check"
              tone="cream"
              variant="success"
            />
          </Link>
          <Link to="/dashboard/chat" className="contents">
            <QuickActionCard
              title="Messages"
              description="Student threads"
              icon="chat"
              tone="dark"
            />
          </Link>
          <Link to="/dashboard/profile" className="contents">
            <QuickActionCard
              title="Profile"
              description="Account & preferences"
              icon="account_circle"
              tone="cream"
              variant="info"
            />
          </Link>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="font-display text-[24px] leading-tight tracking-[-0.015em] text-ink">
              Recent exams
            </h2>
            <Link to="/dashboard/exams" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {exams.length > 0 ? (
              exams.slice(0, 3).map((exam) => (
                <ExamCard key={exam.id} exam={exam} role="teacher" />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-hairline bg-surface-soft p-10 text-center text-sm text-muted">
                No exams yet. Start with{' '}
                <Link to="/dashboard/create-exam" className="text-primary hover:underline">
                  Create exam
                </Link>
                .
              </div>
            )}
          </div>
        </div>

        <aside>
          <h2 className="mb-5 font-display text-[24px] leading-tight tracking-[-0.015em] text-ink">
            Recent activity
          </h2>
          <div className="rounded-lg border border-hairline bg-canvas p-3">
            {activity.length > 0 ? (
              <div className="space-y-1">
                {activity.map((item, index) => (
                  <ActivityItem key={index} activity={item} />
                ))}
              </div>
            ) : (
              <p className="px-3 py-8 text-center text-sm text-muted">No recent activity.</p>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

