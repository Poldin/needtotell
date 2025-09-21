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
          
          <p className="mt-6">
            Therefore, we want to create a platform where the problem is sharing and trying to understand what is shared, without the problem of metrics, without the problem of who, how, what, when, without the problem of likes, follows, and other distractions.
          </p>
          
          <p className="mt-6">
            Just sharing.
          </p>
        </div>
      </div>
    </div>
  );
}
