import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedCanvas = ({ 
  width = 400, 
  height = 200, 
  className = '',
  type = 'particles' // 'particles', 'waves', 'geometric', 'floating'
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set actual size in memory
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    // Scale the drawing context so everything will work at the higher ratio
    ctx.scale(dpr, dpr);
    
    // Set display size
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = type === 'particles' ? 50 : type === 'waves' ? 30 : 20;
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          hue: Math.random() * 60 + 200, // Blue to purple range
          life: Math.random() * 100 + 100
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
      
      particlesRef.current.forEach((particle, index) => {
        // Update particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        // Reset particle if it goes off screen or dies
        if (particle.x < 0 || particle.x > width || particle.y < 0 || particle.y > height || particle.life <= 0) {
          particle.x = Math.random() * width;
          particle.y = Math.random() * height;
          particle.life = Math.random() * 100 + 100;
        }
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = `hsl(${particle.hue}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = `hsl(${particle.hue}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
    };

    const drawWaves = () => {
      ctx.clearRect(0, 0, width, height);
      
      const time = timeRef.current * 0.01;
      
      // Draw multiple wave layers
      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.globalAlpha = 0.3 - (i * 0.1);
        ctx.strokeStyle = `hsl(${220 + i * 20}, 70%, 60%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        for (let x = 0; x <= width; x += 2) {
          const y = height / 2 + 
            Math.sin((x * 0.01) + time + i) * 20 +
            Math.sin((x * 0.02) + time * 1.5 + i) * 10 +
            Math.sin((x * 0.005) + time * 0.5 + i) * 30;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        ctx.restore();
      }
    };

    const drawGeometric = () => {
      ctx.clearRect(0, 0, width, height);
      
      const time = timeRef.current * 0.005;
      const centerX = width / 2;
      const centerY = height / 2;
      
      // Draw rotating geometric shapes
      for (let i = 0; i < 5; i++) {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(time + i * Math.PI / 3);
        ctx.globalAlpha = 0.6 - (i * 0.1);
        ctx.strokeStyle = `hsl(${200 + i * 30}, 70%, 60%)`;
        ctx.lineWidth = 2;
        
        const size = 30 + i * 15;
        ctx.strokeRect(-size/2, -size/2, size, size);
        
        // Add inner circle
        ctx.beginPath();
        ctx.arc(0, 0, size/3, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
      }
    };

    const drawFloating = () => {
      ctx.clearRect(0, 0, width, height);
      
      const time = timeRef.current * 0.01;
      
      // Draw floating orbs
      for (let i = 0; i < 8; i++) {
        const x = (width / 8) * i + Math.sin(time + i) * 20;
        const y = height / 2 + Math.cos(time * 0.8 + i) * 30;
        const size = 15 + Math.sin(time + i) * 5;
        
        ctx.save();
        ctx.globalAlpha = 0.7;
        
        // Create gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, `hsl(${200 + i * 20}, 70%, 70%)`);
        gradient.addColorStop(1, `hsl(${200 + i * 20}, 70%, 30%)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${200 + i * 20}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    };

    const animate = () => {
      timeRef.current++;
      
      switch (type) {
        case 'particles':
          drawParticles();
          break;
        case 'waves':
          drawWaves();
          break;
        case 'geometric':
          drawGeometric();
          break;
        case 'floating':
          drawFloating();
          break;
        default:
          drawParticles();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height, type]);

  return (
    <motion.canvas
      ref={canvasRef}
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        borderRadius: '12px',
        background: 'transparent'
      }}
    />
  );
};

export default AnimatedCanvas;
