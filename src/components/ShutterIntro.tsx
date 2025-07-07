
import { useEffect, useState } from 'react';
import { Star, Heart, Sparkles } from 'lucide-react';

interface ShutterIntroProps {
  onComplete: () => void;
}

const ShutterIntro = ({ onComplete }: ShutterIntroProps) => {
  const [showShutter, setShowShutter] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Start shutter animation after a brief delay
    const shutterTimer = setTimeout(() => {
      setShowShutter(false);
    }, 800);

    // Show button after shutter opens
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => {
      clearTimeout(shutterTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-kawaii-blue-light via-kawaii-mint-light to-kawaii-lavender-light overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <Star className="absolute top-20 left-20 text-kawaii-blue animate-twinkle" size={24} />
        <Heart className="absolute top-32 right-32 text-kawaii-lavender animate-float" size={20} />
        <Star className="absolute bottom-40 left-40 text-kawaii-mint animate-twinkle" size={28} style={{ animationDelay: '0.5s' }} />
        <Heart className="absolute bottom-20 right-20 text-kawaii-yellow animate-float" size={24} style={{ animationDelay: '1s' }} />
        <Star className="absolute top-1/2 left-1/4 text-kawaii-lavender animate-twinkle" size={20} style={{ animationDelay: '1.5s' }} />
        <Sparkles className="absolute top-1/3 right-1/3 text-kawaii-blue animate-float" size={18} style={{ animationDelay: '2s' }} />
      </div>

      {/* Camera shutter animation */}
      <div className={`shutter-panel top-0 left-0 right-0 h-1/2 ${showShutter ? '' : 'animate-shutter-open'}`}></div>
      <div className={`shutter-panel bottom-0 left-0 right-0 h-1/2 ${showShutter ? '' : 'animate-shutter-close'}`}></div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <div className="animate-float">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-kawaii-blue via-kawaii-mint to-kawaii-lavender mb-6">
            Welcome to
          </h1>
          <div className="relative">
            <h2 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-kawaii-lavender via-kawaii-blue to-kawaii-mint mb-8">
              SnapSnap Booth
            </h2>
            <span className="text-6xl md:text-8xl absolute -top-4 -right-8 md:-right-16 animate-bounce">📸</span>
          </div>
        </div>
        
        {/* Start button with sparkle effect */}
        {showButton && (
          <button
            onClick={onComplete}
            className="kawaii-button mt-12 text-2xl relative group overflow-hidden"
          >
            <Sparkles className="mr-3" size={28} />
            <span>✨ Start Photo Booth</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-700"></div>
          </button>
        )}
        
        {/* Loading dots - show only before button appears */}
        {!showButton && (
          <div className="flex justify-center space-x-2 mt-12">
            <div className="w-4 h-4 bg-kawaii-blue rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-kawaii-mint rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-4 h-4 bg-kawaii-lavender rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShutterIntro;
