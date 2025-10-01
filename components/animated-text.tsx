'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
  stagger?: number;
  duration?: number;
}

export default function AnimatedText({ 
  children, 
  className = '', 
  delay = 0.3,
  as: Component = 'div',
  stagger = 0.1,
  duration = 0.6
}: AnimatedTextProps) {
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const animateText = async () => {
      if (!textRef.current) return;

      // Manual text splitting approach
      const originalText = textRef.current.textContent || '';
      const words = originalText.split(' ');
      
      // Clear the original text
      textRef.current.innerHTML = '';
      
      // Create spans for each word
      const wordElements: HTMLElement[] = [];
      words.forEach((word, index) => {
        const wordSpan = document.createElement('span');
        wordSpan.style.display = 'inline-block';
        wordSpan.style.overflow = 'hidden';
        
        // Create inner span for animation
        const innerSpan = document.createElement('span');
        innerSpan.textContent = word;
        innerSpan.style.display = 'inline-block';
        innerSpan.style.transform = 'translateY(100%)';
        innerSpan.style.opacity = '0';
        
        wordSpan.appendChild(innerSpan);
        
        if (textRef.current) {
          textRef.current.appendChild(wordSpan);
          
          // Add space after word (except last)
          if (index < words.length - 1) {
            const space = document.createTextNode(' ');
            textRef.current.appendChild(space);
          }
        }
        
        wordElements.push(innerSpan);
      });

      // Set container to visible
      gsap.set(textRef.current, { opacity: 1 });

      // Animate each word
      gsap.to(wordElements, {
        duration,
        y: 0,
        opacity: 1,
        stagger,
        ease: "expo.out",
        delay
      });
    };

    // Wait a bit for everything to be ready
    const timer = setTimeout(animateText, 100);
    
    return () => clearTimeout(timer);
  }, [delay, stagger, duration]);

  return (
    <Component ref={textRef as any} className={className} style={{ opacity: 0 }}>
      {children}
    </Component>
  );
}
