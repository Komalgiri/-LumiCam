
import { useEffect, useState } from 'react';

interface ShutterIntroProps {
  onComplete: () => void;
}

const ShutterIntro = ({ onComplete }: ShutterIntroProps) => {
  const [showShutter, setShowShutter] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const shutterTimer = setTimeout(() => {
      setShowShutter(false);
    }, 800);

    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => {
      clearTimeout(shutterTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Camera shutter animation */}
      <div className={`shutter-panel top-0 left-0 right-0 h-1/2 ${showShutter ? '' : 'animate-shutter-open'}`}></div>
      <div className={`shutter-panel bottom-0 left-0 right-0 h-1/2 ${showShutter ? '' : 'animate-shutter-close'}`}></div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">
            Welcome to
          </h1>
          <h2 className="text-6xl md:text-8xl font-black text-primary mb-12">
            Photo Booth
          </h2>
        </div>
        
        {showButton && (
          <button
            onClick={onComplete}
            className="minimal-button text-lg animate-fade-in"
          >
            Start Photo Booth
          </button>
        )}
      </div>
    </div>
  );
};

export default ShutterIntro;
