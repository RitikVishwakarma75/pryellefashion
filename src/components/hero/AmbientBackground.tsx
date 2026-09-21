'use client';

import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function AmbientBackground() {
  const { currentTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle setup based on active theme
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.45 - 0.15,
      alpha: Math.random() * 0.5 + 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.008,
      pulseOffset: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle floating light motes
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha =
          p.alpha * (0.6 + 0.4 * Math.sin(frame * p.pulseSpeed + p.pulseOffset));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = currentTheme.accent;
        ctx.globalAlpha = currentAlpha * 0.45;
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000">
      {/* Dynamic ambient radial gradients */}
      <div
        className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] h-[75vh] rounded-full blur-[130px] opacity-45 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${currentTheme.accentSoft} 0%, rgba(255,255,255,0) 70%)`,
        }}
      />
      <div
        className="absolute top-[40%] -right-[15%] w-[60vw] max-w-[800px] h-[60vh] rounded-full blur-[140px] opacity-35 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${currentTheme.accentSoft} 0%, rgba(255,255,255,0) 70%)`,
        }}
      />
      <div
        className="absolute -bottom-[20%] -left-[10%] w-[55vw] max-w-[700px] h-[55vh] rounded-full blur-[120px] opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, ${currentTheme.accentSoft} 0%, rgba(255,255,255,0) 70%)`,
        }}
      />

      {/* Floating motes canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Ultra-subtle luxury fine texture overlay */}
      <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />
    </div>
  );
}
