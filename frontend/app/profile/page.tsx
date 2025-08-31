'use client';

import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { ProfileView } from '@/components/profile/profile-view';

export default function Profile() {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ProfileView />
      </motion.div>
    </MainLayout>
  );
}