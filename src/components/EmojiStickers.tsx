
import { useState, useRef } from 'react';
import { X } from 'lucide-react';

interface EmojiStickersProps {
  photoData: string;
  onComplete: (finalPhotoData: string) => void;
}

const availableEmojis = ['🧸', '🐰', '🎈', '🌸', '⭐', '💫', '🌟', '✨', '🦄', '🌈'];

interface StickerPosition {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

const EmojiStickers = ({ photoData, onComplete }: EmojiStickersProps) => {
  const [stickers, setStickers] = useState<StickerPosition[]>([]);
  const [draggedSticker, setDraggedSticker] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);

  const handleEmojiClick = (emoji: string) => {
    const newSticker: StickerPosition = {
      id: Date.now().toString(),
      emoji,
      x: 200,
      y: 150,
    };
    setStickers(prev => [...prev, newSticker]);
  };

  const handleStickerMouseDown = (stickerId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedSticker(stickerId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedSticker) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setStickers(prev => prev.map(sticker => 
      sticker.id === draggedSticker 
        ? { ...sticker, x: x - 12, y: y - 12 }
        : sticker
    ));
  };

  const handleMouseUp = () => {
    setDraggedSticker(null);
  };

  const removeSticker = (stickerId: string) => {
    setStickers(prev => prev.filter(sticker => sticker.id !== stickerId));
  };

  const finishEditing = () => {
    if (!canvasRef.current || !photoRef.current) {
      onComplete(photoData);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      onComplete(photoData);
      return;
    }

    const img = photoRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw the original photo
    ctx.drawImage(img, 0, 0);

    // Draw stickers
    ctx.font = '48px serif';
    stickers.forEach(sticker => {
      const scaleX = canvas.width / 400; // 400 is the photo display width
      const scaleY = canvas.height / 300; // 300 is the photo display height
      ctx.fillText(sticker.emoji, sticker.x * scaleX, (sticker.y + 24) * scaleY);
    });

    const finalPhotoData = canvas.toDataURL('image/png');
    onComplete(finalPhotoData);
  };

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-center mb-4">Add Stickers</h2>
        
        {/* Emoji selection */}
        <div className="flex gap-2 mb-6 justify-center flex-wrap">
          {availableEmojis.map(emoji => (
            <button
              key={emoji}
              onClick={() => handleEmojiClick(emoji)}
              className="text-2xl p-2 bg-secondary rounded-lg hover:bg-accent transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Photo with stickers */}
      <div className="relative bg-white p-4 rounded-2xl shadow-lg">
        <div 
          className="relative w-96 h-72 overflow-hidden rounded-xl"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <img
            ref={photoRef}
            src={photoData}
            alt="Captured photo"
            className="w-full h-full object-cover"
          />
          
          {/* Stickers */}
          {stickers.map(sticker => (
            <div
              key={sticker.id}
              className="emoji-sticker group"
              style={{ left: sticker.x, top: sticker.y }}
              onMouseDown={(e) => handleStickerMouseDown(sticker.id, e)}
            >
              <span className="pointer-events-none">{sticker.emoji}</span>
              <button
                onClick={() => removeSticker(sticker.id)}
                className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={finishEditing}
          className="minimal-button"
        >
          Continue
        </button>
      </div>

      {/* Hidden canvas for final photo generation */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default EmojiStickers;
