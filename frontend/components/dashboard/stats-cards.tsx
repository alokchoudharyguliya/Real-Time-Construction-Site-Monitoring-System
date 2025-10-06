"use client";

import React, { useEffect, useRef } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';

const contractorStats = [
  {
    title: 'Active Projects',
    value: '12',
    change: '+2 this month',
    icon: Building2,
    color: 'text-blue-600'
  },
  {
    title: 'Completion Rate',
    value: '78%',
    change: '+5% from last month',
    icon: TrendingUp,
    color: 'text-green-600'
  },
  {
    title: 'Pending Reviews',
    value: '5',
    change: '2 urgent',
    icon: Clock,
    color: 'text-orange-600'
  },
  {
    title: 'Approved Stages',
    value: '34',
    change: '8 this week',
    icon: CheckCircle,
    color: 'text-emerald-600'
  }
];

const governmentStats = [
  {
    title: 'Total Projects',
    value: '45',
    change: '+7 this quarter',
    icon: Building2,
    color: 'text-blue-600'
  },
  {
    title: 'Contractors',
    value: '23',
    change: '3 new registrations',
    icon: Users,
    color: 'text-purple-600'
  },
  {
    title: 'Pending Approvals',
    value: '18',
    change: '5 urgent',
    icon: AlertTriangle,
    color: 'text-red-600'
  },
  {
    title: 'Completed This Month',
    value: '8',
    change: '+60% vs last month',
    icon: CheckCircle,
    color: 'text-green-600'
  }
];

export function StatsCards() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [projectCount, setProjectCount] = React.useState<number | null>(null);
  const [loadingCount, setLoadingCount] = React.useState(false);

  const stats = user?.account_type === 'contractor' ? contractorStats : governmentStats;
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mounted = true;
    let tl: any = null;
    async function run() {
      const { loadGsap, prefersReducedMotion } = await import('@/lib/gsap');
      const gsapModule = await loadGsap();
      if (!mounted || !gsapModule) return;
      if (prefersReducedMotion()) return;

      const gsap = gsapModule.gsap || gsapModule.default || gsapModule;
      const cards = containerRef.current?.querySelectorAll('.stats-card') || [];
      tl = gsap.timeline();
      tl.from(cards, { scale: 0.96, opacity: 0, y: 10, stagger: 0.08, duration: 0.36, ease: 'back.out(1.2)' });
    }

    run();

    // fetch project count for government/inspector users
    async function fetchCount() {
      if (user?.account_type !== 'inspector') return;
      setLoadingCount(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/api/projects/public-count/');
        if (!mounted) return;
        if (!res.ok) throw new Error('Failed to fetch count');
        const data = await res.json();
        // accept either { count: number } or { total: number }
        const value = typeof data.count === 'number' ? data.count : (typeof data.total === 'number' ? data.total : null);
        setProjectCount(value);
      } catch (e) {
        // leave projectCount as null on error
        setProjectCount(null);
      } finally {
        if (mounted) setLoadingCount(false);
      }
    }

    fetchCount();

    return () => { mounted = false; if (tl && tl.kill) tl.kill(); };
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.title} className="stats-card">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.title === 'Total Projects'
                  ? (loadingCount ? '—' : (projectCount !== null ? String(projectCount) : stat.value))
                  : stat.value}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}