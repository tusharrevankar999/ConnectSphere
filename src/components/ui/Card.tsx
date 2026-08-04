'use client';

import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padded?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hoverable = true, padded = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'bg-white rounded-2xl border border-slate-200/80 card-shadow transition-all duration-200',
          padded && 'p-6',
          hoverable && 'card-shadow-hover hover:border-blue-200',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const MotionCard = motion.create(Card);
