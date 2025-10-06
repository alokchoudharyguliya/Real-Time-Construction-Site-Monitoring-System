"use client";

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { loadGsap, prefersReducedMotion } from '@/lib/gsap';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    // Refs to manage GSAP timeline and DOM node
    const elRef = React.useRef<HTMLElement | null>(null);
    const tlRef = React.useRef<any>(null);

    React.useEffect(() => {
      // If user prefers reduced motion, skip JS animations
      if (prefersReducedMotion()) return;

      let mounted = true;

      loadGsap().then((gsapModule) => {
        if (!mounted || !gsapModule || !elRef.current) return;
        const gsap = (gsapModule as any).gsap ?? gsapModule;

        // create a paused timeline for press animation
        tlRef.current = gsap.timeline({ paused: true });
        tlRef.current.to(elRef.current, {
          scale: 0.98,
          duration: 0.08,
          ease: 'power1.out',
        });
      }).catch(() => {
        // ignore loader errors silently
      });

      return () => {
        mounted = false;
        try {
          tlRef.current?.kill?.();
        } catch (e) {
          // noop
        }
      };
    }, []);

    // pointer handlers to play/rewind the press micro-interaction
    const handlePointerDown: React.PointerEventHandler = (e) => {
      // let the native event still focus the button
      if (prefersReducedMotion()) return;
      tlRef.current?.play?.();
    };

    const handlePointerUp: React.PointerEventHandler = (e) => {
      if (prefersReducedMotion()) return;
      tlRef.current?.reverse?.();
    };

    const handlePointerLeave: React.PointerEventHandler = (e) => {
      if (prefersReducedMotion()) return;
      tlRef.current?.reverse?.();
    };

    return (
      <Comp
        ref={(node: any) => {
          // forward ref
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as React.MutableRefObject<any>).current = node;
          // local ref for animation
          elRef.current = node;
        }}
        onPointerDown={(e) => {
          props.onPointerDown?.(e as any);
          handlePointerDown(e as any);
        }}
        onPointerUp={(e) => {
          props.onPointerUp?.(e as any);
          handlePointerUp(e as any);
        }}
        onPointerCancel={(e) => {
          props.onPointerCancel?.(e as any);
          handlePointerLeave(e as any);
        }}
        onPointerLeave={(e) => {
          props.onPointerLeave?.(e as any);
          handlePointerLeave(e as any);
        }}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
