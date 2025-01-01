import { useEffect, useRef } from 'react';

export const useCalendarResize = (containerRef: React.RefObject<HTMLDivElement>) => {
  const resizeTimeoutRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;

      // Clear any existing timeout
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }

      // Set a new timeout
      resizeTimeoutRef.current = window.setTimeout(() => {
        const width = entry.contentRect.width;
        if (container && width > 0) {
          container.style.height = `${width}px`;
        }
      }, 100); // Debounce time
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [containerRef]);
};