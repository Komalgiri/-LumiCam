
import { Download, Heart, Star, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  photoIndex: number;
}

interface PhotoStripProps {
  photos: string[];
  onRetake: () => void;
}

const PhotoStrip = ({ photos, onRetake }: PhotoStripProps) => {
  const [downloading, setDownloading] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string>('');

  const cuteStickers = ['🧸', '🐰', '🎈', '🌸', '⭐', '💫', '🎀', '🍓', '🦄', '🌙', '☁️', '🍭'];

  const addSticker = (photoIndex: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedSticker) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    const newSticker: Sticker = {
      id: Date.now().toString(),
      emoji: selectedSticker,
      x,
      y,
      photoIndex
    };
    
    setStickers(prev => [...prev, newSticker]);
  };

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

    // Header with new colors
    const gradient = ctx.createLinearGradient(0, 0, stripWidth, 0);
    gradient.addColorStop(0, '#AEE2FF');
    gradient.addColorStop(1, '#C9F8DC');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, stripWidth, headerHeight);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Nunito';
    ctx.textAlign = 'center';
    ctx.fillText('SnapSnap Booth 📸', stripWidth / 2, 45);

    // Draw photos and stickers
    let loadedPhotos = 0;
    photos.forEach((photo, index) => {
      const img = new Image();
      img.onload = () => {
        const y = headerHeight + (photoHeight + padding) * index + padding;
        ctx.drawImage(img, padding, y, stripWidth - padding * 2, photoHeight);
        
        // Add decorative elements with new colors
        ctx.fillStyle = '#AEE2FF';
        ctx.fillRect(10, y - 10, 30, 15);
        ctx.fillStyle = '#C9F8DC';
        ctx.fillRect(stripWidth - 40, y - 10, 30, 15);
        
        // Draw stickers on this photo
        const photoStickers = stickers.filter(sticker => sticker.photoIndex === index);
        photoStickers.forEach(sticker => {
          ctx.font = '32px Arial';
          const stickerX = padding + (stripWidth - padding * 2) * (sticker.x / 100);
          const stickerY = y + photoHeight * (sticker.y / 100);
          ctx.fillText(sticker.emoji, stickerX - 16, stickerY + 12);
        });
        
        loadedPhotos++;
        if (loadedPhotos === photos.length) {
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
    <div className="min-h-screen bg-gradient-to-br from-kawaii-yellow-light via-kawaii-mint-light to-kawaii-blue-light p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute top-16 left-16 text-kawaii-blue animate-float" size={32} />
        <Star className="absolute top-24 right-20 text-kawaii-lavender animate-twinkle" size={28} />
        <Sparkles className="absolute bottom-20 left-20 text-kawaii-mint animate-float" size={24} style={{ animationDelay: '1s' }} />
        <Star className="absolute bottom-32 right-32 text-kawaii-yellow animate-twinkle" size={26} style={{ animationDelay: '0.5s' }} />
        
        {/* Confetti pattern */}
        <div className="absolute top-1/4 left-1/4 text-4xl opacity-20">⭐</div>
        <div className="absolute top-1/3 right-1/4 text-3xl opacity-20">✨</div>
        <div className="absolute bottom-1/4 left-1/3 text-3xl opacity-20">💫</div>
        
        {/* Washi tape decorations - updated colors */}
        <div className="absolute top-40 left-12 w-24 h-8 bg-kawaii-blue opacity-60 transform -rotate-12 rounded-sm"></div>
        <div className="absolute top-60 right-16 w-32 h-6 bg-kawaii-mint opacity-60 transform rotate-6 rounded-sm"></div>
        <div className="absolute bottom-40 left-24 w-20 h-10 bg-kawaii-lavender opacity-60 transform rotate-12 rounded-sm"></div>
      </div>

      <div className="relative">
        {/* Photo strip container */}
        <div className="bg-white p-8 rounded-4xl shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500 relative">
          {/* Tape on top - updated colors */}
          <div className="absolute -top-4 left-1/4 w-16 h-8 bg-kawaii-yellow opacity-75 transform -rotate-6 rounded-sm"></div>
          <div className="absolute -top-4 right-1/4 w-16 h-8 bg-kawaii-mint opacity-75 transform rotate-6 rounded-sm"></div>

          {/* Header */}
          <div className="text-center mb-6 bg-gradient-to-r from-kawaii-blue to-kawaii-mint p-4 rounded-3xl">
            <h2 className="text-3xl font-black text-white">SnapSnap Booth 📸</h2>
            <p className="text-white opacity-90 font-medium">Your Kawaii Memories</p>
          </div>

          {/* Sticker Panel */}
          <div className="mb-6 p-4 bg-kawaii-mint-light rounded-3xl">
            <h3 className="text-lg font-bold text-kawaii-blue mb-3 text-center">Add Cute Stickers ✨</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {cuteStickers.map((sticker) => (
                <button
                  key={sticker}
                  onClick={() => setSelectedSticker(selectedSticker === sticker ? '' : sticker)}
                  className={`text-2xl p-2 rounded-full transition-all duration-200 ${
                    selectedSticker === sticker
                      ? 'bg-kawaii-blue scale-110 shadow-lg'
                      : 'bg-white hover:bg-kawaii-yellow-light hover:scale-105'
                  }`}
                >
                  {sticker}
                </button>
              ))}
            </div>
            {selectedSticker && (
              <p className="text-sm text-kawaii-blue mt-2 text-center">
                Click on any photo to add {selectedSticker}
              </p>
            )}
          </div>

          {/* Photo strip */}
          <div className="space-y-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <div
                  className={`relative ${selectedSticker ? 'cursor-crosshair' : ''}`}
                  onClick={(e) => addSticker(index, e)}
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-80 h-60 object-cover rounded-2xl shadow-lg"
                  />
                  {/* Render stickers on photo */}
                  {stickers
                    .filter(sticker => sticker.photoIndex === index)
                    .map((sticker) => (
                      <div
                        key={sticker.id}
                        className="absolute text-2xl pointer-events-none"
                        style={{
                          left: `${sticker.x}%`,
                          top: `${sticker.y}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        {sticker.emoji}
                      </div>
                    ))}
                </div>
                {/* Photo decorations - updated colors */}
                <div className="absolute -top-2 -left-2 w-8 h-6 bg-kawaii-mint opacity-75 transform -rotate-12 rounded-sm"></div>
                <div className="absolute -top-2 -right-2 w-8 h-6 bg-kawaii-lavender opacity-75 transform rotate-12 rounded-sm"></div>
                <div className="absolute -bottom-2 -right-2 text-2xl">
                  {index === 0 ? '💙' : index === 1 ? '✨' : '🌟'}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom tape - updated color */}
          <div className="absolute -bottom-4 left-1/3 w-20 h-8 bg-kawaii-blue opacity-75 transform rotate-3 rounded-sm"></div>
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
            className="bg-gradient-to-r from-red-300 to-red-400 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 text-lg"
          >
            <span>🔄 Retake Photos</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoStrip;
