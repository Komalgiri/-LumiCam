
import { useState, useRef, useEffect } from 'react';
import { Camera, Star, Heart, Sparkles } from 'lucide-react';

interface CameraScreenProps {
  onPhotoCaptured: (photoData: string) => void;
}

const filters = [
  { name: 'Normal', class: 'filter-none', color: 'bg-white', css: 'none' },
  { name: 'Mono', class: 'grayscale', color: 'bg-gray-300', css: 'grayscale(100%)' },
  { name: 'Sepia', class: 'sepia', color: 'bg-yellow-200', css: 'sepia(100%)' },
  { name: 'Cool', class: 'hue-rotate-180', color: 'bg-blue-200', css: 'hue-rotate(180deg) saturate(120%)' },
  { name: 'Warm', class: 'brightness-110', color: 'bg-orange-200', css: 'brightness(110%) saturate(120%)' },
  { name: 'Pastel Pop', class: 'saturate-140', color: 'bg-kawaii-lavender', css: 'saturate(140%) brightness(105%)' },
  { name: 'Retro TV', class: 'contrast-130', color: 'bg-kawaii-mint', css: 'contrast(130%) brightness(90%)' },
  { name: 'Blur', class: 'blur-sm', color: 'bg-kawaii-blue', css: 'blur(2px)' },
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
    
    context.filter = filters[selectedFilter].css;
    context.drawImage(videoRef.current, 0, 0);
    
    const photoData = canvas.toDataURL('image/png');
    onPhotoCaptured(photoData);
    
    // Add sparkle effect
    triggerSparkles();
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
    <div className="min-h-screen bg-gradient-to-br from-kawaii-mint-light via-kawaii-blue-light to-kawaii-lavender-light p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <Star className="absolute top-10 left-10 text-kawaii-lavender animate-twinkle" size={20} />
        <Heart className="absolute top-20 right-20 text-kawaii-blue animate-float" size={24} />
        <Sparkles className="absolute bottom-32 left-16 text-kawaii-mint animate-twinkle" size={18} style={{ animationDelay: '1s' }} />
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
        <div className="w-28 flex flex-col justify-center space-y-4">
          <h3 className="text-lg font-bold text-center text-gray-700 mb-4">Filters ✨</h3>
          {filters.map((filter, index) => (
            <div key={index} className="flex flex-col items-center">
              <button
                onClick={() => setSelectedFilter(index)}
                className={`filter-button ${filter.color} ${selectedFilter === index ? 'ring-4 ring-kawaii-blue' : ''} relative group`}
                title={filter.name}
              >
                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white bg-opacity-80 rounded-full">
                  {filter.name}
                </span>
                {selectedFilter === index && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-kawaii-blue rounded-full flex items-center justify-center">
                    <Star size={12} className="text-white" />
                  </div>
                )}
              </button>
              <span className="text-xs font-medium text-gray-600 mt-1">{filter.name}</span>
            </div>
          ))}
        </div>

        {/* Camera area */}
        <div className="flex-1 flex flex-col justify-center items-center relative">
          {/* Polaroid frame */}
          <div className="relative bg-white p-6 rounded-3xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
            {/* Tape stickers - updated colors */}
            <div className="absolute -top-3 -left-3 w-12 h-6 bg-kawaii-yellow opacity-75 transform -rotate-12 rounded-sm"></div>
            <div className="absolute -top-3 -right-3 w-12 h-6 bg-kawaii-mint opacity-75 transform rotate-12 rounded-sm"></div>
            <div className="absolute -bottom-3 -left-3 w-12 h-6 bg-kawaii-blue opacity-75 transform rotate-12 rounded-sm"></div>
            <div className="absolute -bottom-3 -right-3 w-12 h-6 bg-kawaii-lavender opacity-75 transform -rotate-12 rounded-sm"></div>

            {/* Video frame */}
            <div className="relative w-96 h-72 bg-gray-200 rounded-2xl overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${filters[selectedFilter].class}`}
                style={{ filter: filters[selectedFilter].css }}
              />
              
              {/* Countdown overlay with bubble animation */}
              {countdown > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-8xl font-black text-white animate-bounce-bubble bg-kawaii-blue bg-opacity-20 rounded-full w-32 h-32 flex items-center justify-center">
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

          {/* Circular shutter button */}
          <button
            onClick={capturePhoto}
            disabled={countdown > 0}
            className="mt-8 w-20 h-20 bg-gradient-to-r from-kawaii-blue to-kawaii-mint text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center text-3xl relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Camera size={32} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 rounded-full"></div>
          </button>
          
          <p className="mt-3 text-kawaii-blue font-bold">📸 Snap!</p>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraScreen;
