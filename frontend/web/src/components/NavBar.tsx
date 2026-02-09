'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { LogOut, LogIn, User } from 'lucide-react';

export default function NavBar() {
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link href="/" className="logo">
          VideoTranscoder
        </Link>
        <div className="nav-links">
          <Link href="/" className="nav-link">
            Upload
          </Link>
          <Link href="/jobs" className="nav-link">
            My Videos
          </Link>

          {!isLoading && (
            <>
              {isAuthenticated ? (
                <div className="nav-user">
                  <span className="nav-user-name">
                    <User size={16} />
                    {user?.name || user?.email?.split('@')[0]}
                  </span>
                  <button onClick={logout} className="btn btn-ghost btn-sm">
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="btn btn-primary btn-sm">
                  <LogIn size={16} />
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
