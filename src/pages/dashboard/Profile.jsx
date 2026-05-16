'use client';

import { useEffect, useState } from 'react';
import { Badge, Button, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const getInitials = (name) =>
    name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isTeacher = user?.role === 'TEACHER' || user?.role === 'teacher';

  return (
    <div className="space-y-8">
      <header className="border-b border-hairline pb-6">
        <p className="text-xs uppercase tracking-[0.15em] text-muted">Account</p>
        <h1 className="mt-2 font-display text-[36px] leading-tight tracking-[-0.02em] text-ink md:text-[42px]">
          Profile
        </h1>
        <p className="mt-2 text-sm text-muted">Account, identity, and the way you sign in.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <aside className="lg:col-span-1">
          <div className="rounded-lg border border-hairline bg-canvas p-7">
            <div className="text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 font-display text-[32px] leading-none text-primary">
                {getInitials(user?.fullName)}
              </div>
              <h2 className="mt-5 font-display text-[24px] leading-tight tracking-[-0.015em] text-ink">
                {user?.fullName}
              </h2>
              <p className="mt-1 text-sm text-muted">{user?.email}</p>
              <div className="mt-4 inline-flex">
                <Badge variant={isTeacher ? 'coral-soft' : 'info'} size="sm">
                  <span className="material-symbols-outlined text-[13px]">
                    {isTeacher ? 'school' : 'person'}
                  </span>
                  {isTeacher ? 'Teacher' : 'Student'}
                </Badge>
              </div>
            </div>

            <div className="mt-6 space-y-3 border-t border-hairline-soft pt-5">
              <ProfileField icon="calendar_today" label="Joined" value={formatDate(user?.createdAt)} />
              {user?.studentId && (
                <ProfileField icon="badge" label="Student ID" value={user.studentId} />
              )}
              {user?.department && (
                <ProfileField icon="domain" label="Department" value={user.department} />
              )}
            </div>
          </div>
        </aside>

        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-hairline bg-canvas p-7">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">
                Personal information
              </h3>
              {!isEditing && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Edit
                </Button>
              )}
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <Input
                label="Phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="+1 (555) 555-5555"
              />

              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="A short paragraph about yourself…"
                  className="w-full resize-y rounded-md border border-hairline bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-muted-soft transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-soft disabled:text-muted"
                />
              </div>

              {isEditing && (
                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit">Save changes</Button>
                  <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </section>

          <section className="rounded-lg border border-hairline bg-canvas p-7">
            <h3 className="mb-5 font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">
              Security
            </h3>
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="flex w-full items-center justify-between rounded-md border border-hairline bg-surface-soft p-4 text-left transition-colors hover:bg-surface-card"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-canvas text-ink">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">Change password</p>
                  <p className="text-xs text-muted">Update your sign-in credentials</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-[18px] text-muted">chevron_right</span>
            </button>
          </section>
        </div>
      </div>

      {isChangePasswordOpen && (
        <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />
      )}
    </div>
  );
}

function ProfileField({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-soft text-ink">
        <span className="material-symbols-outlined text-[18px]">{icon}</span>
      </div>
      <div className="min-w-0 leading-tight">
        <p className="text-[11px] uppercase tracking-[0.12em] text-muted-soft">{label}</p>
        <p className="truncate text-sm text-ink">{value}</p>
      </div>
    </div>
  );
}

function ChangePasswordModal({ onClose }) {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setSuccess('Password updated.');
    setTimeout(() => {
      onClose();
      setSuccess('');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-hairline bg-canvas p-7 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-[22px] leading-tight tracking-[-0.015em] text-ink">
            Change password
          </h3>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-surface-soft hover:text-ink"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-error/30 bg-error/10 p-3 text-xs text-[#8a3636]">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md border border-success/30 bg-success/15 p-3 text-xs text-[#2f6e3d]">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Current password"
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handleChange}
            required
          />
          <Input
            label="New password"
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handleChange}
            required
          />
          <Input
            label="Confirm new password"
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handleChange}
            required
          />

          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Update password</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

