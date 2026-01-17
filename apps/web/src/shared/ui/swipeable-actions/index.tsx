import React from 'react';
import { Button, Space } from 'antd';
import { motion, MotionValue, useTransform } from 'framer-motion';

export interface SwipeAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  color?: 'default' | 'primary' | 'danger';
}

interface SwipeableActionsProps {
  actions: SwipeAction[];
  swipeProgress: MotionValue<number>;
}

export const SwipeableActions: React.FC<SwipeableActionsProps> = ({ actions, swipeProgress }) => {
  const opacity = useTransform(swipeProgress, (progress) => progress);
  const scale = useTransform(swipeProgress, (progress) => 0.8 + progress * 0.2);

  return (
    <div
      style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        paddingRight: '8px',
        zIndex: 1,
      }}
    >
      <Space size="small">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            style={{
              opacity,
              scale,
            }}
          >
            <Button
              type={action.color === 'danger' ? 'primary' : 'default'}
              danger={action.color === 'danger'}
              icon={action.icon}
              onClick={action.onClick}
              size="small"
            >
              {action.label}
            </Button>
          </motion.div>
        ))}
      </Space>
    </div>
  );
};
