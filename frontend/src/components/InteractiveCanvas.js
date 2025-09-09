import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const InteractiveCanvas = ({ 
  width = 300, 
  height = 200, 
  className = '',
  onMouseMove,
  onMouseLeave 
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = 30;
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.8 + 0.2,
          hue: Math.random() * 60 + 200,
          life: Math.random() * 100 + 100,
          originalX: Math.random() * width,
          originalY: Math.random() * height
        });
      }
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);
      
      particlesRef.current.forEach((particle) => {
        // Calculate distance to mouse
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Apply mouse interaction
        if (distance < 100 && isHovered) {
          const force = (100 - distance) / 100;
          particle.vx += (dx / distance) * force * 0.1;
          particle.vy += (dy / distance) * force * 0.1;
        } else {
          // Return to original position
          const returnForce = 0.02;
          particle.vx += (particle.originalX - particle.x) * returnForce;
          particle.vy += (particle.originalY - particle.y) * returnForce;
        }
        
        // Apply friction
        particle.vx *= 0.98;
        particle.vy *= 0.98;
        
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Keep particles in bounds
        if (particle.x < 0 || particle.x > width) particle.vx *= -0.8;
        if (particle.y < 0 || particle.y > height) particle.vy *= -0.8;
        
        particle.x = Math.max(0, Math.min(width, particle.x));
        particle.y = Math.max(0, Math.min(height, particle.y));
        
        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        
        // Create gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `hsl(${particle.hue}, 70%, 70%)`);
        gradient.addColorStop(1, `hsl(${particle.hue}, 70%, 30%)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = `hsl(${particle.hue}, 70%, 60%)`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Draw connections between nearby particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 80) {
            ctx.save();
            ctx.globalAlpha = (80 - distance) / 80 * 0.3;
            ctx.strokeStyle = `hsl(${particlesRef.current[i].hue}, 50%, 60%)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const animate = () => {
      drawParticles();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      
      if (onMouseMove) {
        onMouseMove({ x: mouseRef.current.x, y: mouseRef.current.y });
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (onMouseLeave) {
        onMouseLeave();
      }
    };

    // Initialize
    initParticles();
    animate();

    // Event listeners
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [width, height, onMouseMove, onMouseLeave, isHovered]);

  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        style={{
          borderRadius: '12px',
          background: 'transparent',
          cursor: 'pointer'
        }}
      />
    </motion.div>
  );
};

export default InteractiveCanvas;
