'use client';

import { motion } from 'framer-motion';
import { Building2, Plus, Filter } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const allProjects = [
  {
    id: '1',
    name: 'Metro Station Complex',
    contractor: 'BuildCorp Industries',
    location: 'Connaught Place, Delhi',
    progress: 75,
    status: 'on-track',
    budget: '₹50 Cr',
    deadline: '2024-06-15'
  },
  {
    id: '2',
    name: 'Residential Tower A',
    contractor: 'Urban Developers',
    location: 'Gurgaon, Haryana',
    progress: 45,
    status: 'delayed',
    budget: '₹25 Cr',
    deadline: '2024-08-20'
  },
  {
    id: '3',
    name: 'Shopping Complex',
    contractor: 'Modern Constructions',
    location: 'Noida, UP',
    progress: 90,
    status: 'on-track',
    budget: '₹35 Cr',
    deadline: '2024-04-10'
  },
  {
    id: '4',
    name: 'Highway Bridge',
    contractor: 'Infrastructure Ltd',
    location: 'Mumbai-Pune Highway',
    progress: 60,
    status: 'on-track',
    budget: '₹80 Cr',
    deadline: '2024-09-30'
  }
];

export default function Projects() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'delayed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              All Projects
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive overview of all construction projects
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {project.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {project.location}
                      </p>
                    </div>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Contractor</p>
                      <p className="font-medium">{project.contractor}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Budget</p>
                      <p className="font-medium">{project.budget}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Deadline: {new Date(project.deadline).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        Monitor
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </MainLayout>
  );
}