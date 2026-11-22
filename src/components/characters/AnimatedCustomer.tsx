import React from 'react';
import { CharacterCompanion } from './CharacterCompanion';

export interface AnimatedCustomerProps {
  variant?: 'guide' | 'inline' | 'floating';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: string;
  badge?: string;
  className?: string;
  flip?: boolean;
}

export const AnimatedCustomer: React.FC<AnimatedCustomerProps> = ({
  variant = 'guide',
  size = 'md',
  speechBubble = 'These chef specials smell incredible! 😋',
  badge = 'Top Pick',
  className = '',
  flip = false,
}) => {
  return (
    <CharacterCompanion
      character="customer"
      variant={variant}
      size={size}
      speechBubble={speechBubble}
      badge={badge}
      className={className}
      flip={flip}
    />
  );
};
