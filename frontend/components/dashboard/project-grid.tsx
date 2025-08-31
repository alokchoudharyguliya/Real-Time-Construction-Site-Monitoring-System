'use client';

import { motion } from 'framer-motion';
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
  image: string;
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Metro Station Complex',
    location: 'Connaught Place, Delhi',
    progress: 75,
    status: 'on-track',
    deadline: '2024-06-15',
    contractor: 'BuildCorp Industries',
    stage: 'Superstructure',
    image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
  },
  {
    id: '2',
    name: 'Residential Tower A',
    location: 'Gurgaon, Haryana',
    progress: 45,
    status: 'delayed',
    deadline: '2024-08-20',
    contractor: 'Urban Developers',
    stage: 'Foundation',
    image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
  },
  {
    id: '3',
    name: 'Shopping Complex',
    location: 'Noida, UP',
    progress: 90,
    status: 'on-track',
    deadline: '2024-04-10',
    contractor: 'Modern Constructions',
    stage: 'Finishing',
    image: 'https://images.pexels.com/photos/3760164/pexels-photo-3760164.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&fit=crop'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'on-track': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'delayed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  }
};

export function ProjectGrid() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recent Projects
        </h2>
        <Button variant="outline">View All</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={project.image}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}