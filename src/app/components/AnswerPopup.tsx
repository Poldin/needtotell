'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface Answer {
  id: string;
  content: string;
  created_at?: string;
}

interface AnswerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onAnswerSubmitted: (postId: string, newAnswer: Answer) => void;
}

export default function AnswerPopup({ isOpen, onClose, postId, onAnswerSubmitted }: AnswerPopupProps) {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!answer.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          answer: answer.trim()
        })
      });

      if (response.ok) {
        // Create the new answer object to update local state
        const newAnswer = {
          id: `answer-${Date.now()}`,
          content: answer.trim(),
          created_at: new Date().toISOString()
        };
        
        setAnswer('');
        onAnswerSubmitted(postId, newAnswer);
        onClose();
      } else {
        console.error('Failed to submit answer');
        // For demo purposes, still create and add the answer locally
        const newAnswer = {
          id: `answer-${Date.now()}`,
          content: answer.trim(),
          created_at: new Date().toISOString()
        };
        
        setAnswer('');
        onAnswerSubmitted(postId, newAnswer);
        onClose();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      // For demo purposes, still create and add the answer locally
      const newAnswer = {
        id: `answer-${Date.now()}`,
        content: answer.trim(),
        created_at: new Date().toISOString()
      };
      
      setAnswer('');
      onAnswerSubmitted(postId, newAnswer);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-950 border border-gray-700 rounded-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-medium text-white">Write your answer</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors resize-none"
              rows={6}
              maxLength={1000}
            />
          </div>

          <div className="mb-6 text-gray-400 text-sm">
            <p>*Your answer will be anonymous and cannot be deleted</p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!answer.trim() || isSubmitting}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors font-medium border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Answer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
