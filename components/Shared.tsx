/**
 * Shared.tsx - Barrel export for backwards compatibility
 * 
 * The original monolithic components have been split into separate files:
 * - Header.tsx
 * - Footer.tsx  
 * - SearchOverlay.tsx
 * 
 * This file re-exports them for existing imports to continue working.
 */

// Re-export layout components from their new locations
export { Header } from './Header';
export { Footer } from './Footer';
export { SearchOverlay } from './SearchOverlay';

// Re-export UI components
export { Button } from './ui/Button';
export { FadeIn } from './ui/FadeIn';
export { Section } from './ui/Section';
export { AnimatedCounter } from './ui/AnimatedCounter';
export { WhatsAppFloat } from './ui/WhatsAppFloat';
export { Pagination } from './ui/Pagination';
export { ParallaxHeader } from './ui/ParallaxHeader';
export { ExperienceGrid } from './ui/ExperienceGrid';