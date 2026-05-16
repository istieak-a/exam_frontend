'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../ui';

export default function Navbar({ onMenuClick }) {
  const { user, isTeacher, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-hairline-soft bg-canvas/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-ink transition-colors hover:bg-surface-soft lg:hidden"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>

          <div className="hidden sm:block">
            <h1 className="font-display text-[20px] font-medium leading-tight tracking-tight text-ink">
              {isTeacher ? 'Teacher workspace' : 'Student workspace'}
            </h1>
            <p className="text-xs text-muted">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden sm:inline-flex">
            <Badge variant={isTeacher ? 'coral-soft' : 'info'} size="sm">
              <span className="material-symbols-outlined text-[14px]">
                {isTeacher ? 'school' : 'person'}
              </span>
              {isTeacher ? 'Teacher' : 'Student'}
            </Badge>
          </span>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-md border border-hairline text-ink transition-colors hover:bg-surface-soft">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute right-1.5 top-1.5 flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary"></span>
            </span>
          </button>

          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-2 rounded-md border border-hairline bg-canvas px-2 py-1.5 transition-colors hover:bg-surface-soft"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
                {getInitials(user?.name)}
              </div>
              <span className="hidden text-sm font-medium text-ink sm:inline">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
              <span className="material-symbols-outlined text-[18px] text-muted">
                {accountOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {accountOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg border border-hairline bg-canvas p-2 shadow-lg">
                <div className="mb-2 rounded-md bg-surface-soft p-3">
                  <p className="text-sm font-medium text-ink">{user?.name}</p>
                  <p className="text-xs text-muted">{user?.email}</p>
                  <div className="mt-2">
                    <Badge variant={isTeacher ? 'coral-soft' : 'info'} size="sm">
                      {isTeacher ? 'Teacher' : 'Student'}
                    </Badge>
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigate('/dashboard/profile');
                    setAccountOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-body transition-colors hover:bg-surface-soft hover:text-ink"
                >
                  <span className="material-symbols-outlined text-[18px] text-muted">
                    account_circle
                  </span>
                  Profile
                </button>

                <button
                  onClick={() => {
                    navigate('/dashboard/support');
                    setAccountOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-body transition-colors hover:bg-surface-soft hover:text-ink"
                >
                  <span className="material-symbols-outlined text-[18px] text-muted">help</span>
                  Help & support
                </button>

                <div className="my-1 h-px bg-hairline-soft" />

                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-error transition-colors hover:bg-error/10"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
