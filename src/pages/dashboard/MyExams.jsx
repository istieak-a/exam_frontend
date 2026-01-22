'use client';

import { useState, useEffect } from 'react';
import { ExamCard, ExamCardSkeleton } from '../../components/dashboard';
import { completedExams } from '../../data/mockData';

export default function MyExams() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('completed'); // 'completed' or 'ongoing'

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Exams</h1>
        <p className="mt-1 text-sm text-slate-600">
          View your exam history and performance
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-lg bg-slate-100 p-1">
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'completed'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">task_alt</span>
            Completed ({completedExams.length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
            activeTab === 'ongoing'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">pending</span>
            Ongoing (0)
          </span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'completed' ? (
        <div>
          {completedExams.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {completedExams.map((exam) => (
                <div key={exam.id} className="relative">
                  <ExamCard exam={exam} role="student" />
                  {exam.status === 'pending' && (
                    <div className="absolute right-4 top-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        Awaiting Results
                      </span>
                    </div>
                  )}
                  {exam.status === 'graded' && exam.score && (
                    <div className="absolute right-4 top-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Score: {exam.score}/{exam.totalMarks}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="task_alt"
              title="No completed exams"
              description="You haven't completed any exams yet"
            />
          )}
        </div>
      ) : (
        <EmptyState
          icon="pending"
          title="No ongoing exams"
          description="You don't have any exams in progress"
        />
      )}
    </div>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200/80">
      <span className="material-symbols-outlined mx-auto text-6xl text-slate-300">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-48 rounded bg-slate-200 animate-pulse" />
        <div className="mt-2 h-4 w-64 rounded bg-slate-200 animate-pulse" />
      </div>
      <div className="h-12 w-full rounded-lg bg-slate-200 animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <ExamCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
