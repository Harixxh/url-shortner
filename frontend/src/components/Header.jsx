import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Create URL', path: '/create' },
  { label: 'My URLs', path: '/urls' },
  { label: 'Profile', path: '/profile' }
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm">
      <div className="container-custom flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => {
              navigate('/dashboard');
              setMenuOpen(false);
            }}
            className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#4338CA] to-[#4F46E5]"
          >
            Short.link
          </button>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white p-3 text-slate-700 hover:bg-slate-100 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`flex flex-col gap-3 md:flex-row md:items-center md:gap-4 ${menuOpen ? 'pb-4 md:pb-0' : 'hidden md:flex'}`}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-gradient-to-r from-[#4F46E5] to-[#4338CA] text-white shadow-lg shadow-[#4F46E5]/20' : 'text-slate-700 hover:text-slate-900 hover:bg-[#EEF2FF]'}`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <div className="rounded-3xl border border-[#E0E7FF] bg-[#F8FAFF] px-4 py-3 text-sm text-[#374151]">
            <p className="font-semibold text-[#1E1B4B]">{user?.name}</p>
            <p className="text-xs text-[#6B7280]">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
