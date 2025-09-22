'use client';

import { useState, useEffect } from 'react';
import { Inter } from "next/font/google";
import { useAuth } from '../../lib/auth-context';
import { useRouter } from 'next/navigation';
import PostsList from '../components/PostsList';
import SidebarMenu from "../components/HamburgerMenu";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

interface Answer {
  id: string;
  content: string;
  created_at?: string;
  user_id?: string;
}

interface Post {
  id: string;
  date: string;
  content: string;
  answers?: Answer[] | null;
  sharing_code?: string | null;
  user_id?: string;
}

interface SavedPost {
  id: number;
  created_at: string;
  reaction: string | null;
  need_id: string;
  needs: Post;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'mine' | 'saved'>('mine');
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchData();
  }, [user, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'mine') {
        await fetchMyPosts();
      } else {
        await fetchSavedPosts();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const response = await fetch(`/api/posts?user_id=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setMyPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching my posts:', error);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const response = await fetch('/api/saved');
      if (response.ok) {
        const data = await response.json();
        setSavedPosts(data || []);
      }
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);



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
                  externalPosts={savedPosts.map(saved => saved.needs)}
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
