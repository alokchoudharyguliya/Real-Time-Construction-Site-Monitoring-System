
"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Calendar, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface Project {
  id: string;
  name: string;
  location: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'completed';
  deadline: string;
  contractor: string;
  stage: string;
  // latest image URL (backend 'recent_image')
  recent_image?: string;
  // legacy/local sample image
  image?: string;
}
// statusStats will be computed from the projects state inside the component

const COLORS = ['#34d399', '#f87171', '#60a5fa'];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on-track': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'delayed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

export function ProjectGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let mounted = true;
    let tl: any = null;
    async function run() {
      const { loadGsap, prefersReducedMotion } = await import('@/lib/gsap');
      const gsapModule = await loadGsap();
      if (!mounted || !gsapModule) return;
      if (prefersReducedMotion()) return;

      const gsap = gsapModule.gsap || gsapModule.default || gsapModule;
      const cards = containerRef.current?.querySelectorAll('.project-card') || [];
      tl = gsap.timeline();
      tl.from(cards, { scale: 0.98, opacity: 0, y: 12, stagger: 0.08, duration: 0.36, ease: 'back.out(1.1)' });
    }

    run();
    return () => { mounted = false; if (tl && tl.kill) tl.kill(); };
  }, []);

  // compute status statistics from fetched projects
  const statusStats = [
    { status: 'On Track', value: projects.filter((p) => p.status === 'on-track').length || 0 },
    { status: 'Delayed', value: projects.filter((p) => p.status === 'delayed').length || 0 },
    { status: 'Completed', value: projects.filter((p) => p.status === 'completed').length || 0 },
  ];

  // fetch projects from backend and map fields including recent_image
  useEffect(() => {
    let mounted = true;
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('http://127.0.0.1:8000/api/projects/', { headers });
        if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
        const data = await res.json();
        if (!mounted) return;
        if (!Array.isArray(data)) return;

        const mapped: Project[] = data.map((d: any) => ({
          id: String(d.id),
          name: d.name,
          location: d.location ?? '',
          progress: Number(d.progress ?? 0),
          // normalize backend 'on_track' -> 'on-track'
          status: (d.status || 'on_track').toString().replace('_', '-'),
          deadline: d.deadline ?? '',
          contractor: d.contractor ?? '',
          stage: d.stage ?? '',
          // try several possible fields for image URL
          recent_image: d.recent_image?.url ?? d.recent_image ?? d.recent_image_url ?? d.image ?? undefined,
          image: d.image ?? undefined,
        }));

        setProjects(mapped);
      } catch (err) {
        console.error('Error fetching projects', err);
        // keep existing projects (mock) on failure
      }
    };

    fetchProjects();
    return () => { mounted = false; };
  }, []);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recent Projects
        </h2>
        <Button variant="outline" onClick={() => router.push('/projects')}>View All</Button>
      </div>
      {/* Statistical Pie Chart */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 mb-4 shadow">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Project Status Overview</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={statusStats}
              dataKey="value"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
            >
              {statusStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Total Projects: <span className="font-bold">{projects.length}</span>
        </div>
      </div>

      {/* compute status stats from projects */}
      {/** Note: COLORS array defined above */}
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="project-card">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.recent_image ?? project.image}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {project.name}
                </CardTitle>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-1" />
                  {project.location}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <div>
                      <p className="text-xs">Deadline</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(project.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <div>
                      <p className="text-xs">Stage</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {project.stage}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button className="w-full" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}