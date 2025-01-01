import { useEffect, useRef } from 'react';

export const useCalendarResize = (containerRef: React.RefObject<HTMLDivElement>) => {
  const resizeTimeoutRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isResizing = false;
    const resizeObserver = new ResizeObserver((entries) => {
      if (isResizing) return;
      
      isResizing = true;
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = window.setTimeout(() => {
        try {
          window.dispatchEvent(new Event('resize'));
        } catch (error) {
          console.error('Error dispatching resize event:', error);
        } finally {
          isResizing = false;
        }
      }, 100);
    });

    try {
      resizeObserver.observe(container);
    } catch (error) {
      console.error('Error observing container:', error);
    }

    return () => {
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      try {
        resizeObserver.disconnect();
      } catch (error) {
        console.error('Error disconnecting observer:', error);
      }
    };
  }, []);
};