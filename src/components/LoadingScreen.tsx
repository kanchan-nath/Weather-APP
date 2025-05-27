import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { CloudRain } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loadingRef.current) {
      // Create animation timeline
      const tl = gsap.timeline();
      
      tl.fromTo(
        '.loading-logo',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
      
      tl.fromTo(
        '.loading-text',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 }
      );
      
      tl.fromTo(
        '.loading-bar',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }
      );
      
      // Animate raindrops
      gsap.fromTo(
        '.raindrop',
        { 
          y: -20,
          opacity: 0.7,
        },
        { 
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.2,
          repeat: -1,
          ease: 'power1.in'
        }
      );
    }
  }, []);

  return (
    <div 
      ref={loadingRef}
      className="loading-screen fixed inset-0 bg-gradient-to-b from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950 
                flex flex-col items-center justify-center"
    >
      <div className="relative">
        <div className="loading-logo bg-white dark:bg-gray-800 rounded-full p-5 shadow-lg">
          <CloudRain size={64} className="text-blue-500" />
        </div>
        
        {/* Raindrops */}
        <div className="absolute top-0 left-1/4 raindrop w-1 h-6 bg-blue-400 rounded-full"></div>
        <div className="absolute top-0 left-1/2 raindrop w-1 h-6 bg-blue-400 rounded-full"></div>
        <div className="absolute top-0 left-3/4 raindrop w-1 h-6 bg-blue-400 rounded-full"></div>
      </div>
      
      <h1 className="loading-text text-2xl font-bold mt-6 mb-8 text-gray-800 dark:text-white">SkyView Weather</h1>
      
      <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="loading-bar h-full bg-blue-500 origin-left"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;