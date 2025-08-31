'use client';

import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { SiteMap } from '@/components/map/site-map';

export default function MapView() {
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
            Site Map
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor construction sites across different locations
          </p>
        </div>

        {/* Map Component */}
        <SiteMap />
      </motion.div>
    </MainLayout>
  );
}