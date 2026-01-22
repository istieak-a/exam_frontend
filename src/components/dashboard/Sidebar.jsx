'use client';

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Teacher menu items
const teacherMenuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: 'dashboard', exact: true },
  { name: 'Create Exam', href: '/dashboard/create-exam', icon: 'add_circle' },
  { name: 'My Exams', href: '/dashboard/exams', icon: 'assignment' },
  { name: 'Submissions', href: '/dashboard/submissions', icon: 'fact_check' },
  { name: 'Grading', href: '/dashboard/grading', icon: 'grade' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: 'analytics' },
  { name: 'Chat', href: '/dashboard/chat', icon: 'chat' },
];

// Student menu items
const studentMenuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: 'dashboard', exact: true },
  { name: 'Available Exams', href: '/dashboard/available-exams', icon: 'quiz' },
  { name: 'My Exams', href: '/dashboard/my-exams', icon: 'assignment_turned_in' },
  { name: 'Chat', href: '/dashboard/chat', icon: 'chat' },
];

// Bottom menu items (same for both roles)
const bottomMenuItems = [
  { name: 'My Profile', href: '/dashboard/profile', icon: 'account_circle' },
  { name: 'Help & Support', href: '/dashboard/support', icon: 'help' },
  { name: 'Back to Home', href: '/', icon: 'arrow_back' },
];

function SidebarContent({ pathname, onClose }) {
  const { user, isTeacher } = useAuth();
  const menuItems = isTeacher ? teacherMenuItems : studentMenuItems;

  const isActive = (href, exact = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 sm:h-16 items-center gap-3 border-b border-slate-200/80 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
          <span className="material-symbols-outlined text-xl text-white">school</span>
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-800">
          Exam<span className="text-primary">Hub</span>
        </span>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>
        {menuItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                  active
                    ? 'bg-primary/20 text-primary'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-600'
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
              </div>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Menu */}
      <div className="border-t border-slate-200/80 px-3 py-4">
        {bottomMenuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={onClose}
            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-700"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-slate-200">
              <span className="material-symbols-outlined text-lg text-slate-500 transition-colors group-hover:text-slate-600">
                {item.icon}
              </span>
            </div>
            {item.name}
          </Link>
        ))}
      </div>

      {/* User Profile */}
      <div className="border-t border-slate-200/80 p-3">
        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {user ? getInitials(user.name) : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
            <p className="truncate text-xs text-slate-500">
              {isTeacher ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}
            </p>
          </div>
          <Link
            to="/dashboard/profile"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-slate-200/80 bg-white lg:flex">
        <SidebarContent pathname={pathname} onClose={onClose} />
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 lg:hidden ${
          isOpen ? 'flex translate-x-0' : 'flex -translate-x-full'
        }`}
      >
        <SidebarContent pathname={pathname} onClose={onClose} />
      </aside>
    </>
  );
}
