'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Plus, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

export default function SidebarMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-950 hover:bg-gray-800 text-white p-2 rounded-lg transition-colors border border-gray-700 flex items-center justify-center z-50 relative"
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
          onClick={closeMenu}
        />
      )}

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gray-950 border-l border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-white">Menu</h2>
          <button
            onClick={closeMenu}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar content - scrollable */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Navigation links */}
          <nav className="flex-1 py-4 overflow-y-auto">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-3 px-6 py-4 text-white hover:bg-gray-800 transition-colors border-b border-gray-800"
              >
                Home
              </Link>

            <Link
              href="/new"
              onClick={closeMenu}
              className="flex items-center gap-3 px-6 py-4 text-white hover:bg-gray-800 transition-colors border-b border-gray-800"
            >
              <Plus className="w-4 h-4" />
              New need
            </Link>

            <Link
              href="/why"
              onClick={closeMenu}
              className="flex items-center gap-3 px-6 py-4 text-white hover:bg-gray-800 transition-colors border-b border-gray-800"
            >
              Why all this?
            </Link>

            {user && (
              <Link
                href="/profile"
                onClick={closeMenu}
                className="flex items-center gap-3 px-6 py-4 text-white hover:bg-gray-800 transition-colors border-b border-gray-800"
              >
                Profile
              </Link>
            )}
          </nav>

          {/* User section at bottom - always visible */}
          <div className="flex-shrink-0">
            {user ? (
              <div className="p-4">
                <div className="px-2 py-3 text-gray-400 text-sm border-b border-gray-800 mb-2">
                  <div className="text-white mt-1 font-medium truncate">{user.email}</div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-2 py-3 text-white hover:bg-gray-800 transition-colors w-full text-left rounded-lg"
                >
                  <LogOut className="w-4 h-4 text-red-700" />
                  log out
                </button>
              </div>
            ) : (
              <div className="p-4">
                <Link
                  href="/auth/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-2 py-3 text-white hover:bg-gray-800 transition-colors rounded-lg"
                >
                  <LogIn className="w-4 h-4" />
                  Sign in
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
