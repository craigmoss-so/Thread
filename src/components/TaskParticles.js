import React, { useEffect, useRef } from 'react';
import './TaskParticles.css';

/**
 * TaskParticles - Visual particle system for task execution
 * Creates beautiful particle effects when tasks are processing
 */
const TaskParticles = ({ isProcessing, executingNodeId, nodes }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!isProcessing || !canvasRef.current) {
      // Clear particles when not processing
      particlesRef.current = [];
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    // Set canvas size to match window
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Find the executing node position
    let nodePosition = null;
    if (executingNodeId && nodes) {
      const node = nodes.find(n => n.id === executingNodeId);
      if (node) {
        // Calculate actual screen position (accounting for canvas offset)
        const canvasElement = document.querySelector('.canvas');
        if (canvasElement) {
          const canvasRect = canvasElement.getBoundingClientRect();
          nodePosition = {
            x: canvasRect.left + node.position.x + 110, // Center of node
            y: canvasRect.top + node.position.y + 100
          };
        }
      }
    }

    // Particle class
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        this.life = 1.0;
        this.decay = 0.01 + Math.random() * 0.02;
        this.size = 2 + Math.random() * 4;

        // Random color from gradient palette
        const colors = [
          { r: 102, g: 126, b: 234 }, // Purple
          { r: 240, g: 147, b: 251 }, // Pink
          { r: 67, g: 233, b: 123 },  // Green
          { r: 79, g: 172, b: 254 }   // Blue
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05; // Gravity
        this.vx *= 0.99; // Air resistance
        this.life -= this.decay;
      }

      draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;

        // Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;

        // Particle
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 1)`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      isDead() {
        return this.life <= 0;
      }
    }

    // Create energy ring particles
    class EnergyRing {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 20;
        this.maxRadius = 150;
        this.life = 1.0;
        this.decay = 0.015;
        this.thickness = 3;
      }

      update() {
        this.radius += 4;
        this.life -= this.decay;
      }

      draw(ctx) {
        if (this.radius > this.maxRadius) return;

        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.strokeStyle = '#667eea';
        ctx.lineWidth = this.thickness;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#667eea';

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      isDead() {
        return this.life <= 0 || this.radius > this.maxRadius;
      }
    }

    // Spawn particles
    const spawnParticles = () => {
      if (!nodePosition) return;

      // Spawn regular particles
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push(new Particle(nodePosition.x, nodePosition.y));
      }

      // Occasionally spawn energy ring
      if (Math.random() < 0.1) {
        particlesRef.current.push(new EnergyRing(nodePosition.x, nodePosition.y));
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Spawn new particles
      if (isProcessing) {
        spawnParticles();
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update();
        particle.draw(ctx);
        return !particle.isDead();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isProcessing, executingNodeId, nodes]);

  if (!isProcessing) return null;

  return (
    <canvas
      ref={canvasRef}
      className="task-particles-canvas"
    />
  );
};

export default TaskParticles;
