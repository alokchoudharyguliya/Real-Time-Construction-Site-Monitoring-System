"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import React from 'react';

type ProjectStat = {
  id: string;
  name: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'completed';
  deadline: string;
};

export default function ContractorProfileClient({ id }: { id: string }) {
  const router = useRouter();
  // Dummy contractor data — replace with real fetch if desired
  const contractor = {
    id,
    name: `Contractor ${id}`,
    email: `contractor${id}@example.com`,
    phone: '+91-98765-43210',
    license: `LIC-${id}-2025`,
    rating: 4.6,
    location: 'Bengaluru, Karnataka',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Experienced civil contractor with a focus on safety and timely delivery. Handles residential and commercial projects across south India.',
  };

  const projectStats: ProjectStat[] = [
    { id: 'p1', name: 'Site A - Residential', progress: 72, status: 'on-track', deadline: '2025-11-30' },
    { id: 'p2', name: 'Mall Expansion', progress: 40, status: 'delayed', deadline: '2026-02-15' },
    { id: 'p3', name: 'Bridge Renovation', progress: 100, status: 'completed', deadline: '2024-08-10' },
  ];

  const handled = projectStats.length;
  const avgProgress = Math.round(projectStats.reduce((s, p) => s + p.progress, 0) / handled);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Contractor Profile</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={contractor.avatar} alt={contractor.name} />
                <AvatarFallback>{contractor.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-xl font-semibold">{contractor.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{contractor.location}</p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{contractor.bio}</p>

                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Projects Handled</p>
                    <p className="font-bold text-lg">{handled}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Average Progress</p>
                    <p className="font-bold text-lg">{avgProgress}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="font-bold text-lg">★ {contractor.rating}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projectStats.map((p) => (
                <div key={p.id} className="p-4 bg-white dark:bg-gray-900 rounded shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-sm text-gray-500">Deadline: {new Date(p.deadline).toLocaleDateString()}</p>
                    </div>
                    <div className="w-40">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium">{p.progress}%</span>
                      </div>
                      <Progress value={p.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
