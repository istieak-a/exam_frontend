'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Saving profile:', formData);
    setIsEditing(false);
    // In a real app, this would save to backend
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
            <div className="text-center">
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                {getInitials(user?.name)}
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">{user?.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{user?.email}</p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
                <span className="material-symbols-outlined text-base">
                  {user?.role === 'teacher' ? 'school' : 'person'}
                </span>
                {user?.role === 'teacher' ? 'Teacher' : 'Student'}
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-left">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                    <span className="material-symbols-outlined text-slate-600">
                      calendar_today
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Joined</p>
                    <p className="text-sm font-medium text-slate-900">{user?.joinedDate}</p>
                  </div>
                </div>
                {user?.studentId && (
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <span className="material-symbols-outlined text-slate-600">
                        badge
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Student ID</p>
                      <p className="text-sm font-medium text-slate-900">{user?.studentId}</p>
                    </div>
                  </div>
                )}
                {user?.department && (
                  <div className="flex items-center gap-3 text-left">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <span className="material-symbols-outlined text-slate-600">
                        domain
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Department</p>
                      <p className="text-sm font-medium text-slate-900">{user?.department}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                  Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200/80 disabled:opacity-60 focus:bg-white focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200/80 disabled:opacity-60 focus:bg-white focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                  className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200/80 disabled:opacity-60 focus:bg-white focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Tell us about yourself"
                  className="mt-1 w-full rounded-lg border-0 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 ring-1 ring-slate-200/80 disabled:opacity-60 focus:bg-white focus:ring-2 focus:ring-primary"
                />
              </div>

              {isEditing && (
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-lg bg-slate-100 px-6 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Security Settings */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/80">
            <h3 className="mb-6 text-lg font-semibold text-slate-900">Security</h3>
            <div className="space-y-4">
              <button className="flex w-full items-center justify-between rounded-lg bg-slate-50 p-4 text-left transition-colors hover:bg-slate-100">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-600">lock</span>
                  <div>
                    <p className="font-medium text-slate-900">Change Password</p>
                    <p className="text-sm text-slate-600">Update your password</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400">
                  chevron_right
                </span>
              </button>

              <button className="flex w-full items-center justify-between rounded-lg bg-slate-50 p-4 text-left transition-colors hover:bg-slate-100">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-600">security</span>
                  <div>
                    <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-600">Add extra security to your account</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-400">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
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
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-[400px] rounded-2xl bg-slate-200 animate-pulse" />
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[400px] rounded-2xl bg-slate-200 animate-pulse" />
          <div className="h-[200px] rounded-2xl bg-slate-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
