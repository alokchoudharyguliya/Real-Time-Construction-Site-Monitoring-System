import dynamic from 'next/dynamic';

// Dynamically import client-only dashboard UI to avoid SSR evaluation of browser globals
const DashboardClient = dynamic(() => import('@/components/dashboard/DashboardClient'), { ssr: false });

export default function DashboardPage() {
  return <DashboardClient />;
}