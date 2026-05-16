import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button, SpikeMark } from './ui';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const handleHashClick = (e, href) => {
    if (href.includes('#')) {
      e.preventDefault();
      const [path, hash] = href.split('#');

      if (location.pathname !== path && path) {
        window.location.href = href;
      } else {
        const element = document.getElementById(hash);
        if (element) {
          const offset = 64;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
      }
    }
  };

  const pathname = location.pathname;
  useEffect(() => {
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  if (isAuthPage) return null;

  const navLinks = [
    { href: '/', label: 'Product' },
    { href: '/#features', label: 'Features' },
    { href: '/#how-it-works', label: 'How it works' },
    { href: '/about', label: 'About' },
    { href: '/#faq', label: 'FAQ' },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-canvas/95 backdrop-blur-sm border-b border-hairline-soft">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 sm:px-8 lg:px-10">
          <Link to="/" className="flex items-center gap-2 text-ink">
            <SpikeMark size={18} />
            <span className="font-display text-[20px] font-medium leading-none tracking-tight">
              ExamHub
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const isHashLink = link.href.includes('#');
              return isHashLink ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleHashClick(e, link.href)}
                  className="px-3 py-2 text-sm font-medium text-body transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              ) : (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-ink' : 'text-body hover:text-ink'}`
                  }
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            <Link to="/login">
              <Button variant="link" size="sm">
                Sign in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Try ExamHub</Button>
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-ink transition-colors hover:bg-surface-soft lg:hidden"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-ink/40 transition-opacity duration-200 lg:hidden ${isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed bottom-0 right-0 top-0 z-50 w-80 max-w-full transform bg-canvas border-l border-hairline shadow-2xl transition-transform duration-200 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-hairline-soft px-5 py-4">
            <Link to="/" className="flex items-center gap-2 text-ink" onClick={() => setIsMobileMenuOpen(false)}>
              <SpikeMark size={18} />
              <span className="font-display text-[20px] font-medium leading-none tracking-tight">
                ExamHub
              </span>
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-md p-2 text-ink transition-colors hover:bg-surface-soft"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isHashLink = link.href.includes('#');
                return isHashLink ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      handleHashClick(e, link.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="block rounded-md px-3 py-2.5 text-base font-medium text-body transition-colors hover:bg-surface-soft hover:text-ink"
                  >
                    {link.label}
                  </a>
                ) : (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-md px-3 py-2.5 text-base font-medium transition-colors ${isActive ? 'bg-surface-card text-ink' : 'text-body hover:bg-surface-soft hover:text-ink'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 border-t border-hairline-soft p-5">
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="secondary" className="w-full">
                Sign in
              </Button>
            </Link>
            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full">Try ExamHub</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
