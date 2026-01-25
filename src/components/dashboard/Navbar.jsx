'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ onMenuClick }) {
  const { user, isTeacher, logout } = useAuth();
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
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
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Menu Button & Page Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200 lg:hidden"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>

          {/* Page Title */}
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-slate-800">
              {isTeacher ? 'Teacher Dashboard' : 'Student Dashboard'}
            </h1>
            <p className="text-xs text-slate-500">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</p>
          </div>
        </div>

        {/* Right: Role Badge, Notifications, Account */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Badge */}
          <div
            className={`hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium ${
              isTeacher
                ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isTeacher ? 'school' : 'person'}
            </span>
            <span className="hidden md:inline">{isTeacher ? 'Teacher' : 'Student'}</span>
          </div>

          {/* Notifications */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-slate-200">
            <span className="material-symbols-outlined text-xl">notifications</span>
            {/* Notification Badge */}
            <span className="absolute right-1 top-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
          </button>

          {/* Account Dropdown */}
          <div className="relative" ref={accountRef}>
            <button
              onClick={() => setAccountOpen(!accountOpen)}
              className="flex items-center gap-2 rounded-lg bg-slate-100 p-1.5 pr-3 transition-colors hover:bg-slate-200"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-white">
                {getInitials(user?.name)}
              </div>
              <span className="hidden text-sm font-medium text-slate-700 sm:inline">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
              <span className="material-symbols-outlined text-lg text-slate-400">
                {accountOpen ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {/* Dropdown Menu */}
            {accountOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white p-2 shadow-lg ring-1 ring-slate-200/80">
                {/* User Info */}
                <div className="mb-2 rounded-lg bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${
                        isTeacher
                          ? 'bg-primary/10 text-primary'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-xs">
                        {isTeacher ? 'school' : 'person'}
                      </span>
                      {isTeacher ? 'Teacher' : 'Student'}
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <button
                  onClick={() => {
                    navigate('/dashboard/profile');
                    setAccountOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <span className="material-symbols-outlined text-lg">account_circle</span>
                  My Profile
                </button>

                <button
                  onClick={() => {
                    navigate('/dashboard/support');
                    setAccountOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <span className="material-symbols-outlined text-lg">help</span>
                  Help & Support
                </button>



                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
