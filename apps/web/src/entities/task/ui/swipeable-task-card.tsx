import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useMotionValueEvent } from 'framer-motion';
import { Task } from '@task-manager/types';
import { useSwipe } from '../../../shared/lib/hooks';
import { SwipeableActions, SwipeAction } from '../../../shared/ui/swipeable-actions';
import { TaskCard } from './task-card';

interface SwipeableTaskCardProps {
  task: Task;
  actions?: SwipeAction[];
  onSwipeStart?: () => void;
  onSwipeEnd?: () => void;
  onCardClick?: () => void;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

const MAX_SWIPE_DISTANCE = 100;

export const SwipeableTaskCard: React.FC<SwipeableTaskCardProps> = ({
  task,
  actions = [],
  onSwipeStart,
  onSwipeEnd,
  onCardClick,
  isOpen: controlledIsOpen,
  onOpenChange,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const handleOpenChange = (open: boolean) => {
    if (isControlled) {
      onOpenChange?.(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const { swipeProgress, handlers, elementRef } = useSwipe({
    onSwipeStart: () => {
      onSwipeStart?.();
    },
    onSwipeEnd: (progress) => {
      if (progress > 0.5) {
        handleOpenChange(true);
      } else {
        handleOpenChange(false);
      }
      onSwipeEnd?.();
    },
    maxSwipeDistance: MAX_SWIPE_DISTANCE,
    direction: 'left',
  });

  const currentProgress = useMotionValue(0);

  useMotionValueEvent(swipeProgress, 'change', (latest) => {
    if (!isOpen) {
      currentProgress.set(latest);
    }
  });

  useEffect(() => {
    currentProgress.set(isOpen ? 1 : swipeProgress.get());
  }, [isOpen, currentProgress]);

  const translateX = useTransform(currentProgress, (progress) => -progress * MAX_SWIPE_DISTANCE);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        if (isOpen) {
          handleOpenChange(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={cardRef}
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {actions.length > 0 && <SwipeableActions actions={actions} swipeProgress={currentProgress} />}

      <motion.div
        ref={elementRef as React.RefObject<HTMLDivElement>}
        style={{
          position: 'relative',
          zIndex: 2,
          backgroundColor: '#fff',
          x: translateX,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        {...handlers}
      >
        <TaskCard task={task} onClick={onCardClick} />
      </motion.div>
    </div>
  );
};
