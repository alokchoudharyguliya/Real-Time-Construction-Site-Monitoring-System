'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/use-language';

export default function Reports() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const canUpload = user?.account_type === 'contractor';

  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [form, setForm] = useState({
    title: '',
    type: 'progress',
    date: new Date().toISOString().slice(0, 10),
    status: 'completed'
  });

  useEffect(() => {
    let mounted = true;
    const fetchReports = async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const token = localStorage.getItem('jwt_token');
        const headers: Record<string, string> = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const res = await fetch('http://127.0.0.1:8000/api/reports/', { headers });
        if (!mounted) return;
        if (!res.ok) throw new Error(`Failed to fetch reports ${res.status}`);
        const data = await res.json();
        const mapped = Array.isArray(data) ? data.map((d: any) => ({
          id: d.id,
          title: d.title,
          type: d.type,
          date: d.date,
          status: d.status,
          size: d.size ?? (d.file_size ? `${d.file_size} KB` : ''),
          filepath: d.file_url || d.file || d.filepath || '#'
        })) : [];
        setReports(mapped);
      }
      catch (err: any) {
        console.error(err);
        setLoadError(err.message ?? 'Unknown error');
      }
      finally {
        if (mounted) setLoading(false);
      }
    };

    fetchReports();
    return () => { mounted = false; };
  }, []);

  const handleUpload = async () => {
    const fileInput = fileRef.current as HTMLInputElement | null;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
      setOpen(false);
      return;
    }
    const file = fileInput.files[0];

    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', form.title || file.name);
    fd.append('type', form.type);
    fd.append('date', form.date);
    fd.append('status', form.status);

    const blobUrl = URL.createObjectURL(file);
    const sizeMB = (file.size / (1024 * 1024));
    const sizeLabel = sizeMB < 1 ? `${Math.round(file.size / 1024)} KB` : `${sizeMB.toFixed(1)} MB`;

    const tempId = `temp-${Date.now()}`;
    const tempReport = {
      id: tempId,
      title: form.title || file.name,
      type: form.type,
      date: form.date,
      status: form.status,
      size: sizeLabel,
      filepath: blobUrl,
      uploading: true,
    };

    setReports((prev) => [tempReport, ...prev]);

    try {
      const token = localStorage.getItem('jwt_token');
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const res = await fetch('http://127.0.0.1:8000/api/reports/', {
        method: 'POST',
        headers,
        body: fd,
      });

      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

      const data = await res.json();
      const created = {
        id: data.id,
        title: data.title,
        type: data.type,
        date: data.date,
        status: data.status,
        size: data.size,
        filepath: data.file_url || data.file || blobUrl,
      };

      setReports((prev) => [created, ...prev.filter(r => r.id !== tempId)]);
    } catch (err) {
      setReports((prev) => prev.map(r => r.id === tempId ? { ...r, uploading: false, error: true } : r));
      console.error('Upload error', err);
    } finally {
      setForm({ title: '', type: 'progress', date: new Date().toISOString().slice(0, 10), status: 'completed' });
      if (fileInput) fileInput.value = '';
      setOpen(false);
    }
  };

  const displayedReports = reports.filter(r => {
    // type filter
    const typeOk = filterType === 'all' || (r.type || '').toString().toLowerCase() === filterType.toLowerCase();

    // date filter
    if (dateRange === 'all') {
      return typeOk;
    }

    const reportDate = r.date ? new Date(r.date) : null;
    if (!reportDate) return typeOk; // if no date, don't exclude based on date

    const now = new Date();
    let cutoff = new Date();
    if (dateRange === '7d') {
      cutoff.setDate(now.getDate() - 7);
    } else if (dateRange === '30d') {
      cutoff.setDate(now.getDate() - 30);
    } else if (dateRange === '90d') {
      cutoff.setDate(now.getDate() - 90);
    } else {
      // unknown range - fallback to include
      return typeOk;
    }

    const dateOk = reportDate >= cutoff;
    return typeOk && dateOk;
  });

  return (
    <MainLayout>
      {loading && <div className="text-sm text-gray-600">Loading reports...</div>}
      {loadError && <div className="text-sm text-red-600">Error loading reports: {loadError}</div>}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('reports')}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and download comprehensive construction reports</p>
          </div>

          {canUpload && (
            <>
              <Button className="gap-2" onClick={() => setOpen(true)}>
                <FileText className="h-4 w-4" />
                Upload Report
              </Button>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Report</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="file">Report File</Label>
                      <Input id="file" type="file" ref={fileRef} />
                    </div>

                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    </div>

                    <div>
                      <Label htmlFor="type">Type</Label>
                      <select id="type" className="block w-full rounded-md border p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                        <option value="progress">Progress</option>
                        <option value="safety">Safety</option>
                        <option value="quality">Quality</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <select id="status" className="block w-full rounded-md border p-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleUpload}>Upload</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={filterType} onValueChange={(v) => setFilterType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                  <SelectItem value="quality">Quality</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={(v) => setDateRange(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Custom Date
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {displayedReports.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">No reports found for this filter.</div>
              ) : (
                displayedReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{report.title}</h3>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{new Date(report.date).toLocaleDateString()}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-500">{report.size}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <a href={report.filepath} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm">{t('view')}</Button>
                      </a>
                      <a href={report.filepath} download={`${report.title}.pdf`}>
                        <Button variant="outline" size="sm"><Download className="h-4 w-4" /></Button>
                      </a>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </MainLayout>
  );
}