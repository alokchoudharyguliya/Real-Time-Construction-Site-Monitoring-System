"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";
import { loadGsap, prefersReducedMotion } from "@/lib/gsap";

type AvatarProps = React.ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Root
> & {
  isOnline?: boolean;
};

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, isOnline = false, ...props }, ref) => {
  const elRef = React.useRef<HTMLDivElement | null>(null);
  const pulseRef = React.useRef<HTMLSpanElement | null>(null);
  const hoverTlRef = React.useRef<any>(null);
  const pulseTlRef = React.useRef<any>(null);

  // combine forwarded ref with local ref
  const setRefs = React.useCallback(
    (el: HTMLDivElement | null) => {
      elRef.current = el;
      if (!ref) return;
      if (typeof ref === "function") ref(el);
      else (ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
    },
    [ref]
  );

  React.useEffect(() => {
    let mounted = true;
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return;

    let gsap: any = null;

    loadGsap().then((g) => {
      if (!mounted || !g) return;
      const gAny = g as any;
      gsap = gAny.gsap || gAny.default || gAny;

      // hover scale animation using event listeners so we avoid server-side issues
      const el = elRef.current;
      if (el) {
        const onEnter = () => {
          if (hoverTlRef.current) hoverTlRef.current.kill();
          hoverTlRef.current = gsap.to(el, {
            scale: 1.06,
            duration: 0.18,
            ease: "power1.out",
          });
        };

        const onLeave = () => {
          if (hoverTlRef.current) hoverTlRef.current.kill();
          hoverTlRef.current = gsap.to(el, {
            scale: 1,
            duration: 0.22,
            ease: "power1.out",
          });
        };

        el.addEventListener("pointerenter", onEnter);
        el.addEventListener("pointerleave", onLeave);

        // cleanup listeners on unmount
        return () => {
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointerleave", onLeave);
        };
      }
    });

    return () => {
      mounted = false;
      try {
        if (hoverTlRef.current) hoverTlRef.current.kill();
        if (pulseTlRef.current) pulseTlRef.current.kill();
      } catch (e) {
        /* ignore */
      }
    };
  }, []);

  // pulse animation for online status
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return;
    let mounted = true;
    let gsap: any = null;

    loadGsap().then((g) => {
      if (!mounted || !g) return;
      const gAny = g as any;
      gsap = gAny.gsap || gAny.default || gAny;
      const pulseEl = pulseRef.current;
      if (!pulseEl) return;

      if (isOnline) {
        pulseTlRef.current = gsap.fromTo(
          pulseEl,
          { scale: 1, opacity: 0.9 },
          {
            scale: 1.9,
            opacity: 0,
            duration: 1.2,
            ease: "power1.out",
            repeat: -1,
            repeatDelay: 0.2,
          }
        );
      } else {
        if (pulseTlRef.current) pulseTlRef.current.kill();
        pulseTlRef.current = null;
      }
    });

    return () => {
      mounted = false;
      try {
        if (pulseTlRef.current) pulseTlRef.current.kill();
      } catch (e) {
        /* ignore */
      }
    };
  }, [isOnline]);

  return (
    <AvatarPrimitive.Root
      ref={setRefs}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full transform-gpu",
        className
      )}
      {...props}
    >
      {props.children}

      {/* Online indicator: pulse ring + dot */}
      <span className="pointer-events-none absolute bottom-0 right-0 flex items-center justify-center">
        <span
          ref={pulseRef}
          aria-hidden
          className={cn(
            "absolute inline-block h-4 w-4 rounded-full bg-emerald-400/60",
            !isOnline && "hidden"
          )}
        />
        <span
          className={cn(
            "relative inline-block h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-white",
            !isOnline && "hidden"
          )}
          aria-hidden
        />
      </span>
    </AvatarPrimitive.Root>
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
