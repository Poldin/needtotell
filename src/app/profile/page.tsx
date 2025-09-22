'use client';

import { useState, useEffect, useCallback } from 'react';
import { Inter } from "next/font/google";
import { useAuth } from '../../lib/auth-context';
import { useRouter } from 'next/navigation';
import PostsList from '../components/PostsList';
import SidebarMenu from "../components/HamburgerMenu";
import type { Tables } from '../database';

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

type SavedWithNeed = Tables<'saved'> & { needs: Tables<'needs'> };

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'mine' | 'saved'>('mine');
  const [savedPosts, setSavedPosts] = useState<SavedWithNeed[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
  }, [user, router]);

  const fetchSavedPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/saved');
      if (response.ok) {
        const data: SavedWithNeed[] = await response.json();
        setSavedPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'saved') {
      fetchSavedPosts();
    }
  }, [activeTab, fetchSavedPosts]);



  if (!user) {
    return (
      <div className={`min-h-screen bg-black text-white flex items-center justify-center ${inter.className}`}>
        <div className="text-center">
          <div className="text-xl mb-4">Access denied</div>
          <div className="text-gray-400">Please log in to view your profile</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white ${inter.className}`}>
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-4 md:px-8">
          <div className="text-white font-bold">Need to tell</div>
          <div>
            <SidebarMenu />
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gray-950 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-center">{user.email}</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center">
            <button
              onClick={() => setActiveTab('mine')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'mine'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              mine
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'saved'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                saved
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'mine' ? (
          <PostsList 
            searchQuery=""
            userId={user.id}
          />
        ) : (
          loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400">Loading...</div>
            </div>
          ) : (
            <div className="space-y-6">
              {savedPosts.length > 0 ? (
                <PostsList 
                  searchQuery=""
                  externalPosts={savedPosts.map((saved) => {
                    const needs: Tables<'needs'> = saved.needs as Tables<'needs'>;
                    const date = needs.created_at
                      ? new Date(needs.created_at).toLocaleDateString('en-US', { month: '2-digit', year: 'numeric' }).replace('/', '/')
                      : '';
                    return {
                      id: needs.id,
                      date,
                      content: needs.body ?? '',
                      answers: (needs.answers as unknown as { id: string; content: string; created_at?: string; user_id?: string; }[]) || null,
                      sharing_code: needs.sharing_code ?? null,
                    };
                  })}
                  externalLoading={false}
                />
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-lg mb-2">No saved posts</div>
                  <div>Save posts you find interesting to view them here!</div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
