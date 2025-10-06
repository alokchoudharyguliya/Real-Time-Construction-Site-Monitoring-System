// "use client";
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { Plus, Filter } from 'lucide-react';
// import { MainLayout } from '@/components/layout/main-layout';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
// import React, { useState, useRef } from 'react';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

// type Project = {
//   id: string;
//   name: string;
//   contractor: string;
//   location: string;
//   progress: number;
//   status: 'on-track' | 'delayed' | 'completed' | string;
//   budget: string;
//   deadline: string;
//   initial_report?: string | undefined;
// };

// const initialProjects: Project[] = [
//   {
//     id: '1',
//     name: 'Metro Station Complex',
//     contractor: 'BuildCorp Industries',
//     location: 'Connaught Place, Delhi',
//     progress: 75,
//     status: 'on-track',
//     budget: '₹50 Cr',
//     deadline: '2024-06-15',
//     initial_report: undefined,
//   },
//   {
//     id: '2',
//     name: 'Residential Tower A',
//     contractor: 'Urban Developers',
//     location: 'Gurgaon, Haryana',
//     progress: 45,
//     status: 'delayed',
//     budget: '₹25 Cr',
//     deadline: '2024-08-20',
//     initial_report: undefined,
//   },
//   {
//     id: '3',
//     name: 'Shopping Complex',
//     contractor: 'Modern Constructions',
//     location: 'Noida, UP',
//     progress: 90,
//     status: 'on-track',
//     budget: '₹35 Cr',
//     deadline: '2024-04-10',
//     initial_report: undefined,
//   },
//   {
//     id: '4',
//     name: 'Highway Bridge',
//     contractor: 'Infrastructure Ltd',
//     location: 'Mumbai-Pune Highway',
//     progress: 60,
//     status: 'on-track',
//     budget: '₹80 Cr',
//     deadline: '2024-09-30',
//     initial_report: undefined,
//   },
// ];

// export default function ProjectsPage() {
//   const [projects, setProjects] = useState<Project[]>(initialProjects);
//   const [open, setOpen] = useState(false);
//   const fileRef = useRef<HTMLInputElement | null>(null);
//   const router = useRouter();

//   const [form, setForm] = useState({
//     name: '',
//     contractor: '',
//     location: '',
//     budget: '',
//     deadline: new Date().toISOString().slice(0, 10),
//     status: 'on-track',
//   });

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'on-track':
//         return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
//       case 'delayed':
//         return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
//       case 'completed':
//         return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
//       default:
//         return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
//     }
//   };

//   const handleCreateProject = () => {
//     const id = String(Date.now());
//     const file = fileRef.current?.files?.[0];
//     const blobUrl = file ? URL.createObjectURL(file) : undefined;

//     const newProject: Project = {
//       id,
//       name: form.name || 'Untitled Project',
//       contractor: form.contractor || 'Unknown',
//       location: form.location || 'Unknown',
//       progress: 0,
//       status: form.status,
//       budget: form.budget || 'TBD',
//       deadline: form.deadline,
//       initial_report: blobUrl,
//     };

//     setProjects((prev) => [newProject, ...prev]);

//     setForm({ name: '', contractor: '', location: '', budget: '', deadline: new Date().toISOString().slice(0, 10), status: 'on-track' });
//     if (fileRef.current) fileRef.current.value = '';
//     setOpen(false);
//   };

//   return (
//     <MainLayout>
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Projects</h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive overview of all construction projects</p>
//           </div>

//           <div className="flex items-center space-x-3">
//             <Button variant="outline" className="gap-2">
//               <Filter className="h-4 w-4" />
//               Filter
//             </Button>

//             <>
//               <Button className="gap-2" onClick={() => setOpen(true)}>
//                 <Plus className="h-4 w-4" />
//                 New Project
//               </Button>

//               <Dialog open={open} onOpenChange={setOpen}>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>New Project</DialogTitle>
//                   </DialogHeader>

//                   <div className="space-y-4">
//                     <div>
//                       <Label htmlFor="name">Project Name</Label>
//                       <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })} />
//                     </div>

//                     <div>
//                       <Label htmlFor="contractor">Contractor</Label>
//                       <Input id="contractor" value={form.contractor} onChange={(e) => setForm({ ...form, contractor: (e.target as HTMLInputElement).value })} />
//                     </div>

