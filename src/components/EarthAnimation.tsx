import { useEffect, useRef } from "react";
import p5 from "p5";

interface EarthAnimationProps {
  className?: string;
}

const EarthAnimation = ({ className = "" }: EarthAnimationProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<p5 | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const sketch = (p: p5) => {
      let angle = 0;

      p.setup = () => {
        const canvas = p.createCanvas(400, 400, p.WEBGL);
        canvas.parent(canvasRef.current!);
      };

      p.draw = () => {
        p.clear();
        p.noStroke();
        
        // Lighting
        p.ambientLight(100);
        p.directionalLight(255, 255, 255, 0.5, 0.5, -1);
        
        // Rotate the globe
        p.rotateY(angle);
        p.rotateX(p.PI / 6);
        
        // Draw continents (simplified)
        drawEarth(p);
        
        angle += 0.005;
      };

      const drawEarth = (p: p5) => {
        // Ocean - pastel blue
        p.fill(167, 199, 231, 200);
        p.sphere(100);
        
        // Draw simplified continents
        p.push();
        
        // North America
        p.rotateY(p.PI * 0.3);
        p.fill(184, 230, 184, 220);
        p.translate(0, -30, 105);
        p.sphere(35);
        
        p.pop();
        p.push();
        
        // South America
        p.rotateY(p.PI * 0.4);
        p.fill(193, 240, 193, 220);
        p.translate(0, 20, 105);
        p.sphere(25);
        
        p.pop();
        p.push();
        
        // Europe/Africa
        p.rotateY(p.PI * 0.6);
        p.fill(176, 224, 176, 220);
        p.translate(0, 0, 105);
        p.sphere(40);
        
        p.pop();
        p.push();
        
        // Asia
        p.rotateY(p.PI * 0.85);
        p.fill(168, 234, 168, 220);
        p.translate(0, -10, 105);
        p.sphere(45);
        
        p.pop();
      };

      p.windowResized = () => {
        // Keep canvas size fixed for consistency
      };
    };

    p5Instance.current = new p5(sketch);

    return () => {
      p5Instance.current?.remove();
    };
  }, []);

  return <div ref={canvasRef} className={className} />;
};

export default EarthAnimation;

