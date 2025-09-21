'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageCircle, Reply, ChevronDown, ChevronUp, Share } from 'lucide-react';
import AnswerPopup from './AnswerPopup';

interface Answer {
  id: string;
  content: string;
  created_at?: string;
}

interface Post {
  id: string;
  date: string;
  content: string;
  answers?: Answer[] | null;
  sharing_code?: string | null;
}

interface PostsListProps {
  searchQuery: string;
}

export default function PostsList({ searchQuery }: PostsListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isAnswerPopupOpen, setIsAnswerPopupOpen] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(new Set());

  const fetchPosts = useCallback(async (pageNum: number, search: string = '', reset: boolean = false) => {
    try {
      if (pageNum === 0) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams({
        page: pageNum.toString(),
        ...(search && { search })
      });

      const response = await fetch(`/api/posts?${params}`);
      const data = await response.json();

      if (response.ok) {
        if (reset || pageNum === 0) {
          setPosts(data.posts);
        } else {
          setPosts(prev => [...prev, ...data.posts]);
        }
        setHasMore(data.hasMore);
        setPage(pageNum);
      } else {
        console.error('API Error:', data.error);
        // Fallback to sample data if API fails
        if (pageNum === 0) {
          setPosts(getSamplePosts());
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
      // Fallback to sample data if API fails
      if (pageNum === 0) {
        setPosts(getSamplePosts());
        setHasMore(false);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Fallback sample data
  const getSamplePosts = (): Post[] => {
    return [
      { id: '1', date: '09/2025', content: 'Sometimes I wonder if we\'re all just trying to find our place in this vast digital landscape. The connections we make online feel both intimate and distant at the same time.', answers: [{ id: 'a1', content: 'I feel the same way. The digital world can be both connecting and isolating.' }] },
      { id: '2', date: '08/2025', content: 'I\'ve been thinking about the weight of words lately. How a simple message can carry so much meaning, yet sometimes fail to convey what we really want to say.', answers: null },
      { id: '3', date: '09/2025', content: 'There\'s something beautiful about shared silence. Not everything needs to be said, but everything needs to be felt.', answers: [{ id: 'a2', content: 'Silence speaks volumes sometimes.' }, { id: 'a3', content: 'This resonates deeply with me.' }] },
      { id: '4', date: '07/2025', content: 'The morning coffee tastes different when you\'re truly present. No notifications, no rush, just the warmth and the moment.', answers: null },
      { id: '5', date: '09/2025', content: 'I realized today that vulnerability isn\'t weakness—it\'s the courage to show up as yourself, even when you\'re not sure who that is.', answers: null }
    ];
  };

  // Load initial posts
  useEffect(() => {
    fetchPosts(0, searchQuery, true);
  }, [searchQuery, fetchPosts]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchPosts(page + 1, searchQuery);
    }
  };

  const handleAnswerClick = (postId: string) => {
    setSelectedPostId(postId);
    setIsAnswerPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsAnswerPopupOpen(false);
    setSelectedPostId(null);
  };

  const handleAnswerSubmitted = (postId: string, newAnswer: Answer) => {
    // Update local state instead of refetching all posts
    setPosts(prevPosts => 
      prevPosts.map(post => {
        if (post.id === postId) {
          const updatedAnswers = post.answers ? [...post.answers, newAnswer] : [newAnswer];
          return { ...post, answers: updatedAnswers };
        }
        return post;
      })
    );
    
    // Automatically expand the answers section to show the new answer
    setExpandedAnswers(prev => new Set(prev).add(postId));
  };

  const getAnswerCount = (post: Post): number => {
    return post.answers?.length || 0;
  };

  const toggleAnswers = (postId: string) => {
    const newExpanded = new Set(expandedAnswers);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedAnswers(newExpanded);
  };

  const getSortedAnswers = (answers: Answer[]) => {
    return [...answers].sort((a, b) => {
      if (!a.created_at || !b.created_at) return 0;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
  };

  const handleShare = (post: Post) => {
    if (post.sharing_code) {
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/?src=${post.sharing_code}`;
      
      if (navigator.share) {
        navigator.share({
          title: 'Need to tell',
          text: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
          url: shareUrl,
        });
      } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
          // Potresti aggiungere qui una notifica di successo
          console.log('Link copiato negli appunti');
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-gray-950 border border-gray-700 rounded-lg p-6 animate-pulse">
            <div className="bg-gray-800 h-3 w-16 rounded mb-4"></div>
            <div className="space-y-2">
              <div className="bg-gray-800 h-4 w-full rounded"></div>
              <div className="bg-gray-800 h-4 w-3/4 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-gray-950 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="text-gray-500 text-xs mb-4">
                {post.date}
              </div>
              <div className="text-white leading-relaxed mb-4">
                {post.content}
              </div>
              
              {/* Answer buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                <div className="flex items-center gap-3">
                  {getAnswerCount(post) > 0 && (
                     <button 
                       onClick={() => toggleAnswers(post.id)}
                       className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                     >
                       <MessageCircle className="w-4 h-4" />
                       <span>Answers</span>
                       {expandedAnswers.has(post.id) ? (
                         <ChevronUp className="w-4 h-4" />
                       ) : (
                         <ChevronDown className="w-4 h-4" />
                       )}
                     </button>
                  )}
                  <button 
                    onClick={() => handleAnswerClick(post.id)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <Reply className="w-4 h-4" />
                    <span>Answer</span>
                  </button>
                </div>
                
                {post.sharing_code && (
                  <button 
                    onClick={() => handleShare(post)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <Share className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Answers section */}
            {expandedAnswers.has(post.id) && post.answers && post.answers.length > 0 && (
              <div className="border-t border-gray-800 bg-gray-900">
                 <div className="p-6">
                  <div className="space-y-4">
                    {getSortedAnswers(post.answers).map((answer) => (
                      <div key={answer.id} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
                        {answer.created_at && (
                          <div className="text-gray-500 text-xs mb-2">
                            {new Date(answer.created_at).toLocaleDateString('en-US', {
                              month: '2-digit',
                              year: 'numeric'
                            }).replace('/', '/')}
                          </div>
                        )}
                        <div className="text-gray-200 leading-relaxed">
                          {answer.content}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {hasMore && (
          <div className="flex justify-center pt-8 pb-12">
            <button 
              onClick={loadMore}
              disabled={loadingMore}
              className="bg-gray-950 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors font-medium border border-gray-700 disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'Load more'}
            </button>
          </div>
        )}
        
        {/* Bottom margin */}
        <div className="h-20"></div>
      </div>

      {/* Answer Popup */}
      <AnswerPopup 
        isOpen={isAnswerPopupOpen}
        onClose={handleClosePopup}
        postId={selectedPostId || ''}
        onAnswerSubmitted={handleAnswerSubmitted}
      />
    </>
  );
}
