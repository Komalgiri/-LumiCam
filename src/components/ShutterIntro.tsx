
import { useEffect, useState } from 'react';
import { Star, Heart } from 'lucide-react';

interface ShutterIntroProps {
  onComplete: () => void;
}

const ShutterIntro = ({ onComplete }: ShutterIntroProps) => {
  const [showCurtain, setShowCurtain] = useState(true);

  useEffect(() => {
    // Start curtain animation after a brief delay
    const curtainTimer = setTimeout(() => {
      setShowCurtain(false);
    }, 500);

    // Move to next screen after animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(curtainTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-kawaii-pink-light via-kawaii-blue-light to-kawaii-lavender-light overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <Star className="absolute top-20 left-20 text-kawaii-pink animate-twinkle" size={24} />
        <Heart className="absolute top-32 right-32 text-kawaii-lavender animate-float" size={20} />
        <Star className="absolute bottom-40 left-40 text-kawaii-blue animate-twinkle" size={28} style={{ animationDelay: '0.5s' }} />
        <Heart className="absolute bottom-20 right-20 text-kawaii-mint animate-float" size={24} style={{ animationDelay: '1s' }} />
        <Star className="absolute top-1/2 left-1/4 text-kawaii-peach animate-twinkle" size={20} style={{ animationDelay: '1.5s' }} />
        <Heart className="absolute top-1/3 right-1/3 text-kawaii-pink animate-float" size={18} style={{ animationDelay: '2s' }} />
      </div>

      {/* Curtain animation */}
      <div className={`absolute inset-0 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 transform-gpu transition-transform duration-2000 ease-in-out ${showCurtain ? 'scale-x-100' : 'scale-x-0'} origin-center`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-600 to-transparent opacity-30"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <div className="animate-float">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-kawaii-pink via-kawaii-blue to-kawaii-lavender mb-6 animate-pulse-glow">
            Welcome to
          </h1>
          <div className="relative">
            <h2 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-kawaii-lavender via-kawaii-mint to-kawaii-pink mb-8">
              SnapSnap Booth
            </h2>
            <span className="text-6xl md:text-8xl absolute -top-4 -right-8 md:-right-16 animate-bounce">📸</span>
          </div>
        </div>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-2 mt-12">
          <div className="w-4 h-4 bg-kawaii-pink rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-kawaii-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-4 h-4 bg-kawaii-lavender rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default ShutterIntro;
