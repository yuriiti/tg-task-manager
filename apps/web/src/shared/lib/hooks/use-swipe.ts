import { useRef, useCallback, useEffect } from 'react';
import { useMotionValue, MotionValue } from 'framer-motion';

interface UseSwipeOptions {
  onSwipeStart?: () => void;
  onSwipe?: (progress: number) => void;
  onSwipeEnd?: (progress: number) => void;
  threshold?: number;
  maxSwipeDistance?: number;
  direction?: 'left' | 'right' | 'both';
}

interface UseSwipeReturn {
  swipeProgress: MotionValue<number>;
  isSwiping: MotionValue<number>;
  elementRef: React.RefObject<HTMLElement | null>;
  handlers: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: (e: React.MouseEvent) => void;
    onMouseLeave: (e: React.MouseEvent) => void;
  };
}

export const useSwipe = (options: UseSwipeOptions = {}): UseSwipeReturn => {
  const {
    onSwipeStart,
    onSwipe,
    onSwipeEnd,
    threshold = 10,
    maxSwipeDistance = 100,
    direction = 'left',
  } = options;

  const swipeProgress = useMotionValue(0);
  const isSwiping = useMotionValue(0);

  const startXRef = useRef<number | null>(null);
  const startYRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  const calculateProgress = useCallback(
    (deltaX: number): number => {
      const clampedDelta = Math.max(0, Math.min(Math.abs(deltaX), maxSwipeDistance));
      return clampedDelta / maxSwipeDistance;
    },
    [maxSwipeDistance],
  );

  const handleStart = useCallback(
    (clientX: number, clientY: number) => {
      startXRef.current = clientX;
      startYRef.current = clientY;
      isDraggingRef.current = false;
      isSwiping.set(0);
    },
    [isSwiping],
  );

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (startXRef.current === null || startYRef.current === null) return;

      const deltaX = clientX - startXRef.current;
      const deltaY = clientY - startYRef.current;

      if (!isDraggingRef.current) {
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if (absDeltaX < threshold && absDeltaY < threshold) return;

        if (absDeltaX > absDeltaY) {
          isDraggingRef.current = true;
          isSwiping.set(1);
          onSwipeStart?.();
        } else {
          return;
        }
      }

      if (!isDraggingRef.current) return;

      const isLeftSwipe = deltaX < 0;
      const isRightSwipe = deltaX > 0;

      if (direction === 'left' && !isLeftSwipe) return;
      if (direction === 'right' && !isRightSwipe) return;

      const progress = calculateProgress(deltaX);
      swipeProgress.set(progress);
      onSwipe?.(progress);
    },
    [threshold, direction, calculateProgress, onSwipeStart, onSwipe],
  );

  const handleEnd = useCallback(() => {
    if (!isDraggingRef.current) return;

    const currentProgress = swipeProgress.get();
    onSwipeEnd?.(currentProgress);

    startXRef.current = null;
    startYRef.current = null;
    isDraggingRef.current = false;
    isSwiping.set(0);
  }, [swipeProgress, isSwiping, onSwipeEnd]);

  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const touchStartHandler = (e: TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    };

    const touchMoveHandler = (e: TouchEvent) => {
      if (startXRef.current === null || startYRef.current === null) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - startXRef.current;
      const deltaY = touch.clientY - startYRef.current;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Если это горизонтальное движение или уже идет свайп, предотвращаем прокрутку
      if (isDraggingRef.current || (absDeltaX > threshold && absDeltaX > absDeltaY)) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }

      handleMove(touch.clientX, touch.clientY);
    };

    const touchEndHandler = () => {
      handleEnd();
    };

    element.addEventListener('touchstart', touchStartHandler, { passive: true });
    element.addEventListener('touchmove', touchMoveHandler, { passive: false });
    element.addEventListener('touchend', touchEndHandler, { passive: true });

    return () => {
      element.removeEventListener('touchstart', touchStartHandler);
      element.removeEventListener('touchmove', touchMoveHandler);
      element.removeEventListener('touchend', touchEndHandler);
    };
  }, [handleStart, handleMove, handleEnd, threshold]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX, e.clientY);
    },
    [handleStart],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (startXRef.current === null) return;
      handleMove(e.clientX, e.clientY);
    },
    [handleMove],
  );

  const onMouseUp = useCallback(
    (_e: React.MouseEvent) => {
      handleEnd();
    },
    [handleEnd],
  );

  const onMouseLeave = useCallback(
    (_e: React.MouseEvent) => {
      if (isDraggingRef.current) {
        handleEnd();
      }
    },
    [handleEnd],
  );

  return {
    swipeProgress,
    isSwiping,
    elementRef,
    handlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
    },
  };
};
