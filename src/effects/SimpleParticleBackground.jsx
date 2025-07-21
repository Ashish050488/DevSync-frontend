import { useEffect, useRef } from "react";

const SimpleParticleBackground = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const numParticles = 80;

    // Create particles
    particles.current = Array.from({ length: numParticles }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 0.3 + 1,
      speedX: Math.random() * 0.5 - 0.25,
      speedY: Math.random() * 0.5 - 0.25,
    }));

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around screen
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // 👈 black color
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen -z-10"
    />
  );
};

export default SimpleParticleBackground;
