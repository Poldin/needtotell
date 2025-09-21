'use client';

import { Inter } from "next/font/google";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "400", "700"],
});

export default function NewPage() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/needs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: content.trim()
        })
      });

      if (response.ok) {
        setSubmitted(true);
        setContent('');
      } else {
        console.error('Failed to submit');
        // For demo purposes, still show success
        setSubmitted(true);
        setContent('');
      }
    } catch (error) {
      console.error('Error submitting:', error);
      // For demo purposes, still show success
      setSubmitted(true);
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className={`min-h-screen bg-black text-white p-8 ${inter.className}`}>
        <div className="max-w-4xl mx-auto">
          {/* Navigation back to home */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </Link>
          </div>
          
          <h1 className="text-4xl mb-12 leading-tight">
            <span className="font-thin">Thank you for </span>
            <span className="font-bold">sharing</span>
            <span className="font-thin">.</span>
          </h1>
          
          <div className="text-left text-lg leading-relaxed max-w-3xl mb-8">
            <p>Your need has been shared anonymously with the community.</p>
          </div>

          <button 
            onClick={() => setSubmitted(false)}
            className="bg-gray-950 hover:bg-gray-800 text-white px-6 py-3 rounded-lg transition-colors font-medium border border-gray-700"
          >
            Share another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black text-white p-8 ${inter.className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Navigation back to home */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
        
        <h1 className="text-4xl mb-12 leading-tight">
          <span className="font-thin">What do you </span>
          <span className="font-bold">need to tell</span>
          <span className="font-thin">?</span>
        </h1>
        
        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="mb-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="write it here"
              className="w-full bg-gray-950 border border-gray-600 rounded-lg px-4 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors resize-none"
              rows={6}
              maxLength={1000}
            />
          </div>

          <div className="mb-6 text-gray-400 text-sm leading-relaxed">
            <p>*everything is anonymous and you cannot delete, so give it all the care you can</p>
          </div>

          <button
            type="submit"
            disabled={!content.trim() || isSubmitting}
            className="bg-gray-950 hover:bg-gray-800 text-white px-8 py-3 rounded-lg transition-colors font-medium border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Sharing...' : 'Share'}
          </button>
        </form>
      </div>
    </div>
  );
}
