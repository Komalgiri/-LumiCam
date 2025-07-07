
import { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';
import EmojiStickers from './EmojiStickers';

interface CameraScreenProps {
  onPhotoCaptured: (photoData: string) => void;
}

const filters = [
  { name: 'Normal', class: 'filter-none', css: 'none' },
  { name: 'Mono', class: 'grayscale', css: 'grayscale(100%)' },
  { name: 'Sepia', class: 'sepia', css: 'sepia(100%)' },
  { name: 'Cool', class: 'hue-rotate-180', css: 'hue-rotate(180deg) saturate(120%)' },
  { name: 'Warm', class: 'brightness-110', css: 'brightness(110%) saturate(120%)' },
  { name: 'Retro', class: 'contrast-130', css: 'contrast(130%) brightness(90%)' },
  { name: 'Blur', class: 'blur-sm', css: 'blur(2px)' },
];

const CameraScreen = ({ onPhotoCaptured }: CameraScreenProps) => {
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showStickers, setShowStickers] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          takePhoto();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    context.filter = filters[selectedFilter].css;
    context.drawImage(videoRef.current, 0, 0);
    
    const photoData = canvas.toDataURL('image/png');
    setCapturedPhoto(photoData);
    setShowStickers(true);
  };

  const handleStickerComplete = (finalPhotoData: string) => {
    onPhotoCaptured(finalPhotoData);
    setCapturedPhoto(null);
    setShowStickers(false);
  };

  if (showStickers && capturedPhoto) {
    return (
      <EmojiStickers
        photoData={capturedPhoto}
        onComplete={handleStickerComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex h-screen gap-8">
        {/* Filter sidebar */}
        <div className="w-32 flex flex-col justify-center space-y-6">
          <h3 className="text-lg font-medium text-center text-foreground mb-4">Filters</h3>
          {filters.map((filter, index) => (
            <button
              key={index}
              onClick={() => setSelectedFilter(index)}
              className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                selectedFilter === index 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>

        {/* Camera area */}
        <div className="flex-1 flex flex-col justify-center items-center">
          {/* Camera frame */}
          <div className="relative bg-white p-4 rounded-2xl shadow-lg">
            <div className="relative w-96 h-72 bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${filters[selectedFilter].class}`}
                style={{ filter: filters[selectedFilter].css }}
              />
              
              {/* Countdown overlay */}
              {countdown > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-8xl font-black text-white">
                    {countdown}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Capture button */}
          <button
            onClick={capturePhoto}
            disabled={countdown > 0}
            className="mt-8 w-16 h-16 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera size={24} />
          </button>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScreen;
