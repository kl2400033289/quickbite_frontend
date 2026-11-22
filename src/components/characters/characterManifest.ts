/**
 * QuickBite Character Asset Manifest
 * 
 * Centralized catalog for all character animation assets.
 * To replace animation files, place your looping WebM or MP4 files
 * in /public/assets/characters/<character>/ with the file names below.
 */

export type CharacterType = 'rider' | 'customer' | 'dog';

export interface CharacterAssetConfig {
  id: CharacterType;
  name: string;
  role: string;
  webmLoopSrc: string;
  mp4LoopSrc: string;
  fallbackImageSrc: string;
  altText: string;
  primaryColor: string;
  accentColor: string;
}

export const CHARACTER_MANIFEST: Record<CharacterType, CharacterAssetConfig> = {
  rider: {
    id: 'rider',
    name: 'Pip',
    role: 'Express Delivery Rider',
    webmLoopSrc: '/assets/characters/rider/rider-loop.webm',
    mp4LoopSrc: '/assets/characters/rider/rider-loop.mp4',
    fallbackImageSrc: '/assets/characters/pip-rider.png?v=2',
    altText: 'Pip, QuickBite express delivery rider with teal helmet and green delivery jacket',
    primaryColor: '#0D9488', // Teal helmet green
    accentColor: '#FF5A1F',  // Tangerine orange
  },
  customer: {
    id: 'customer',
    name: 'Maya',
    role: 'Gourmet Food Enthusiast',
    webmLoopSrc: '/assets/characters/customer/customer-loop.webm',
    mp4LoopSrc: '/assets/characters/customer/customer-loop.mp4',
    fallbackImageSrc: '/assets/characters/maya-customer.png?v=2',
    altText: 'Maya, cheerful food lover with high messy bun and rust-orange sweater',
    primaryColor: '#EA580C', // Rust orange sweater
    accentColor: '#F59E0B',  // Amber
  },
  dog: {
    id: 'dog',
    name: 'Biscuit',
    role: 'QuickBite Mascot & Snack Guard',
    webmLoopSrc: '/assets/characters/dog/dog-loop.webm',
    mp4LoopSrc: '/assets/characters/dog/dog-loop.mp4',
    fallbackImageSrc: '/assets/characters/biscuit-pup.png?v=2',
    altText: 'Biscuit, fluffy golden pup with wagging tail and happy smile',
    primaryColor: '#D97706', // Golden pup fur
    accentColor: '#0D9488',  // Teal collar
  },
};
