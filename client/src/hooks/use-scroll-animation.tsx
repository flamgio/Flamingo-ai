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

    // Enhanced parallax effect on scroll with smoother animations
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.3;

      // Apply smoother parallax to background elements
      const bgElements = document.querySelectorAll('.bg-3d-element');
      bgElements.forEach((element, index) => {
        const speed = (index + 1) * 0.15;
        const rotation = scrolled * 0.05;
        (element as HTMLElement).style.transform = `translateY(${rate * speed}px) rotate(${rotation}deg) scale(${1 + scrolled * 0.0001})`;
      });

      // Smoother parallax for sections
      const parallaxSections = document.querySelectorAll('.parallax-section');
      parallaxSections.forEach((section, index) => {
        const speed = 0.08 + (index * 0.03);
        const opacity = Math.max(0.5, 1 - scrolled * 0.001);
        (section as HTMLElement).style.transform = `translateY(${scrolled * speed}px)`;
        (section as HTMLElement).style.opacity = `${opacity}`;
      });

      // Add smooth fade effects for content
      const contentElements = document.querySelectorAll('.scroll-element, .scroll-element-left, .scroll-element-right');
      contentElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const visible = rect.top < window.innerHeight && rect.bottom > 0;
        if (visible) {
          const progress = (window.innerHeight - rect.top) / window.innerHeight;
          (element as HTMLElement).style.opacity = `${Math.min(1, progress * 1.5)}`;
          (element as HTMLElement).style.transform = `translateY(${(1 - progress) * 50}px)`;
        }
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