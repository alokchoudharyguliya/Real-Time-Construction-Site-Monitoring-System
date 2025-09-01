'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MainLayout } from '@/components/layout/main-layout';
import { ProfileView } from '@/components/profile/profile-view';
import { ProfileEdit } from '@/components/ui/profile-edit';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {isEditing ? (
          <ProfileEdit onCancel={() => setIsEditing(false)} onSave={() => setIsEditing(false)} />
        ) : (
          <ProfileView onEdit={() => setIsEditing(true)} />
        )}
      </motion.div>
    </MainLayout>
  );
}