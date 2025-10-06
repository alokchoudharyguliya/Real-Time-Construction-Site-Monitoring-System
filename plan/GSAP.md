
Progress update: I scanned components and identified many UI primitives plus layout and pages. Next I'll propose specific animation changes for a short list of components (header, hero/main-layout, sidebar, buttons, cards, carousel, modals, toasts). Expected outcome: a numbered list of proposed animations you can approve or reject.

What I'll do next
I'll propose a concise list of specific, reviewable GSAP animation changes targeted at concrete components I found in components. You can approve or reject each item; after you approve an item I'll implement it and move it to the next todo.

Candidate components I found
Layout: components/layout/header.tsx, components/layout/main-layout.tsx, components/layout/sidebar.tsx, components/layout/notification-panel.tsx
UI primitives: components/ui/button.tsx, components/ui/card.tsx, components/ui/carousel.tsx, components/ui/drawer.tsx, components/ui/dialog.tsx, components/ui/toast.tsx, components/ui/avatar.tsx
Pages/widgets: components/dashboard/project-grid.tsx, components/dashboard/stats-cards.tsx
Auth forms: components/auth/login-form.tsx, components/auth/signup-form.tsx
Proposed animation changes (approve/reject each)
I'll list each change as a separate item so you can approve them individually.

Header entrance/scroll reveal
File: components/layout/header.tsx
Effect: Slide down + fade-in on page load (stagger for menu items).
Trigger: on initial mount; small parallax scroll fade as user scrolls down.
Duration/easing: 0.6s, power3.out for entrance; scroll opacity easing 0.4s.
Reduced-motion: respect prefers-reduced-motion; fall back to no animation.
Sidebar open/close
File: components/layout/sidebar.tsx
Effect: Smooth x-translation and overlay fade when sidebar opens; staggered reveal for menu items.
Trigger: when sidebar state toggles.
Duration/easing: 0.45s, power2.out; items 0.08s stagger.
Accessibility: trap focus after opening; ensure immediate open if reduced-motion.
Main layout content page transitions
File: components/layout/main-layout.tsx
Effect: Route/page content cross-fade with slight upward slide on navigation.
Trigger: Next.js route change or layout children change.
Duration/easing: 0.5s, power2.out.
Consideration: Avoid animating heavy components (videos) — only container.
Hero / stats cards entrance
File: components/dashboard/stats-cards.tsx and components/dashboard/project-grid.tsx
Effect: Staggered scale/opacity entrance for cards, subtle upward movement.
Trigger: on mount and when cards are filtered/updated.
Duration/easing: each 0.36s, stagger 0.08s, back.out(1.2) for slight pop.
Perf: use will-change CSS and limit animated props to transform/opacity.
Button micro-interactions
File: components/ui/button.tsx
Effect: Quick scale (1 -> .98 -> 1) and color glow on pointer down; hover lift.
Trigger: pointer events (mousedown/hover).
Duration/easing: 0.12s press, 0.2s hover.
Fallback: purely CSS for reduced-motion / no-JS.
Modal / Dialog open/close
File: components/ui/dialog.tsx, components/ui/drawer.tsx
Effect: Scale + fade for modal, slide + fade for drawer; backdrop fade.
Trigger: when dialog/drawer opens/closes.
Duration/easing: 0.35–0.45s, elastic-like for modal entrance optional.
Accessibility: respect focus management and reduced-motion.
Carousel transitions
File: components/ui/carousel.tsx
Effect: Smooth slide with momentum easing; crossfade for images when transitioning.
Trigger: on next/prev or autoplay.
Duration/easing: 0.6s, power4.out / easeInOut.
Extra: pause autoplay on hover/touch.
Toast in/out animations
File: components/ui/toast.tsx, components/ui/toaster.tsx
Effect: Slide up + fade in, quick exit with y-snap and fade.
Trigger: toast show/hide.
Duration/easing: 0.28s in, 0.2s out, power2.out.
Avatar hover / online pulse
File: components/ui/avatar.tsx
Effect: On hover, subtle scale + ring pulse for online status; idle breathing animation for online users (very subtle).
Trigger: hover and status prop.
Duration/easing: continuous 2.5s slow pulse (reduced-motion disabled).
Map / Video region entrance
File: components/layout/ or components/map/* (if used)
Effect: Fade/scale for overlays, indicator pulses for new detections (if relevant to monitoring).
Trigger: overlay mount or detection event.
Duration/easing: short 0.25–0.5s pulse.
Auth form field focus animations
File: components/auth/login-form.tsx, components/auth/signup-form.tsx
Effect: Floating label motion, subtle input border glow on focus, submit button micro-interaction.
Trigger: focus/blur events.
Accessibility: maintain keyboard usability and reduced-motion.
Global utility: GSAP wrapper and useGsap hook
Files to add: frontend/lib/gsap.ts or frontend/hooks/useGsap.ts
Purpose: encapsulate GSAP imports, timeline creation, and reduced-motion checks; provide hooks to run timelines safely in Next.js (client-only).
Notes: Lazy-load GSAP on client to reduce SSR issues.
Dependency and setup
Update: add gsap to package.json (npm install)
Add usage docs in frontend/README.md or a short frontend/components/ANIMATIONS.md.
Next step
Pick which proposals you want implemented first (reply with the item numbers to approve). I recommend starting with small, high-impact items:

(1) Header entrance,
(5) Button micro-interactions,
(8) Toast animations,
(12) GSAP wrapper/hook and dependency install.
Once you approve an item I'll:

Mark the todo as in-progress,
Add the dependency and wrapper (if approved),
Implement the animation in the component,
Run the dev server to smoke test,
Commit the change and report back.
If you want, I can also suggest exact GSAP code snippets for each approved item before applying them. Which items do you approve?