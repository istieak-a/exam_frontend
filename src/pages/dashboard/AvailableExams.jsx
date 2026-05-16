'use client';

import { useState } from 'react';
import { ExamCard } from '../../components/dashboard';
import { availableExams as mockAvailableExams } from '../../data/mockData';

export default function AvailableExams() {
  const [exams] = useState(mockAvailableExams);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  const filteredExams = exams.filter((exam) => {
    const course = exam.course || exam.subject || '';
    const matchesSearch =
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.toLowerCase().includes(searchQuery.toLowerCase());
    const status = exam.status?.toLowerCase();
    const matchesStatus = filterStatus === 'all' || status === filterStatus;
    const matchesDifficulty = filterDifficulty === 'all' || exam.difficulty === filterDifficulty;
    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  return (
    <div className="space-y-8">
      <header className="border-b border-hairline pb-6">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">Catalog</p>
        <h1 className="mt-2 font-display text-[36px] leading-tight tracking-[-0.02em] text-ink md:text-[42px]">
          Available exams
        </h1>
        <p className="mt-2 text-sm text-muted">
          {filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''} ready to take
        </p>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-muted">
            search
          </span>
          <input
            type="text"
            placeholder="Search by title or course…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-md border border-hairline bg-canvas pl-9 pr-3 text-sm text-ink placeholder:text-muted-soft focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-10 rounded-md border border-hairline bg-canvas px-3 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={filterDifficulty}
          onChange={(e) => setFilterDifficulty(e.target.value)}
          className="h-10 rounded-md border border-hairline bg-canvas px-3 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {filteredExams.length > 0 ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} role="student" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-hairline bg-surface-soft p-12 text-center">
          <span className="material-symbols-outlined text-[40px] text-muted">search_off</span>
          <h3 className="mt-3 font-display text-[22px] leading-tight text-ink">
            Nothing matches that.
          </h3>
          <p className="mt-2 text-sm text-muted">
            Try a different search term or relax the filters.
          </p>
        </div>
      )}
    </div>
  );
}

