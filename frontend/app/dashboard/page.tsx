'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ProjectGrid } from '@/components/dashboard/project-grid';
import { ImageUpload } from '@/components/upload/image-upload';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();
  if (!user) {
    router.push('/');
  }
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('welcome')}, {user?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {user?.account_type === 'contractor'
                ? 'Monitor your construction projects and upload progress updates'
                : 'Oversee all construction projects and approve progress stages'
              }
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards />

        {/* Image Upload Section */}
        {user?.account_type === 'contractor' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ImageUpload />
          </motion.div>
        )}

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProjectGrid />
        </motion.div>
      </motion.div>
    </MainLayout>
  );
}