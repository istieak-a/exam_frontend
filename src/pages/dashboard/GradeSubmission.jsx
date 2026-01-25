'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubmissionById, gradeSubmission, getExamById } from '../../services/examService';

export default function GradeSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);
  const [saveError, setSaveError] = useState(null);
  
  // Initialize grades state for CQ exams only
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch submission
        const data = await getSubmissionById(id);
        setSubmission(data);
        
        // Fetch the exam to get questions
        if (data.examId) {
          const examData = await getExamById(data.examId, { includeQuestions: true });
          setExam(examData);
          
          const examQuestionList = examData.questions || [];
          setQuestions(examQuestionList);
          
          // Initialize grades for CQ exams
          if (data.examType?.toLowerCase() !== 'mcq') {
            setGrades(examQuestionList.map((q, index) => ({
              questionId: q.id,
              questionNumber: index + 1,
              marks: data.questionGrades?.[q.id] || 0,
              maxMarks: q.marks,
            })));
          }
        }
      } catch (err) {
        console.error('Failed to fetch submission:', err);
        setError('Submission not found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [id]);

  // Determine exam type from submission
  const examType = submission?.examType?.toLowerCase() || 'cq';
  const isAutoGraded = examType === 'mcq';

  // Helper function to format timestamp
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to calculate time taken (if available)
  const getTimeTaken = () => {
    // This would need to be calculated based on exam start and submission time
    // For now, return a placeholder
    return 'N/A';
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (error || !submission) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <span className="material-symbols-outlined text-3xl text-slate-400">fact_check</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">Submission not found</h3>
          <p className="mb-4 text-sm text-slate-600">{error || "The submission you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate('/dashboard/submissions')}
            style={{ backgroundColor: '#0084D1' }}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Submissions
          </button>
        </div>
      </div>
    );
  }

  // If exam is auto-graded (MCQ only), redirect to view mode
  if (isAutoGraded) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <span className="material-symbols-outlined text-3xl text-green-600">check_circle</span>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-900">MCQ Exam - Auto-Graded</h3>
          <p className="mb-4 text-sm text-slate-600">
            This is an MCQ exam and has been automatically graded. No manual grading required.
          </p>
          <button
            onClick={() => navigate('/dashboard/submissions')}
            style={{ backgroundColor: '#0084D1' }}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Submissions
          </button>
        </div>
      </div>
    );
  }

  const handleGradeChange = (questionId, value) => {
    setGrades(grades.map(g => 
      g.questionId === questionId 
        ? { ...g, marks: Math.min(Math.max(0, parseFloat(value) || 0), g.maxMarks) }
        : g
    ));
  };

  const calculateTotalMarks = () => {
    if (isAutoGraded) {
      return submission.mcqScore || 0;
    }
    return grades.reduce((sum, g) => sum + g.marks, 0);
  };

  const calculateMaxMarks = () => {
    return submission?.maxScore || questions.reduce((sum, q) => sum + q.marks, 0);
  };

  const calculatePercentage = () => {
    const total = calculateTotalMarks();
    const max = calculateMaxMarks();
    return max > 0 ? ((total / max) * 100).toFixed(2) : 0;
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Format grades for API submission - convert array to map of questionId -> marks
      const questionGradesMap = {};
      grades.forEach(g => {
        questionGradesMap[g.questionId] = Math.round(g.marks); // Ensure integer marks
      });
      
      const gradeData = {
        questionGrades: questionGradesMap,
      };
      
      await gradeSubmission(id, gradeData);
      navigate('/dashboard/submissions');
    } catch (err) {
      console.error('Failed to save grades:', err);
      
      if (err.status === 403) {
        setSaveError('You do not have permission to grade this submission.');
      } else if (err.status === 400) {
        setSaveError(err.message || 'Invalid grade data. Please check your input.');
      } else {
        setSaveError(err.message || 'Failed to save grades. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard/submissions')}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Grade Submission</h1>
              <p className="mt-1 text-sm text-slate-600">
                Review and grade student's exam submission
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/dashboard/submissions')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-xl">close</span>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            style={{ backgroundColor: '#0084D1' }}
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xl">
              {isSaving ? 'hourglass_empty' : 'check_circle'}
            </span>
            {isSaving ? 'Saving...' : 'Save Grades'}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {saveError && (
        <div className="rounded-lg bg-red-50 border-2 border-red-200 p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-red-600">error</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Error Saving Grades</p>
            <p className="text-sm text-red-700 mt-1">{saveError}</p>
          </div>
          <button
            onClick={() => setSaveError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
      )}

      {/* Student & Exam Info */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-xl font-bold text-white">
              {submission.studentName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'S'}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">{submission.studentName}</h2>
              <p className="text-sm text-slate-600">ID: {submission.studentId}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-slate-400">assignment</span>
                <span className="font-medium text-slate-700">{submission.examTitle}</span>
              </div>
            </div>
          </div>
          
          <span
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              submission.status === 'FULLY_GRADED'
                ? 'text-green-700 bg-green-50 border-green-200'
                : 'text-amber-700 bg-amber-50 border-amber-200'
            }`}
          >
            {submission.status === 'FULLY_GRADED' ? 'Graded' : 'Pending Review'}
          </span>
        </div>
        
        <div className="mt-4 grid gap-4 sm:grid-cols-3 border-t border-slate-200 pt-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400">schedule</span>
            <div>
              <p className="text-xs text-slate-500">Submitted At</p>
              <p className="text-sm font-medium text-slate-900">{formatDate(submission.submittedAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400">quiz</span>
            <div>
              <p className="text-xs text-slate-500">Questions</p>
              <p className="text-sm font-medium text-slate-900">{questions.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-slate-400">star</span>
            <div>
              <p className="text-xs text-slate-500">Max Score</p>
              <p className="text-sm font-medium text-slate-900">{submission.maxScore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Score Summary */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Total Score</h3>
            <p className="text-sm text-blue-700">Current grading progress</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-blue-900">
              {calculateTotalMarks()}/{calculateMaxMarks()}
            </p>
            <p className="mt-1 text-sm font-medium text-blue-700">
              {calculatePercentage()}%
            </p>
          </div>
        </div>
      </div>

      {/* Questions Grading */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-slate-900">Questions & Answers</h3>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {questions.length} Question{questions.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        {questions.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-8 text-center border border-slate-200">
            <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">quiz</span>
            <p className="text-slate-600">No questions found for this exam</p>
          </div>
        ) : (
          questions.map((question, index) => {
            const gradeIndex = grades.findIndex(g => g.questionId === question.id);
            const studentAnswer = submission.answers?.[question.id] || '';
            
            return (
              <div key={question.id} className="rounded-2xl bg-white p-6 shadow-sm border-2 border-slate-200 hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg text-white font-bold"
                    style={{ backgroundColor: '#0084D1' }}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-base font-medium text-slate-900 mb-2">{question.questionText || question.question}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">edit_note</span>
                              {question.type === 'MCQ' ? 'Multiple Choice' : 'Creative Question'}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">military_tech</span>
                              {question.marks} mark{question.marks !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Student's Answer */}
                    <div className="mb-4 rounded-lg bg-slate-50 p-4 border border-slate-200">
                      <p className="mb-2 text-xs font-semibold text-slate-700 uppercase tracking-wide">Student's Answer:</p>
                      {studentAnswer ? (
                        <p className="text-sm text-slate-900 whitespace-pre-wrap leading-relaxed">
                          {studentAnswer}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400 italic">No answer provided</p>
                      )}
                    </div>

                  {/* Marks Input */}
                    <div className="flex items-center gap-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex-1 max-w-xs">
                        <label className="mb-2 block text-sm font-semibold text-blue-900">
                          Marks Awarded <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max={question.marks}
                            step="0.5"
                            value={gradeIndex >= 0 ? grades[gradeIndex].marks : 0}
                            onChange={(e) => handleGradeChange(question.id, e.target.value)}
                            className="w-full rounded-lg border-2 border-blue-300 px-4 py-3 text-base font-semibold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-600">
                            / {question.marks}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <span className="material-symbols-outlined text-lg">info</span>
                        <span>Enter marks between 0 and {question.marks}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => navigate('/dashboard/submissions')}
          className="rounded-lg border border-slate-200 px-6 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          style={{ backgroundColor: '#0084D1' }}
          className="rounded-lg px-6 py-2.5 font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Grades'}
        </button>
      </div>
    </div>
  );
}

// Loading Skeleton
function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200"></div>
          <div>
            <div className="h-8 w-96 animate-pulse rounded-lg bg-slate-200"></div>
            <div className="mt-2 h-4 w-80 animate-pulse rounded bg-slate-200"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 animate-pulse rounded-lg bg-slate-200"></div>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200"></div>
        </div>
      </div>

      {/* Info Skeleton */}
      <div className="h-48 animate-pulse rounded-2xl bg-slate-200"></div>

      {/* Score Skeleton */}
      <div className="h-32 animate-pulse rounded-2xl bg-slate-200"></div>

      {/* Questions Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-64 animate-pulse rounded-2xl bg-slate-200"></div>
        ))}
      </div>
    </div>
  );
}
