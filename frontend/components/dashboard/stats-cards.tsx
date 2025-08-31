'use client';

import { motion } from 'framer-motion';
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
  
  const stats = user?.role === 'contractor' ? contractorStats : governmentStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}