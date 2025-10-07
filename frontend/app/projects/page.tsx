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
import dynamic from 'next/dynamic';
const ProjectPageClient = dynamic(() => import('@/components/projects/ProjectPageClient'), { ssr: false });
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';
type Project = {
  id: string;
  name: string;
  contractor: string;
  location: string;
  progress: number;
  status: 'on-track' | 'delayed' | 'completed' | 'on_track' | 'on_hold' | string;
  budget: string;
  deadline: string;
  created_at?: string;
  updated_at?: string;
  reports?: string[];
  created_by?: string;
  recent_image?: string;
  cameras?: { id: string; name: string; thumbnail?: string }[];
};

function NewProjectForm({ onBack, onCreate, contractors }: { onBack: () => void; onCreate: (project: Project) => void; contractors: string[] }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const indianStates = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu & Kashmir','Ladakh','Puducherry'
  ];

  const [form, setForm] = useState({
    name: '',
    contractor: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    budget: '',
    deadline: new Date().toISOString().slice(0, 10),
    status: 'on-track',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = String(Date.now());
    const file = fileRef.current?.files?.[0];
    const blobUrl = file ? URL.createObjectURL(file) : undefined;

    // run HTML5 validity checks (required fields)
    const formEl = e.currentTarget as HTMLFormElement;
    if (typeof formEl.reportValidity === 'function' && !formEl.reportValidity()) {
      return;
    }

    const newProject: Project = {
      id,
      name: form.name || 'Untitled Project',
      contractor: form.contractor || 'Unknown',
      location: `${form.address}${form.city ? ', ' + form.city : ''}${form.state ? ', ' + form.state : ''}` || 'Unknown',
      progress: 0,
      status: form.status,
      budget: form.budget || 'TBD',
      deadline: form.deadline,
      reports: [],
      recent_image: blobUrl ?? undefined,
    };

    onCreate(newProject);

    setForm({ name: '', contractor: '', address: '', city: '', state: 'Maharashtra', budget: '', deadline: new Date().toISOString().slice(0, 10), status: 'on-track' });
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
                <Label htmlFor="name">Project Name *</Label>
                <Input id="name" value={form.name} required onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })} />
              </div>
              <div>
                <Label htmlFor="contractor">Contractor *</Label>
                {contractors && contractors.length > 0 ? (
                  <select id="contractor" required className="w-full rounded border p-2" value={form.contractor} onChange={(e) => setForm({ ...form, contractor: e.target.value })}>
                    <option value="">Select contractor</option>
                    {contractors.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <Input id="contractor" value={form.contractor} required onChange={(e) => setForm({ ...form, contractor: (e.target as HTMLInputElement).value })} />
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input id="address" value={form.address} required onChange={(e) => setForm({ ...form, address: (e.target as HTMLInputElement).value })} />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input id="city" value={form.city} required onChange={(e) => setForm({ ...form, city: (e.target as HTMLInputElement).value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State *</Label>
                <select id="state" className="w-full rounded border p-2" required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })}>
                  {indianStates.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label htmlFor="budget">Budget *</Label>
                <Input id="budget" value={form.budget} required onChange={(e) => setForm({ ...form, budget: (e.target as HTMLInputElement).value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deadline">Deadline *</Label>
                <Input id="deadline" type="date" required value={form.deadline} onChange={(e) => setForm({ ...form, deadline: (e.target as HTMLInputElement).value })} />
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
  // filter state
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterContractor, setFilterContractor] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProgressMin, setFilterProgressMin] = useState<number | null>(null);
  const [filterProgressMax, setFilterProgressMax] = useState<number | null>(null);
  const [filterDeadlineRange, setFilterDeadlineRange] = useState<string>('all');
  const [contractors, setContractors] = useState<string[]>([]);
  const router = useRouter();
  const [openProject, setOpenProject] = useState<Project | null>(null);

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
            status: (d.status || 'on_track').toString().replace('_', '-'),
            budget: d.budget ?? 'TBD',
            // ensure deadline is a date string
            deadline: d.deadline ?? (d.due_date ?? new Date().toISOString().slice(0, 10)),
            // normalize reports -> always array when possible
            reports: Array.isArray(d.reports)
              ? d.reports
              : d.reports
                ? [d.reports]
                : d.file_url
                  ? [d.file_url]
                  : [],
            created_by: d.created_by ?? d.created_by_name ?? d.owner ?? '',
            // recent image fallback
            recent_image: d.recent_image ?? d.recentImage ?? d.recent_image_url ?? d.image_url ?? (d.file_url ?? undefined),
            // map cameras if backend provides them; fall back to empty array
            cameras: Array.isArray(d.cameras) ? d.cameras.map((c: any) => ({ id: String(c.id ?? c.camera_id ?? c.name), name: c.name ?? c.label ?? String(c.id), thumbnail: c.thumbnail ?? c.thumb ?? undefined })) : [],
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

  // fetch contractors list from backend public endpoint
  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('http://localhost:8000/api/users/public-contractor/', { headers });
        if (!res.ok) throw new Error(`Failed to fetch contractors: ${res.status}`);
        const data = await res.json();
        // expect shape: { contractors: [ { username, ... }, ... ] }
        const names: string[] = Array.isArray(data?.contractors)
          ? data.contractors.map((c: any) => c.username).filter(Boolean)
          : [];
        setContractors(Array.from(new Set(names)));
      } catch (err) {
        console.error('Error fetching contractors', err);
        setContractors([]);
      }
    };

    fetchContractors();
  }, []);

  // contractors for select/filter come from backend; fallback to names derived from projects if empty
  const contractorOptions = contractors.length > 0 ? contractors : Array.from(new Set(projects.map(p => p.contractor).filter(Boolean)));

  const displayedProjects = projects.filter(p => {
    // contractor filter
    if (filterContractor !== 'all' && p.contractor !== filterContractor) return false;

    // status filter (normalize both on-track and on_track)
    if (filterStatus !== 'all') {
      const normalized = p.status?.toString().replace('_', '-');
      if (normalized !== filterStatus) return false;
    }

    // progress range filter
    if (filterProgressMin !== null && p.progress < filterProgressMin) return false;
    if (filterProgressMax !== null && p.progress > filterProgressMax) return false;

    // deadline date range filter
    if (filterDeadlineRange !== 'all') {
      const deadline = p.deadline ? new Date(p.deadline) : null;
      if (!deadline) return false;
      const now = new Date();
      let cutoff = new Date();
      if (filterDeadlineRange === '7d') cutoff.setDate(now.getDate() + 7);
      else if (filterDeadlineRange === '30d') cutoff.setDate(now.getDate() + 30);
      else if (filterDeadlineRange === '90d') cutoff.setDate(now.getDate() + 90);
      if (deadline > cutoff) return false; // deadline is beyond cutoff -> exclude
    }

    return true;
  });


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
        reports: Array.isArray(created.reports)
          ? created.reports
          : created.reports
            ? [created.reports]
            : created.file_url
              ? [created.file_url]
              : (Array.isArray(newProject.reports) ? newProject.reports : (newProject.reports ? [newProject.reports] : [])),
        created_by: created.created_by ?? created.created_by_name ?? '',
        recent_image: created.recent_image ?? created.recent_image_url ?? created.image_url ?? created.file_url ?? (Array.isArray(newProject.reports) ? newProject.reports[0] : undefined),
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
          contractors={contractorOptions}
        />
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Projects</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive overview of all construction projects</p>
            </div>

            <div className="flex items-center space-x-3 relative">
              <div className="relative">
                <Button variant="outline" className="gap-2" onClick={() => setFilterOpen((s) => !s)}>
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>

                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border rounded shadow-lg p-4 z-20">
                    <div className="space-y-3">
                      <div>
                        <Label>Contractor</Label>
                        <select className="w-full rounded border p-2" value={filterContractor} onChange={(e) => setFilterContractor(e.target.value)}>
                          <option value="all">All Contractors</option>
                          {contractorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      <div>
                        <Label>Status</Label>
                        <select className="w-full rounded border p-2" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                          <option value="all">All Statuses</option>
                          <option value="on-track">On Track</option>
                          <option value="delayed">Delayed</option>
                          <option value="completed">Completed</option>
                          <option value="on-hold">On Hold</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Progress Min</Label>
                          <Input type="number" min={0} max={100} value={filterProgressMin ?? ''} onChange={(e) => setFilterProgressMin(e.target.value === '' ? null : Number(e.target.value))} />
                        </div>
                        <div>
                          <Label>Progress Max</Label>
                          <Input type="number" min={0} max={100} value={filterProgressMax ?? ''} onChange={(e) => setFilterProgressMax(e.target.value === '' ? null : Number(e.target.value))} />
                        </div>
                      </div>

                      <div>
                        <Label>Deadline Range</Label>
                        <select className="w-full rounded border p-2" value={filterDeadlineRange} onChange={(e) => setFilterDeadlineRange(e.target.value)}>
                          <option value="all">Any Time</option>
                          <option value="7d">Next 7 days</option>
                          <option value="30d">Next 30 days</option>
                          <option value="90d">Next 90 days</option>
                        </select>
                      </div>

                      <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="ghost" onClick={() => {
                          setFilterContractor('all'); setFilterStatus('all'); setFilterProgressMin(null); setFilterProgressMax(null); setFilterDeadlineRange('all');
                        }}>Reset</Button>
                        <Button onClick={() => setFilterOpen(false)}>Apply</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button className="gap-2" onClick={() => setShowNewProject(true)}>
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {displayedProjects.map((project, index) => (
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
                        <Button variant="outline" size="sm"  onClick={() => router.push(`/contractors/${project.id}`)}>
                          View Details
                        </Button>
                        {/* <Button size="sm">Monitor</Button> */}
                      </div>
                    </div>

                    {((project.recent_image && project.recent_image !== '') || (project.reports && project.reports.length > 0)) && (
                      <div className="pt-2">
                        {(() => {
                          const reportUrl = project.recent_image && project.recent_image !== ''
                            ? project.recent_image
                            : (Array.isArray(project.reports) && project.reports.length > 0 ? project.reports[0] : undefined);
                          return reportUrl ? (
                            <a href={reportUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 dark:text-blue-400">View initial report</a>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
      {openProject && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-end">
          <div className="w-full lg:w-2/3 xl:w-3/5 h-full bg-white dark:bg-gray-900 overflow-auto p-6">
            <ProjectPageClient project={openProject} onClose={() => setOpenProject(null)} videoFeedBase="http://localhost:8000/video/video_feed" />
          </div>
        </div>
      )}
    </MainLayout>
  );
}