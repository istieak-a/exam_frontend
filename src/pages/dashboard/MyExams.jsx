'use client';

import { useState, useEffect } from 'react';
import { ExamCard } from '../../components/dashboard';
import { examApi } from '../../services/api';

function adaptSubmissionForCard(sub) {
  const statusMap = {
    SUBMITTED: 'pending',
    GRADED_MCQ: 'graded',
    FULLY_GRADED: 'graded',
  };
  return {
    id: sub.id,
    examId: sub.examId,
    title: sub.examTitle,
    examType: sub.examType,
    totalMarks: sub.maxScore,
    maxScore: sub.maxScore,
    totalScore: sub.totalScore,
    status: statusMap[sub.status] || 'pending',
    submittedAt: sub.submittedAt,
  };
}

export default function MyExams() {
  const [submissions, setSubmissions] = useState([]);
  const [activeTab, setActiveTab] = useState('completed');

  useEffect(() => {
    examApi.getMySubmissions(0, 100).then((d) => setSubmissions(d.content || [])).catch(() => {});
  }, []);

  const adapted = submissions.map(adaptSubmissionForCard);

  const completedExams = adapted.filter((s) => s.status === 'graded');
  const ongoingExams = adapted.filter((s) => s.status === 'pending');

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
          { id: 'completed', label: 'Graded', count: completedExams.length, icon: 'task_alt' },
          { id: 'ongoing', label: 'Pending review', count: ongoingExams.length, icon: 'pending' },
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
            <ExamCard key={exam.id} exam={exam} role="student" />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={activeTab === 'completed' ? 'task_alt' : 'pending'}
          title={activeTab === 'completed' ? 'Nothing graded yet.' : 'Nothing pending.'}
          description={
            activeTab === 'completed'
              ? 'Once an exam is graded, it shows up here with your score.'
              : "You have no submissions awaiting review."
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
