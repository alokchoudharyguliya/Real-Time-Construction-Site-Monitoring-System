// Client-only GSAP helper. Lazy-loads GSAP to avoid SSR issues and provides
// a small utility to create timelines while respecting prefers-reduced-motion.
export async function loadGsap() {
  if (typeof window === 'undefined') return null;
  // dynamic import so SSR won't try to parse gsap
  const gsap = await import('gsap');
  return gsap;
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
