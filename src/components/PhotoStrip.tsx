
import { Download } from 'lucide-react';
import { useState } from 'react';

interface PhotoStripProps {
  photos: string[];
  onRetake: () => void;
}

const PhotoStrip = ({ photos, onRetake }: PhotoStripProps) => {
  const [downloading, setDownloading] = useState(false);

  const downloadPhotos = () => {
    setDownloading(true);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stripWidth = 400;
    const photoHeight = 300;
    const padding = 20;
    const headerHeight = 60;
    
    canvas.width = stripWidth;
    canvas.height = headerHeight + (photoHeight + padding) * photos.length + padding;

    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 20px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Photo Booth', stripWidth / 2, 35);

    // Draw photos
    photos.forEach((photo, index) => {
      const img = new Image();
      img.onload = () => {
        const y = headerHeight + (photoHeight + padding) * index + padding;
        ctx.drawImage(img, padding, y, stripWidth - padding * 2, photoHeight);
        
        if (index === photos.length - 1) {
          setTimeout(() => {
            const link = document.createElement('a');
            link.download = 'photo-booth-strip.png';
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
    <div className="min-h-screen bg-background p-8 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Photo strip container */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Photo Strip</h2>
          </div>

          {/* Photo strip */}
          <div className="space-y-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-80 h-60 object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={downloadPhotos}
            disabled={downloading}
            className="minimal-button flex items-center gap-2 disabled:opacity-50"
          >
            <Download size={16} />
            <span>{downloading ? 'Creating...' : 'Download as PNG'}</span>
          </button>

          <button
            onClick={onRetake}
            className="bg-red-100 text-red-700 font-medium py-3 px-6 rounded-xl hover:bg-red-200 transition-colors duration-200"
          >
            Retake Photos
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoStrip;
