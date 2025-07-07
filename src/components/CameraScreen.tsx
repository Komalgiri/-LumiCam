
import { useState, useRef, useEffect } from 'react';
import { Camera, Star, Heart } from 'lucide-react';

interface CameraScreenProps {
  onPhotoCaptured: (photoData: string) => void;
}

const filters = [
  { name: 'Normal', class: 'filter-none', color: 'bg-white' },
  { name: 'Sepia', class: 'sepia', color: 'bg-yellow-200' },
  { name: 'B&W', class: 'grayscale', color: 'bg-gray-300' },
  { name: 'Warm', class: 'hue-rotate-15', color: 'bg-orange-200' },
  { name: 'Cool', class: 'hue-rotate-180', color: 'bg-blue-200' },
  { name: 'Blur', class: 'blur-sm', color: 'bg-purple-200' },
];

const CameraScreen = ({ onPhotoCaptured }: CameraScreenProps) => {
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
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
    
    context.filter = getFilterCSS(selectedFilter);
    context.drawImage(videoRef.current, 0, 0);
    
    const photoData = canvas.toDataURL('image/png');
    onPhotoCaptured(photoData);
    
    // Add sparkle effect
    triggerSparkles();
  };

  const getFilterCSS = (filterIndex: number) => {
    const filter = filters[filterIndex];
    switch (filter.class) {
      case 'sepia': return 'sepia(100%)';
      case 'grayscale': return 'grayscale(100%)';
      case 'hue-rotate-15': return 'hue-rotate(15deg) saturate(120%)';
      case 'hue-rotate-180': return 'hue-rotate(180deg)';
      case 'blur-sm': return 'blur(2px)';
      default: return 'none';
    }
  };

  const triggerSparkles = () => {
    const newSparkles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kawaii-mint-light via-kawaii-pink-light to-kawaii-blue-light p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <Star className="absolute top-10 left-10 text-kawaii-lavender animate-twinkle" size={20} />
        <Heart className="absolute top-20 right-20 text-kawaii-pink animate-float" size={24} />
        <Star className="absolute bottom-32 left-16 text-kawaii-blue animate-twinkle" size={18} style={{ animationDelay: '1s' }} />
      </div>

      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <Star
          key={sparkle.id}
          className="sparkle"
          style={{ left: sparkle.x, top: sparkle.y }}
          size={20}
        />
      ))}

      <div className="flex h-screen gap-6">
        {/* Filter sidebar */}
        <div className="w-24 flex flex-col justify-center space-y-4">
          <h3 className="text-lg font-bold text-center text-gray-700 mb-4">Filters</h3>
          {filters.map((filter, index) => (
            <button
              key={index}
              onClick={() => setSelectedFilter(index)}
              className={`filter-button ${filter.color} ${selectedFilter === index ? 'ring-4 ring-kawaii-pink' : ''} relative group`}
              title={filter.name}
            >
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                {filter.name}
              </span>
            </button>
          ))}
        </div>

        {/* Camera area */}
        <div className="flex-1 flex flex-col justify-center items-center relative">
          {/* Polaroid frame */}
          <div className="relative bg-white p-6 rounded-3xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
            {/* Tape stickers */}
            <div className="absolute -top-3 -left-3 w-12 h-6 bg-yellow-200 opacity-75 transform -rotate-12 rounded-sm"></div>
            <div className="absolute -top-3 -right-3 w-12 h-6 bg-pink-200 opacity-75 transform rotate-12 rounded-sm"></div>
            <div className="absolute -bottom-3 -left-3 w-12 h-6 bg-blue-200 opacity-75 transform rotate-12 rounded-sm"></div>
            <div className="absolute -bottom-3 -right-3 w-12 h-6 bg-green-200 opacity-75 transform -rotate-12 rounded-sm"></div>

            {/* Video frame */}
            <div className="relative w-96 h-72 bg-gray-200 rounded-2xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${filters[selectedFilter].class}`}
              />
              
              {/* Countdown overlay */}
              {countdown > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-8xl font-black text-white animate-pulse">
                    {countdown}
                  </div>
                </div>
              )}
            </div>

            {/* Photo caption area */}
            <div className="mt-4 text-center">
              <p className="text-gray-600 font-medium">SnapSnap Memories ✨</p>
            </div>
          </div>

          {/* Shutter button */}
          <button
            onClick={capturePhoto}
            disabled={countdown > 0}
            className="kawaii-button mt-8 flex items-center gap-3 text-xl relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera size={28} />
            <span>📸 Snap!</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScreen;
