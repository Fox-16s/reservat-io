import { useEffect, useRef } from 'react';

export const useCalendarResize = (containerRef: React.RefObject<HTMLDivElement>) => {
  const resizeTimeoutRef = useRef<number>();
  const isResizingRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      if (isResizingRef.current) return;

      isResizingRef.current = true;
      
      // Clear any existing timeout
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }

      // Set a new timeout
      resizeTimeoutRef.current = window.setTimeout(() => {
        try {
          const entry = entries[0];
          if (!entry) return;

          const width = entry.contentRect.width;
          container.style.height = `${width}px`;
        } catch (error) {
          console.error('Error in resize observer:', error);
        } finally {
          isResizingRef.current = false;
        }
      }, 100); // Debounce time
    };

    const resizeObserver = new ResizeObserver(handleResize);

    try {
      resizeObserver.observe(container);
    } catch (error) {
      console.error('Error setting up resize observer:', error);
    }

    return () => {
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      try {
        resizeObserver.disconnect();
      } catch (error) {
        console.error('Error cleaning up resize observer:', error);
      }
    };
  }, [containerRef]);
};