import React, { useEffect, useRef } from 'react';

const CreateTexture: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 512;
    canvas.height = 512;

    // Draw checkered pattern
    const tileSize = 64;
    const colors = ['#f5f5f5', '#cc0000']; // White and Italian red

    for (let y = 0; y < canvas.height; y += tileSize) {
      for (let x = 0; x < canvas.width; x += tileSize) {
        const colorIndex = ((x / tileSize + y / tileSize) % 2) | 0;
        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }

    // Save the canvas as PNG
    const link = document.createElement('a');
    link.download = 'checkered.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return <canvas ref={canvasRef} style={{ display: 'none' }} />;
};

export default CreateTexture; 