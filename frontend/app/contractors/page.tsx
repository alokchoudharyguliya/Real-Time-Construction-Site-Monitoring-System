'use client';

import { motion } from 'framer-motion';
import { Users, Plus, Search, Filter, Building2, Award, MapPin, Star } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Contractor = {
  id: string | number;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  license?: string;
  rating?: number;
  activeProjects?: string[];
  completedProjects?: string[];
  location?: string;
  avatar?: string;
};

const defaultAvatar = 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop';


export default function Contractors() {
  const [items, setItems] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [minActive, setMinActive] = useState<number | undefined>(undefined);
  const [maxActive, setMaxActive] = useState<number | undefined>(undefined);
  const [locationFilter, setLocationFilter] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    const fetchContractors = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/users/public-contractor/');
        if (!res.ok) throw new Error(`Failed to fetch contractors: ${res.status}`);
        const json = await res.json();
        // API returns { inspectors: [...] }
        const list = Array.isArray(json.contractors) ? json.contractors : [];
        // console.log(mapped);
        const mapped: Contractor[] = list.map((u: any) => ({
          id: u.id,
          name: u.name || u.username || u.email || `Contractor ${u.id}`,
          // contactPerson: u.first_name || u.last_name || undefined,
          email: u.email,
          phone: u.phone ?? undefined,
          license: u.licenseNo ?? u.license ?? undefined,
          rating: u.rating ?? undefined,
          // keep original array or count
          activeProjects: u.activeProjects ?? 0,
          completedProjects: u.completedProjects ?? 0,
          // numeric convenience field
          // @ts-ignore - attach extra searchable fields
          username: u.username ?? u.name ?? '',
          // @ts-ignore
          activeProjectsCount: Array.isArray(u.activeProjects) ? u.activeProjects.length : Number(u.activeProjects ?? 0),
          location: u.location ?? undefined,
          avatar: u.avatar_url ?? defaultAvatar,
        }));
        console.log(mapped);
        if (mounted) setItems(mapped);

      } catch (err: any) {
        console.error(err);
        if (mounted) setError(err.message ?? 'Unknown error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchContractors();
    return () => { mounted = false; };
  }, []);

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
              Contractors
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage and monitor contractor performance
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Contractor
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">23</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Contractors</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">4.7</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search contractors by name, username or active projects..."
                  className="pl-10"
                  value={query}
                  onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
                />
              </div>
              <Button variant="outline" className="gap-2" onClick={() => setShowFilters((s) => !s)}>
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter Panel */}
        {showFilters && (
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium">Minimum Rating</p>
                  <div className="flex items-center space-x-2 mt-2">
                    {[1,2,3,4,5].map((s) => (
                      <button key={s} className={`p-1 rounded ${minRating>=s ? 'bg-yellow-100 dark:bg-yellow-900' : ''}`} onClick={() => setMinRating(minRating===s?0:s)}>
                        <Star className="h-4 w-4 text-yellow-500" />
                      </button>
                    ))}
                    <span className="text-sm text-gray-600">{minRating > 0 ? `${minRating}+` : 'Any'}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Active Projects (min - max)</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Input type="number" placeholder="Min" value={minActive ?? ''} onChange={(e) => setMinActive(e.target.value ? Number((e.target as HTMLInputElement).value) : undefined)} className="w-24" />
                    <Input type="number" placeholder="Max" value={maxActive ?? ''} onChange={(e) => setMaxActive(e.target.value ? Number((e.target as HTMLInputElement).value) : undefined)} className="w-24" />
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Location</p>
                  <div className="mt-2">
                    <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="w-full border rounded px-3 py-2">
                      <option value="">Any</option>
                      {/* sample locations derived from items */}
                      {Array.from(new Set(items.map(i => i.location).filter(Boolean))).map((loc: any) => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contractors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items
            .filter((c) => {
              // text / query matching
              if (query) {
                const q = query.toLowerCase();
                const username = (c as any).username || '';
                const activeCount = Number((c as any).activeProjectsCount ?? c.activeProjects ?? 0);
                if (String(username).toLowerCase().includes(q)) return true;
                if (c.name?.toLowerCase().includes(q)) return true;
                // numeric match
                if (!Number.isNaN(Number(q)) && activeCount === Number(q)) return true;
                // substring match against activeProjectsCount
                if (String(activeCount).includes(q)) return true;
                // fallthrough — continue to other filters
              }

              // rating filter
              if (minRating && Number(c.rating ?? 0) < minRating) return false;

              // active projects count filter
              const activeCount = Number((c as any).activeProjectsCount ?? c.activeProjects ?? 0);
              if (minActive !== undefined && activeCount < minActive) return false;
              if (maxActive !== undefined && activeCount > maxActive) return false;

              // location filter
              if (locationFilter && String(c.location) !== locationFilter) return false;

              // if query existed and none of the text filters matched, filter out
              if (query) return false;
              return true;
            })
            .map((contractor, index) => (
            <motion.div
              key={contractor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={contractor.avatar} alt={contractor.contactPerson ?? contractor.name} />
                      <AvatarFallback>
                        {(contractor.contactPerson ?? contractor.name ?? '').charAt(0) || ''}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {contractor.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {/* {contractor.contactPerson} */}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Rating</p>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => {
                          const r = Math.round(Number(contractor.rating ?? 0));
                          return <Star key={i} className={`h-4 w-4 ${i < r ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />;
                        })}
                        <span className="text-sm text-gray-500">{contractor.rating ?? '—'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">License</p>
                      <p className="font-medium">{contractor.license}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Active</p>
                      <p className="font-medium text-blue-600">{contractor.activeProjects}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Completed</p>
                      <p className="font-medium text-green-600">{contractor.completedProjects}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    {contractor.location}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push(`/contractors/${contractor.id}`)}>
                      View Profile
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => router.push(`/chat?partner=${contractor.id}`)}>
                      Contact
                    </Button>
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