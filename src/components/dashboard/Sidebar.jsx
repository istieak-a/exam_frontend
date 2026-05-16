'use client';

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SpikeMark } from '../ui';

const teacherMenuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: 'dashboard', exact: true },
  { name: 'Create exam', href: '/dashboard/create-exam', icon: 'add_circle' },
  { name: 'My exams', href: '/dashboard/exams', icon: 'assignment' },
  { name: 'Submissions', href: '/dashboard/submissions', icon: 'fact_check' },
  { name: 'Messages', href: '/dashboard/chat', icon: 'chat' },
];

const studentMenuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: 'dashboard', exact: true },
  { name: 'Available exams', href: '/dashboard/available-exams', icon: 'quiz' },
  { name: 'My exams', href: '/dashboard/my-exams', icon: 'assignment_turned_in' },
  { name: 'Messages', href: '/dashboard/chat', icon: 'chat' },
];

const bottomMenuItems = [
  { name: 'Profile', href: '/dashboard/profile', icon: 'account_circle' },
  { name: 'Help & support', href: '/dashboard/support', icon: 'help' },
  { name: 'Back to site', href: '/', icon: 'arrow_back' },
];

function SidebarContent({ pathname, onClose }) {
  const { user, isTeacher } = useAuth();
  const menuItems = isTeacher ? teacherMenuItems : studentMenuItems;

  const isActive = (href, exact = false) =>
    exact ? pathname === href : pathname.startsWith(href);

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserName = () => user?.name || user?.fullName || user?.username || 'User';

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-hairline-soft px-6 text-ink">
        <SpikeMark size={18} />
        <span className="font-display text-[20px] font-medium leading-none tracking-tight">
          ExamHub
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-soft">
          Menu
        </p>
        {menuItems.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-surface-card text-ink'
                  : 'text-body hover:bg-surface-soft hover:text-ink'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${active ? 'text-primary' : 'text-muted'}`}
              >
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-hairline-soft px-3 py-4">
        {bottomMenuItems.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={onClose}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-body transition-colors hover:bg-surface-soft hover:text-ink"
          >
            <span className="material-symbols-outlined text-[20px] text-muted">
              {item.icon}
            </span>
            {item.name}
          </Link>
        ))}
      </div>

      <div className="border-t border-hairline-soft p-3">
        <div className="flex items-center gap-3 rounded-md bg-surface-soft px-3 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-sm font-medium text-primary">
            {getInitials(getUserName())}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">{getUserName()}</p>
            <p className="truncate text-xs text-muted">
              {isTeacher ? 'Teacher' : 'Student'}
            </p>
          </div>
          <Link
            to="/dashboard/profile"
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-canvas hover:text-ink"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
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
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-hairline bg-canvas lg:flex">
        <SidebarContent pathname={pathname} onClose={onClose} />
      </aside>

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-hairline bg-canvas transition-transform duration-200 lg:hidden ${
          isOpen ? 'flex translate-x-0' : 'flex -translate-x-full'
        }`}
      >
        <SidebarContent pathname={pathname} onClose={onClose} />
      </aside>
    </>
  );
}
