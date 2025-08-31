'use client';

import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { ThreeViewer } from '@/components/3d/three-viewer';
import { useLanguage } from '@/hooks/use-language';

export default function ThreeDView() {
  const { t } = useLanguage();

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('3d_view')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Interactive 3D visualization of construction progress
          </p>
        </div>

        {/* 3D Viewer */}
        <ThreeViewer />
      </motion.div>
    </MainLayout>
  );
}