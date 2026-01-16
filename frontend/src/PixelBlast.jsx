import React, { useEffect, useRef } from 'react';

const PixelBlast = ({ 
  color = "#B19EEF", 
  speed = 0.5, 
  transparent = true 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Configuration
    const particleCount = window.innerWidth < 768 ? 40 : 80; // Fewer dots on mobile
    const connectionDistance = 140; // How close dots need to be to connect
    
    // Resize Handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initial Size
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle Class
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.size = Math.random() * 2 + 1; // Random size between 1 and 3
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }

    // Initialize
    const init = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    // Animation Loop
    const animate = () => {
      // Clear Screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // If not transparent, set background (Optional)
      if (!transparent) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Loop through particles
      particles.forEach((particle, index) => {
        particle.update();
        particle.draw();

        // Draw Lines (The "Tech Network" Effect)
        for (let j = index; j < particles.length; j++) {
          const dx = particle.x - particles[j].x;
          const dy = particle.y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.5;
            // Line gets more transparent as dots get further apart
            ctx.globalAlpha = 1 - (distance / connectionDistance);
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.globalAlpha = 1; // Reset alpha
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, speed, transparent]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        display: 'block', 
        width: '100%', 
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none' // Clicks go through the canvas
      }} 
    />
  );
};

export default PixelBlast;