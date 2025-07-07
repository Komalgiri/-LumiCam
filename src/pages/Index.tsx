
import { useState, useEffect } from 'react';
import ShutterIntro from '../components/ShutterIntro';
import CameraScreen from '../components/CameraScreen';
import PhotoStrip from '../components/PhotoStrip';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  const handlePhotoCaptured = (photoData: string) => {
    setCapturedPhotos(prev => [...prev, photoData]);
    
    if (capturedPhotos.length === 2) {
      // After 3 photos, go to photo strip
      setTimeout(() => setCurrentScreen(2), 1000);
    }
  };

  const handleRetake = () => {
    setCapturedPhotos([]);
    setCurrentScreen(1);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <ShutterIntro onComplete={() => setCurrentScreen(1)} />;
      case 1:
        return <CameraScreen onPhotoCaptured={handlePhotoCaptured} />;
      case 2:
        return <PhotoStrip photos={capturedPhotos} onRetake={handleRetake} />;
      default:
        return <ShutterIntro onComplete={() => setCurrentScreen(1)} />;
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {renderScreen()}
    </div>
  );
};

export default Index;
