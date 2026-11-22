import React from 'react';
import { CharacterCompanion } from './CharacterCompanion';

export interface AnimatedDogProps {
  variant?: 'corner' | 'inline' | 'floating';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  speechBubble?: string;
  badge?: string;
  hasItems?: boolean;
  className?: string;
}

export const AnimatedDog: React.FC<AnimatedDogProps> = ({
  variant = 'corner',
  size = 'sm',
  speechBubble,
  badge = '🐶 Biscuit',
  hasItems = false,
  className = '',
}) => {
  const defaultSpeech = hasItems
    ? 'Woof! Your feast is nearly ready!'
    : 'Ruff! Pick something yummy!';

  return (
    <CharacterCompanion
      character="dog"
      variant={variant}
      size={size}
      speechBubble={speechBubble || defaultSpeech}
      badge={badge}
      className={className}
    />
  );
};