//                     <div>
//                       <Label htmlFor="location">Location</Label>
//                       <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: (e.target as HTMLInputElement).value })} />
//                     </div>

//                     <div>
//                       <Label htmlFor="budget">Budget</Label>
//                       <Input id="budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: (e.target as HTMLInputElement).value })} />
//                     </div>

//                     <div>
//                       <Label htmlFor="deadline">Deadline</Label>
//                       <Input id="deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: (e.target as HTMLInputElement).value })} />
//                     </div>

//                     <div>
//                       <Label htmlFor="initialReport">Initial Report (optional)</Label>
//                       <Input id="initialReport" type="file" ref={fileRef} />
//                     </div>
//                   </div>

//                   <DialogFooter>
//                     <Button variant="ghost" onClick={() => setOpen(false)}>
//                       Cancel
//                     </Button>
//                     <Button onClick={handleCreateProject}>Create</Button>
//                   </DialogFooter>
//                 </DialogContent>
//               </Dialog>
//             </>
//           </div>
//         </div>

//         {/* Projects Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {projects.map((project, index) => (
//             <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
//               <Card className="hover:shadow-lg transition-shadow duration-200">
//                 <CardHeader className="pb-4">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
//                       <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.location}</p>
//                     </div>
//                     <Badge className={getStatusColor(project.status)}>{project.status.replace('-', ' ')}</Badge>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="text-gray-600 dark:text-gray-400">Contractor</p>
//                       <p className="font-medium">{project.contractor}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600 dark:text-gray-400">Budget</p>
//                       <p className="font-medium">{project.budget}</p>
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                       <span className="text-gray-600 dark:text-gray-400">Progress</span>
//                       <span className="font-medium">{project.progress}%</span>
//                     </div>
//                     <Progress value={project.progress} className="h-2" />
//                   </div>

//                   <div className="flex items-center justify-between pt-2">
//                     <span className="text-sm text-gray-600 dark:text-gray-400">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
//                     <div className="flex space-x-2">
//                       <Button variant="outline" size="sm" onClick={() => router.push(`/projects/${project.id}`)}>
//                         View Details
//                       </Button>
//                       <Button size="sm">Monitor</Button>
//                     </div>
//                   </div>

//                   {project.initial_report && (
//                     <div className="pt-2">
//                       <a href={project.initial_report} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400">
//                         View initial report
//                       </a>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>
//     </MainLayout>
//   );
// }




"use client";
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, Filter, ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';

type Project = {
  id: string;
  name: string;
  contractor: string;
  location: string;
  progress: number;
  // backend uses snake_case status like 'on_track' - keep union to accept both
  status: 'on-track' | 'delayed' | 'completed' | 'on_track' | 'on_hold' | string;
  budget: string;
  deadline: string;
  created_at?: string;
  updated_at?: string;
  initial_report?: string | undefined;
};

