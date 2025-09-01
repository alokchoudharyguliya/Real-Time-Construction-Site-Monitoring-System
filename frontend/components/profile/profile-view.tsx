'use client';

import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Building,
  FileText,
  Shield,
  Edit3,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import { useCallback } from 'react';
export function ProfileView({ onEdit }: { onEdit?: () => void }) {
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) return null;
  const handleExportProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch('http://127.0.0.1:8000/api/auth/profile/idcard/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        alert('Failed to download ID card');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'idcard.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error downloading ID card');
    }
  }, []);
  const profileSections = [
    {
      title: 'Personal Information',
      items: [
        { label: 'Full Name', value: user.name, icon: User },
        { label: 'Email Address', value: user.email, icon: Mail },
        { label: 'Phone Number', value: user.phone || 'Not provided', icon: Phone },
      ]
    },
    {
      title: 'Professional Details',
      items: [
        { label: 'Organization', value: user.organization || 'Not specified', icon: Building },
        { label: 'License Number', value: user.licenseNumber || 'N/A', icon: FileText },
        { label: 'Account Type', value: user.account_type, icon: Shield },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('profile')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account information and preferences
          </p>
        </div>
        <Button className="gap-2" onClick={onEdit}>
          <Edit3 className="h-4 w-4" />
          {t('edit')}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="text-2xl font-bold">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">
                    {user.account_type}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={
                    user.account_type === 'contractor'
                      ? 'border-blue-200 text-blue-700 bg-blue-50'
                      : 'border-orange-200 text-orange-700 bg-orange-50'
                  }
                >
                  {user.account_type === 'contractor' ? 'Licensed Contractor' : 'Government Official'}
                </Badge>

                <div className="pt-4">
                  <Button variant="outline" className="w-full gap-2" onClick={handleExportProfile}>
                    <Download className="h-4 w-4" />
                    Export Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {profileSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + sectionIndex * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.items.map((item, index) => (
                    <div key={item.label}>
                      <div className="flex items-center space-x-3 py-3">
                        <div className="flex-shrink-0">
                          <item.icon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.label}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {item.value}
                          </p>
                        </div>
                      </div>
                      {index < section.items.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Permissions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Permissions & Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((permission) => (
                    <Badge
                      key={permission}
                      variant="secondary"
                      className="text-xs"
                    >
                      {permission.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}