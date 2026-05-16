'use client';

import { useEffect, useState } from 'react';
import { ExamCard, ExamCardSkeleton } from '../../components/dashboard';
import { getMySubmissions } from '../../services/examService';

export default function MyExams() {
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('completed');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setIsLoading(true);
        const data = await getMySubmissions();
        const mappedSubmissions = (data || []).map((submission) => ({
          id: submission.examId,
          submissionId: submission.id,
          title: submission.examTitle,
          examType: submission.examType,
          type: submission.examType,
          totalMarks: submission.maxScore,
          totalQuestions: Object.keys(submission.answers || {}).length,
          duration: 0,
          course: submission.examTitle,
          status: submission.status,
          score: submission.totalScore,
          totalScore: submission.totalScore,
          maxScore: submission.maxScore,
          submittedAt: submission.submittedAt,
        }));
        setSubmissions(mappedSubmissions);
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, []);

  const completedExams = submissions.filter(
    (s) =>
      s.status === 'graded' ||
      s.status === 'completed' ||
      s.status === 'pending' ||
      s.status === 'in-review',
  );
  const ongoingExams = submissions.filter(
    (s) => s.status === 'in-progress' || s.status === 'started',
  );

  if (isLoading) return <PageSkeleton />;

  const list = activeTab === 'completed' ? completedExams : ongoingExams;

  return (
    <div className="space-y-8">
      <header className="border-b border-hairline pb-6">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">Your history</p>
        <h1 className="mt-2 font-display text-[36px] leading-tight tracking-[-0.02em] text-ink md:text-[42px]">
          My exams
        </h1>
        <p className="mt-2 text-sm text-muted">A quiet record of what you've done.</p>
      </header>

      <div className="inline-flex items-center gap-1 rounded-md bg-surface-soft p-1">
        {[
          { id: 'completed', label: 'Completed', count: completedExams.length, icon: 'task_alt' },
          { id: 'ongoing', label: 'Ongoing', count: ongoingExams.length, icon: 'pending' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-canvas text-ink shadow-sm'
                : 'text-muted hover:text-ink'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            {tab.label}
            <span className="text-xs text-muted">({tab.count})</span>
          </button>
        ))}
      </div>

      {list.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {list.map((exam) => (
            <ExamCard key={`${exam.id}-${exam.submissionId}`} exam={exam} role="student" />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={activeTab === 'completed' ? 'task_alt' : 'pending'}
          title={activeTab === 'completed' ? 'Nothing completed yet.' : 'Nothing in progress.'}
          description={
            activeTab === 'completed'
              ? 'Once you finish an exam, it shows up here with its grade.'
              : "You don't have an exam in progress."
          }
        />
      )}
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-hairline bg-surface-soft p-12 text-center">
      <span className="material-symbols-outlined text-[40px] text-muted">{icon}</span>
      <h3 className="mt-3 font-display text-[22px] leading-tight text-ink">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2 border-b border-hairline pb-6">
        <div className="h-3 w-20 animate-pulse rounded bg-hairline" />
        <div className="h-10 w-64 animate-pulse rounded bg-hairline" />
        <div className="h-3 w-48 animate-pulse rounded bg-hairline" />
      </div>
      <div className="h-10 w-64 animate-pulse rounded-md bg-hairline" />
      <div className="grid gap-5 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <ExamCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
