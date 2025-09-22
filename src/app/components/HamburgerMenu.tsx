'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Plus, HelpCircle, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="relative" ref={menuRef}>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-950 hover:bg-gray-800 text-white p-2 rounded-lg transition-colors border border-gray-700 flex items-center justify-center"
        aria-label="Menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Menu overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={closeMenu} />
      )}

      {/* Menu dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-950 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {/* New */}
            <Link
              href="/new"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New
            </Link>

            {/* Why */}
            <Link
              href="/why"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Why
            </Link>

            {/* Divider */}
            <div className="border-t border-gray-700 my-2"></div>

            {/* Auth actions */}
            {user ? (
              <>
                <div className="px-4 py-2 text-gray-400 text-sm border-b border-gray-700">
                  {user.email}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-gray-800 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