function NewProjectForm({ onBack, onCreate }: { onBack: () => void; onCreate: (project: Project) => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({
    name: '',
    contractor: '',
    location: '',
    budget: '',
    deadline: new Date().toISOString().slice(0, 10),
    status: 'on-track',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = String(Date.now());
    const file = fileRef.current?.files?.[0];
    const blobUrl = file ? URL.createObjectURL(file) : undefined;

    const newProject: Project = {
      id,
      name: form.name || 'Untitled Project',
      contractor: form.contractor || 'Unknown',
      location: form.location || 'Unknown',
      progress: 0,
      status: form.status,
      budget: form.budget || 'TBD',
      deadline: form.deadline,
      initial_report: blobUrl,
    };

    onCreate(newProject);

    setForm({ name: '', contractor: '', location: '', budget: '', deadline: new Date().toISOString().slice(0, 10), status: 'on-track' });
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    // outer wrapper constrains size and centers the form instead of occupying whole screen
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start justify-center min-h-[60vh] py-12"
    >
      <Card className="w-full  shadow-lg rounded-lg h-full">
        <div className="flex items-center px-6 py-4 border-b">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-bold">New Project</h2>
        </div>

        <CardContent className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })} />
              </div>
              <div>
                <Label htmlFor="contractor">Contractor</Label>
                <Input id="contractor" value={form.contractor} onChange={(e) => setForm({ ...form, contractor: (e.target as HTMLInputElement).value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: (e.target as HTMLInputElement).value })} />
              </div>
              <div>
                <Label htmlFor="budget">Budget</Label>
                <Input id="budget" value={form.budget} onChange={(e) => setForm({ ...form, budget: (e.target as HTMLInputElement).value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: (e.target as HTMLInputElement).value })} />
              </div>
              <div>
                <Label htmlFor="initialReport">Initial Report (optional)</Label>
                <Input id="initialReport" type="file" ref={fileRef} />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button variant="ghost" type="button" onClick={onBack}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('http://127.0.0.1:8000/api/projects/', { headers });
        if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
        const data = await res.json();
        const mapped: Project[] = Array.isArray(data)
          ? data.map((d: any) => ({
            id: String(d.id),
            name: d.name,
            contractor: d.contractor ?? d.created_by_name ?? 'Unknown',
            location: d.location ?? '',
            // backend uses numeric progress; default to 0
            progress: Number(d.progress ?? d.completion ?? 0),
            // normalize backend 'on_track' -> frontend 'on-track' for display
            status: (d.status || 'on_track').toString().replace('_', '-') ,
            budget: d.budget ?? 'TBD',
            // ensure deadline is a date string
            deadline: d.deadline ?? (d.due_date ?? new Date().toISOString().slice(0, 10)),
            initial_report: d.file_url ?? d.initial_report ?? undefined,
            created_at: d.created_at ?? d.createdAt,
            updated_at: d.updated_at ?? d.updatedAt,
          }))
          : [];
        setProjects(mapped);
      } catch (err) {
        console.error('Error fetching projects', err);
        // keep projects empty on failure (or optionally fall back to initialProjects)
      }
    };
    fetchProjects();
  }, []);


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const handleCreateProject = async (newProject: Project) => {
    // optimistic UI - add temp item
    const tempId = `temp-${Date.now()}`;
    const tempItem = { ...newProject, id: tempId };
    setProjects((prev) => [tempItem, ...prev]);

    try {
      const token = localStorage.getItem('jwt_token');
      // Align payload to backend field names (snake_case)
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // backend expects status values like 'on_track'
      const backendStatus = newProject.status.toString().replace('-', '_');
      const payload = {
        name: newProject.name,
        contractor: newProject.contractor,
        location: newProject.location,
        progress: newProject.progress,
        status: backendStatus,
        budget: newProject.budget,
        deadline: newProject.deadline,
      };

      const res = await fetch('http://127.0.0.1:8000/api/projects/', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      const created = await res.json();
      const createdProject: Project = {
        id: String(created.id),
        name: created.name,
        contractor: created.contractor ?? newProject.contractor,
        location: created.location ?? newProject.location,
        progress: Number(created.progress ?? 0),
        // normalize backend 'on_track' -> 'on-track'
        status: (created.status || backendStatus).toString().replace('_', '-'),
        budget: created.budget ?? newProject.budget,
        deadline: created.deadline ?? newProject.deadline,
        initial_report: created.file_url ?? newProject.initial_report,
        created_at: created.created_at ?? created.createdAt,
        updated_at: created.updated_at ?? created.updatedAt,
      };

      // replace temp with created
      setProjects((prev) => [createdProject, ...prev.filter((p) => p.id !== tempId)]);
    } catch (err) {
      console.error('Project create failed, keeping optimistic item', err);
      // Keep optimistic entry but remove temp id so user can retry/edit if desired
      setProjects((prev) => prev.map((p) => (p.id === tempId ? { ...p, id: tempId } : p)));
    } finally {
      setShowNewProject(false);
    }
  };

  return (
    <MainLayout>
      {showNewProject ? (
        <NewProjectForm
          onBack={() => setShowNewProject(false)}
          onCreate={handleCreateProject}
        />
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Projects</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive overview of all construction projects</p>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button className="gap-2" onClick={() => setShowNewProject(true)}>
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.location}</p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>{project.status.replace('-', ' ')}</Badge>
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
                      <span className="text-sm text-gray-600 dark:text-gray-400">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/projects/${project.id}`)}>
                          View Details
                        </Button>
                        <Button size="sm">Monitor</Button>
                      </div>
                    </div>

                    {project.initial_report && (
                      <div className="pt-2">
                        <a href={project.initial_report} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400">
                          View initial report
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </MainLayout>
  );
}