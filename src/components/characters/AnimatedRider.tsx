import React from 'react';
import { CharacterCompanion } from './CharacterCompanion';

export interface AnimatedRiderProps {
  variant?: 'hero' | 'guide' | 'inline' | 'floating';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  badge?: string;
  className?: string;
  flip?: boolean;
}

export const AnimatedRider: React.FC<AnimatedRiderProps> = ({
  variant = 'hero',
  size = 'lg',
  speechBubble = 'On the road! Fresh & hot in 25 mins.',
  badge = '⚡ Express',
  className = '',
  flip = false,
}) => {
  return (
    <CharacterCompanion
      character="rider"
      variant={variant}
      size={size}
      speechBubble={speechBubble}
      badge={badge}
      className={className}
      flip={flip}
    />
  );
};
