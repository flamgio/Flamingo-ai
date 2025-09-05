import { useEffect, useRef } from 'react';

export function useScrollAnimation() {
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Create intersection observer for scroll animations
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    // Observe all scroll elements
    const scrollElements = document.querySelectorAll('.scroll-element, .scroll-element-left, .scroll-element-right');
    scrollElements.forEach((element) => {
      observer.current?.observe(element);
    });

    // Parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      // Apply parallax to background elements
      const bgElements = document.querySelectorAll('.bg-3d-element');
      bgElements.forEach((element, index) => {
        const speed = (index + 1) * 0.2;
        (element as HTMLElement).style.transform = `translateY(${rate * speed}px)`;
      });

      // Parallax for sections
      const parallaxSections = document.querySelectorAll('.parallax-section');
      parallaxSections.forEach((section, index) => {
        const speed = 0.1 + (index * 0.05);
        (section as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
      });
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Cleanup function
    return () => {
      observer.current?.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { observer };
}

// Hook for individual element animation
export function useElementAnimation(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add('animate');
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref]);
}