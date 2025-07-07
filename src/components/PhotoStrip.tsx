
import { Download, Heart, Star } from 'lucide-react';
import { useState } from 'react';

interface PhotoStripProps {
  photos: string[];
  onRetake: () => void;
}

const PhotoStrip = ({ photos, onRetake }: PhotoStripProps) => {
  const [downloading, setDownloading] = useState(false);

  const downloadPhotos = () => {
    setDownloading(true);
    
    // Create a canvas to combine all photos into a strip
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stripWidth = 400;
    const photoHeight = 300;
    const padding = 20;
    const headerHeight = 80;
    
    canvas.width = stripWidth;
    canvas.height = headerHeight + (photoHeight + padding) * photos.length + padding;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = '#FFB3D9';
    ctx.fillRect(0, 0, stripWidth, headerHeight);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Nunito';
    ctx.textAlign = 'center';
    ctx.fillText('SnapSnap Booth 📸', stripWidth / 2, 45);

    // Draw photos
    photos.forEach((photo, index) => {
      const img = new Image();
      img.onload = () => {
        const y = headerHeight + (photoHeight + padding) * index + padding;
        ctx.drawImage(img, padding, y, stripWidth - padding * 2, photoHeight);
        
        // Add decorative elements
        ctx.fillStyle = '#FFB3D9';
        ctx.fillRect(10, y - 10, 30, 15);
        ctx.fillRect(stripWidth - 40, y - 10, 30, 15);
        
        if (index === photos.length - 1) {
          // Download when all photos are drawn
          setTimeout(() => {
            const link = document.createElement('a');
            link.download = 'snapsnap-booth-photos.png';
            link.href = canvas.toDataURL();
            link.click();
            setDownloading(false);
          }, 500);
        }
      };
      img.src = photo;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-kawaii-peach-light via-kawaii-mint-light to-kawaii-pink-light p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute top-16 left-16 text-kawaii-pink animate-float" size={32} />
        <Star className="absolute top-24 right-20 text-kawaii-lavender animate-twinkle" size={28} />
        <Heart className="absolute bottom-20 left-20 text-kawaii-blue animate-float" size={24} style={{ animationDelay: '1s' }} />
        <Star className="absolute bottom-32 right-32 text-kawaii-mint animate-twinkle" size={26} style={{ animationDelay: '0.5s' }} />
        
        {/* Washi tape decorations */}
        <div className="absolute top-40 left-12 w-24 h-8 bg-kawaii-pink opacity-60 transform -rotate-12 rounded-sm"></div>
        <div className="absolute top-60 right-16 w-32 h-6 bg-kawaii-blue opacity-60 transform rotate-6 rounded-sm"></div>
        <div className="absolute bottom-40 left-24 w-20 h-10 bg-kawaii-lavender opacity-60 transform rotate-12 rounded-sm"></div>
      </div>

      <div className="relative">
        {/* Photo strip container */}
        <div className="bg-white p-8 rounded-4xl shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500 relative">
          {/* Tape on top */}
          <div className="absolute -top-4 left-1/4 w-16 h-8 bg-yellow-200 opacity-75 transform -rotate-6 rounded-sm"></div>
          <div className="absolute -top-4 right-1/4 w-16 h-8 bg-pink-200 opacity-75 transform rotate-6 rounded-sm"></div>

          {/* Header */}
          <div className="text-center mb-6 bg-gradient-to-r from-kawaii-pink to-kawaii-blue p-4 rounded-3xl">
            <h2 className="text-3xl font-black text-white">SnapSnap Booth 📸</h2>
            <p className="text-white opacity-90 font-medium">Your Kawaii Memories</p>
          </div>

          {/* Photo strip */}
          <div className="space-y-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-80 h-60 object-cover rounded-2xl shadow-lg"
                />
                {/* Photo decorations */}
                <div className="absolute -top-2 -left-2 w-8 h-6 bg-kawaii-mint opacity-75 transform -rotate-12 rounded-sm"></div>
                <div className="absolute -top-2 -right-2 w-8 h-6 bg-kawaii-lavender opacity-75 transform rotate-12 rounded-sm"></div>
                <div className="absolute -bottom-2 -right-2 text-2xl">
                  {index === 0 ? '💖' : index === 1 ? '✨' : '🌟'}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom tape */}
          <div className="absolute -bottom-4 left-1/3 w-20 h-8 bg-blue-200 opacity-75 transform rotate-3 rounded-sm"></div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={downloadPhotos}
            disabled={downloading}
            className="kawaii-button flex items-center gap-3 text-lg relative overflow-hidden group disabled:opacity-50"
          >
            <Download size={24} />
            <span>{downloading ? 'Creating...' : '✨ Download Strip'}</span>
            {downloading && <div className="ml-2 w-4 h-4 bg-white bg-opacity-30 rounded-full animate-ping"></div>}
          </button>

          <button
            onClick={onRetake}
            className="bg-gradient-to-r from-kawaii-peach to-kawaii-mint text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg"
          >
            <span>🔄 Retake Photos</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoStrip;
