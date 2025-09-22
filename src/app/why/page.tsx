import { Inter } from "next/font/google";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "700"], // 100 = ultra-thin, 700 = bold
});

export default function WhyPage() {
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
        <h1 className="text-6xl mb-12 leading-tight">
          <span style={{ fontWeight: 100 }}>What do you </span>
          <span style={{ fontWeight: 700 }}>need to tell</span>
          <span style={{ fontWeight: 100 }}>?</span>
        </h1>
        
        <div className="text-left text-lg leading-relaxed max-w-3xl">
          <p>
            We believe that each person&apos;s need is a great value worth sharing. We believe that as a tech community, we have failed to live up to the promise of a shared web because today&apos;s social media represents a good that comes at an extremely high cost, often excessive.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Beyond Algorithmic Manipulation</h2>
          <p>
            The only way to be correctly exposed to information is through random algorithms, and this is what we intend to pursue. Current platforms use engagement-driven algorithms that trap us in echo chambers and filter bubbles, showing us only what keeps us scrolling rather than what we need to hear or what others genuinely need to share.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Sharing Without Interests</h2>
          <p>
            We want to create a platform where sharing is an act without the ulterior motive of metrics or feedback. When sharing becomes driven by likes, views, or other metrics, it transforms into a political or commercial act, exposed to interests beyond authentic communication. We want to build genuine dialogues, not commercial proposals.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">The Weight of Permanence</h2>
          <p>
            We seek to share with people who understand the effort of writing something that, though anonymous, will remain engraved without the possibility of being modified. This understanding brings awareness of the importance of listening deeply to oneself before clicking send - before sharing a &quot;Need&quot; or responding to someone else&apos;s Need.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Truth Without Pretense</h2>
          <p>
            We seek sharing without prejudice and we seek the truest sharing possible: without Pretense. In a space where your words carry weight because they cannot be taken back, where there are no metrics to chase, and where random exposure ensures authentic discovery, we believe more honest and meaningful exchanges can emerge.
          </p>
          
          <h2 className="text-2xl font-bold mt-10 mb-4">Just Sharing</h2>
          <p>
            Therefore, we want to create a platform where the focus is sharing and trying to understand what is shared, without the problems of metrics, without the problems of who, how, what, when, without the problems of likes, follows, and other distractions that turn authentic human expression into performance.
          </p>
          
          <p className="mt-6 text-xl font-semibold">
            Just sharing. Just listening. Just being human.
          </p>
        </div>
      </div>
    </div>
  );
}
