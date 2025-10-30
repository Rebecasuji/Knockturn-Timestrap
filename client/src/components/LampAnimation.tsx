import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface LampAnimationProps {
  onPullComplete?: () => void;
}

export default function LampAnimation({ onPullComplete }: LampAnimationProps) {
  const lampRef = useRef<HTMLDivElement>(null);
  const bulbRef = useRef<HTMLDivElement>(null);
  const stringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isPulled, setIsPulled] = useState(false);

  useEffect(() => {
    const bulb = bulbRef.current;
    if (!bulb) return;

    gsap.to(bulb, {
      opacity: 0.6,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    });
  }, []);

  const handlePull = () => {
    if (isPulled) return;
    setIsPulled(true);

    const timeline = gsap.timeline();
    
    timeline
      .to(stringRef.current, {
        scaleY: 1.3,
        duration: 0.2,
        ease: "power2.out"
      })
      .to(stringRef.current, {
        scaleY: 1,
        duration: 0.3,
        ease: "elastic.out(1, 0.3)"
      })
      .to(bulbRef.current, {
        opacity: 1,
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.3")
      .to(glowRef.current, {
        scale: 3,
        opacity: 0.8,
        duration: 0.7,
        ease: "power2.out"
      }, "-=0.3")
      .to(glowRef.current, {
        scale: 5,
        opacity: 0,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          if (onPullComplete) {
            setTimeout(onPullComplete, 200);
          }
        }
      });
  };

  return (
    <div ref={lampRef} className="relative flex flex-col items-center justify-center">
      <div className="relative">
        <div 
          ref={glowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary rounded-full blur-3xl opacity-0 pointer-events-none"
        />
        
        <div className="relative z-10 bg-gradient-to-b from-gray-700 to-gray-800 w-24 h-8 rounded-t-full" />
        
        <div
          ref={bulbRef}
          className="relative z-10 w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-full shadow-2xl shadow-blue-500/50 opacity-50"
          style={{
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.6), 0 0 80px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(255, 255, 255, 0.3)'
          }}
        />
        
        <div
          ref={stringRef}
          onClick={handlePull}
          className="relative z-10 w-0.5 h-24 mx-auto bg-gray-400 cursor-pointer origin-top"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-500 rounded-full" />
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-muted-foreground text-sm">Pull the string to login</p>
      </div>
    </div>
  );
}
