
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import ProjectPageClient from './ProjectPageClient';
export function generateStaticParams() {
  // List all possible project IDs here
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' }
  ];
}

const mockProject = {
  id: '1',
  name: 'Metro Station Complex',
  contractor: 'BuildCorp Industries',
  location: 'Connaught Place, Delhi',
  progress: 75,
  status: 'on-track',
  budget: '₹50 Cr',
  deadline: '2024-06-15',
  stages: [
    { name: 'Foundation', date: '2023-01-10' },
    { name: 'Superstructure', date: '2023-06-15' },
    { name: 'Finishing', date: '2024-04-01' }
  ],
  cameras: [
    { id: 'cam1', name: 'Gate Camera', thumbnail: '/camera1.jpg' },
    { id: 'cam2', name: 'Main Hall', thumbnail: '/camera2.jpg' },
    { id: 'cam3', name: 'Perimeter', thumbnail: '/camera3.jpg' }
  ]
};

// Render a lightweight server component that dynamic-imports the client-only UI
// const ProjectPageClient = dynamic(
//   () => import('@/components/projects/ProjectPageClient'),
//   { ssr: false }
// );

export default function ProjectPage() {
  return <ProjectPageClient />;
}