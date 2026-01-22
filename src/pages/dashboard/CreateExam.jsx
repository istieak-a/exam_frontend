'use client';

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { teacherExams, examQuestions } from '../../data/mockData';

export default function CreateExam() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  
  const [isLoading, setIsLoading] = useState(true);
  const [examType, setExamType] = useState('mcq'); // 'mcq' or 'cq'
  const [examData, setExamData] = useState({
    title: '',
    course: '',
    description: '',
    duration: '',
    totalMarks: '',
    passingMarks: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });
  const [questions, setQuestions] = useState([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  useEffect(() => {
    // Load exam data if in edit mode
    if (isEditMode) {
      const examToEdit = teacherExams.find(e => e.id === editId);
      if (examToEdit) {
        setExamData({
          title: examToEdit.title || '',
          course: examToEdit.subject || '',
          description: examToEdit.description || '',
          duration: examToEdit.duration?.toString() || '',
          totalMarks: examToEdit.totalMarks?.toString() || '',
          passingMarks: examToEdit.passingMarks?.toString() || '',
          startDate: examToEdit.startDate || '',
          startTime: examToEdit.startTime || '',
          endDate: examToEdit.dueDate || '',
          endTime: examToEdit.endTime || '',
        });
        
        // Load questions for this exam
        const existingQuestions = examQuestions[editId] || [];
        setQuestions(existingQuestions);
        
        // Set exam type based on questions
        if (existingQuestions.length > 0) {
          const hasMCQ = existingQuestions.some(q => q.type === 'mcq');
          setExamType(hasMCQ ? 'mcq' : 'cq');
        }
      }
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [editId, isEditMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setExamData((prev) => ({ ...prev, [name]: value }));
  };

  const addQuestion = (question) => {
    setQuestions([...questions, { ...question, id: Date.now() }]);
    setShowQuestionForm(false);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Exam Data:', examData);
    console.log('Questions:', questions);
    // Here you would typically send this to your backend
    if (isEditMode) {
      alert('Exam updated successfully!');
      navigate(`/dashboard/exams/${editId}`);
    } else {
      alert('Exam created successfully!');
      navigate('/dashboard/exams');
    }
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? 'Edit Exam' : 'Create New Exam'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {isEditMode 
              ? 'Update exam details and questions' 
              : 'Design and publish new exams for your students'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(isEditMode ? `/dashboard/exams/${editId}` : '/dashboard/exams')}
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 font-medium text-slate-700 transition-all hover:bg-slate-50"
          >
            <span className="material-symbols-outlined text-xl">close</span>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{ background: 'linear-gradient(to right, #0084D1, #006BB3)' }}
            className="flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white shadow-lg transition-all hover:shadow-xl hover:scale-105"
          >
            <span className="material-symbols-outlined text-xl">
              {isEditMode ? 'save' : 'check_circle'}
            </span>
            {isEditMode ? 'Update Exam' : 'Publish Exam'}
          </button>
        </div>
      </div>

      {/* Exam Type Selection */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Exam Type</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => setExamType('mcq')}
            className={`relative flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all ${
              examType === 'mcq'
                ? 'border-slate-200 bg-white hover:border-slate-300'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
            style={examType === 'mcq' ? { borderColor: '#0084D1', backgroundColor: '#F0F9FF' } : {}}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                examType === 'mcq' ? 'text-white' : 'bg-slate-100 text-slate-600'
              }`}
              style={examType === 'mcq' ? { backgroundColor: '#0084D1' } : {}}
            >
              <span className="material-symbols-outlined text-2xl">radio_button_checked</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">MCQ Exam</h3>
              <p className="mt-1 text-sm text-slate-600">
                Multiple Choice Questions with auto-grading
              </p>
            </div>
            {examType === 'mcq' && (
              <span
                className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: '#0084D1' }}
              >
                <span className="material-symbols-outlined text-sm">check</span>
              </span>
            )}
          </button>

          <button
            onClick={() => setExamType('cq')}
            className={`relative flex items-start gap-4 rounded-xl border-2 p-5 text-left transition-all ${
              examType === 'cq'
                ? 'border-slate-200 bg-white hover:border-slate-300'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
            style={examType === 'cq' ? { borderColor: '#0084D1', backgroundColor: '#F0F9FF' } : {}}
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                examType === 'cq' ? 'text-white' : 'bg-slate-100 text-slate-600'
              }`}
              style={examType === 'cq' ? { backgroundColor: '#0084D1' } : {}}
            >
              <span className="material-symbols-outlined text-2xl">edit_note</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">CQ Exam</h3>
              <p className="mt-1 text-sm text-slate-600">
                Creative Questions requiring manual grading
              </p>
            </div>
            {examType === 'cq' && (
              <span
                className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: '#0084D1' }}
              >
                <span className="material-symbols-outlined text-sm">check</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Exam Details Form */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Exam Details</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Exam Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={examData.title}
              onChange={handleInputChange}
              placeholder="e.g., Final Exam 2026"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
              onFocus={(e) => {
                e.target.style.borderColor = '#0084D1';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Course <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="course"
              value={examData.course}
              onChange={handleInputChange}
              placeholder="e.g., Advanced Mathematics"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
              onFocus={(e) => {
                e.target.style.borderColor = '#0084D1';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              value={examData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the exam..."
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
              onFocus={(e) => {
                e.target.style.borderColor = '#0084D1';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="duration"
              value={examData.duration}
              onChange={handleInputChange}
              placeholder="60"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
              onFocus={(e) => {
                e.target.style.borderColor = '#0084D1';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Total Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="totalMarks"
              value={examData.totalMarks}
              onChange={handleInputChange}
              placeholder="100"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
              onFocus={(e) => {
                e.target.style.borderColor = '#0084D1';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Passing Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="passingMarks"
              value={examData.passingMarks}
              onChange={handleInputChange}
              placeholder="40"
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
              onFocus={(e) => {
                e.target.style.borderColor = '#0084D1';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={examData.startDate}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
              onFocus={(e) => {
                e.target.style.borderColor = '#0084D1';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="startTime"
              value={examData.startTime}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
              onFocus={(e) => {
                e.target.style.borderColor = '#0084D1';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={examData.endDate}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
              onFocus={(e) => {
                e.target.style.borderColor = '#0084D1';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="endTime"
              value={examData.endTime}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
              onFocus={(e) => {
                e.target.style.borderColor = '#0084D1';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Questions</h2>
            <p className="text-sm text-slate-600">
              {questions.length} question{questions.length !== 1 ? 's' : ''} added
            </p>
          </div>
          <button
            onClick={() => setShowQuestionForm(true)}
            style={{ backgroundColor: '#0084D1' }}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Question
          </button>
        </div>

        {/* Questions List */}
        {questions.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 py-12 text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-slate-400">
              <span className="material-symbols-outlined text-3xl">quiz</span>
            </div>
            <p className="text-sm font-medium text-slate-600">No questions added yet</p>
            <p className="mt-1 text-xs text-slate-500">Click "Add Question" to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {questions.map((question, index) => (
              <QuestionItem
                key={question.id}
                question={question}
                index={index}
                examType={examType}
                onRemove={() => removeQuestion(question.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Question Form Modal */}
      {showQuestionForm && (
        <QuestionFormModal
          examType={examType}
          onClose={() => setShowQuestionForm(false)}
          onAdd={addQuestion}
        />
      )}
    </div>
  );
}

// Question Item Component
function QuestionItem({ question, index, examType, onRemove }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 transition-all hover:border-blue-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: '#0084D1' }}
          >
            {index + 1}
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-900">{question.text}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">
                  {examType === 'mcq' ? 'radio_button_checked' : 'edit_note'}
                </span>
                {examType === 'mcq' ? 'MCQ' : 'Creative'}
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">military_tech</span>
                {question.marks} marks
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-200"
          >
            <span className="material-symbols-outlined text-xl">
              {expanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
          <button
            onClick={onRemove}
            className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50"
          >
            <span className="material-symbols-outlined text-xl">delete</span>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-200 bg-white p-4">
          {examType === 'mcq' ? (
            <div className="space-y-2">
              {question.options.map((option, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-lg border p-3"
                  style={
                    idx === question.correctAnswer
                      ? { borderColor: '#0084D1', backgroundColor: '#F0F9FF' }
                      : { borderColor: '#e2e8f0' }
                  }
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-300 text-xs font-medium">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm text-slate-700">{option}</span>
                  {idx === question.correctAnswer && (
                    <span className="ml-auto text-xs font-medium" style={{ color: '#0084D1' }}>
                      Correct
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">
                Students will provide written answers that require manual grading.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Question Form Modal
function QuestionFormModal({ examType, onClose, onAdd }) {
  const [questionData, setQuestionData] = useState({
    text: '',
    marks: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
  });

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({ ...questionData, options: newOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (examType === 'mcq') {
      onAdd(questionData);
    } else {
      onAdd({ text: questionData.text, marks: questionData.marks });
    }
    setQuestionData({ text: '', marks: '', options: ['', '', '', ''], correctAnswer: 0 });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Add {examType === 'mcq' ? 'MCQ' : 'Creative'} Question
            </h3>
            <p className="text-sm text-slate-600">Fill in the question details below</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Question Text <span className="text-red-500">*</span>
              </label>
              <textarea
                value={questionData.text}
                onChange={(e) => setQuestionData({ ...questionData, text: e.target.value })}
                placeholder="Enter your question here..."
                rows={3}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
                onFocus={(e) => {
                  e.target.style.borderColor = '#0084D1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Marks <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={questionData.marks}
                onChange={(e) => setQuestionData({ ...questionData, marks: e.target.value })}
                placeholder="5"
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
                onFocus={(e) => {
                  e.target.style.borderColor = '#0084D1';
                  e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {examType === 'mcq' && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Options <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {questionData.options.map((option, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-medium text-slate-600">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                          required
                          className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none"
                          onFocus={(e) => {
                            e.target.style.borderColor = '#0084D1';
                            e.target.style.boxShadow = '0 0 0 3px rgba(0, 132, 209, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#cbd5e1';
                            e.target.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Correct Answer <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {questionData.options.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuestionData({ ...questionData, correctAnswer: idx })}
                        className="rounded-lg border-2 py-2.5 text-sm font-medium transition-all"
                        style={
                          questionData.correctAnswer === idx
                            ? {
                                borderColor: '#0084D1',
                                backgroundColor: '#F0F9FF',
                                color: '#0084D1',
                              }
                            : {
                                borderColor: '#e2e8f0',
                                backgroundColor: 'white',
                                color: '#64748b',
                              }
                        }
                      >
                        Option {String.fromCharCode(65 + idx)}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{ background: 'linear-gradient(to right, #0084D1, #006BB3)' }}
              className="flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Loading Skeleton
function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200"></div>
          <div className="mt-2 h-4 w-96 animate-pulse rounded bg-slate-200"></div>
        </div>
        <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200"></div>
      </div>

      {/* Type Selection Skeleton */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-slate-200"></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 animate-pulse rounded-xl bg-slate-200"></div>
          <div className="h-32 animate-pulse rounded-xl bg-slate-200"></div>
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-slate-200"></div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-200"></div>
          ))}
        </div>
      </div>

      {/* Questions Skeleton */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-slate-200"></div>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-200"></div>
        </div>
        <div className="h-48 animate-pulse rounded-lg bg-slate-200"></div>
      </div>
    </div>
  );
}
