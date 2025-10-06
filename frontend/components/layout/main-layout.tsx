"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Sidebar } from './sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    let tl: any = null;

    async function run() {
      const { loadGsap, prefersReducedMotion } = await import('@/lib/gsap');
      const gsapModule = await loadGsap();
      if (!mounted || !gsapModule) return;
      if (prefersReducedMotion()) return;

      const gsap = gsapModule.gsap || gsapModule.default || gsapModule;
      const el = contentRef.current;
      if (!el) return;

      if (tl && tl.kill) tl.kill();
      tl = gsap.timeline();
      // From slightly below and transparent -> neutral
      tl.from(el, { y: 8, opacity: 0, duration: 0.5, ease: 'power2.out' });
    }

    run();

    return () => {
      mounted = false;
      if (tl && tl.kill) tl.kill();
    };
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}