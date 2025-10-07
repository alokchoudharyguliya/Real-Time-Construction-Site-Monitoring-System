"use client";
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
// ...existing code...
const VIDEO_FEED_BASE = 'http://localhost:8000/video/video_feed';

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
const mockCamera = { id: 'cam1', name: 'Gate Camera', thumbnail: '/camera1.jpg' };
type Camera = { id: string; name: string; thumbnail?: string };
type Project = {
  id: string;
  name: string;
  contractor?: string;
  location?: string;
  progress?: number;
  status?: string;
  budget?: string;
  deadline?: string;
  stages?: { name: string; date: string }[];
  cameras?: Camera[];
};

export default function ProjectPageClient({ project, onClose, videoFeedBase }: { project?: Project; onClose?: () => void; videoFeedBase?: string }) {
  const videoRef = useRef<HTMLImageElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [selectedCam, setSelectedCam] = useState<Camera | null>(mockCamera);
  const p = project ?? mockProject;
  const feedBase = videoFeedBase ?? VIDEO_FEED_BASE;

  useEffect(() => {
    // Set up video element to display stream
    if (videoRef.current) {
      videoRef.current.src = feedBase;
    }
  }, [feedBase, selectedCam]);

  // When rendered as a modal (onClose provided), listen for outside clicks and Escape key
  useEffect(() => {
    if (!onClose) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // lock body scroll while modal is open
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // handle pointer/tap on backdrop
  const handleBackdropPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // close only if the user clicked/tapped directly on the backdrop (not on the inner content)
    if (e.target === backdropRef.current) {
      onClose && onClose();
    }
  };

  return (
    <MainLayout>
    <div className="max-w-4xl mx-auto space-y-6">
      {onClose ? (
        <div ref={backdropRef} onPointerDown={handleBackdropPointerDown} className="fixed inset-0 z-50 bg-white bg-opacity-100 flex items-start justify-center p-6 overflow-auto">
          <div ref={contentRef} className="max-w-5xl mx-auto py-8 space-y-8">
            <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h2 className="text-2xl font-semibold">{p.name}</h2>
        </div>
        <div className="text-sm text-gray-600">{p.location}</div>
      </div>
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{p.name}</CardTitle>
          <div className="flex items-center space-x-2 mt-2">
            <Badge>{String(p.status ?? '').replace('_', '-').replace('-', ' ')}</Badge>
            <span className="text-gray-600">{p.location}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-600">Contractor</span>
              <div className="font-medium">{p.contractor}</div>
            </div>
            <div>
              <span className="text-gray-600">Budget</span>
              <div className="font-medium">{p.budget}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{p.progress ?? 0}%</span>
            </div>
            <Progress value={Number(p.progress ?? 0)} className="h-2" />
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'TBD'}
          </div>
        </CardContent>
      </Card>

      {/* Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {(p.stages || []).map((stage) => (
              <li key={stage.name} className="flex justify-between">
                <span>{stage.name}</span>
                <span className="text-gray-500">{stage.date ? new Date(stage.date).toLocaleDateString() : ''}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Camera Footage Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Camera Footage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Video player area (shows when a camera selected) */}
            {selectedCam ? (
              <div className="bg-black rounded overflow-hidden">
                {/* <video className="w-full h-64" controls src={`${feedBase}`}>
                  Your browser does not support the video tag.
                </video> */}
                <img
                  ref={videoRef}
                  src={feedBase}
                  alt="Video Stream"
                  style={{ alignSelf: 'center',width:'100%' }}
                />
                <div className="p-2 text-sm text-white">Live feed: {selectedCam.name}</div>
              </div>
            ) : (
              <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500">
                No camera selected — select a camera below to view live footage
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(p.cameras && p.cameras.length > 0) ? p.cameras.map((cam) => (
                <button key={cam.id} className="flex flex-col items-center p-4 border rounded" onClick={() => setSelectedCam(mockCamera)}>
                  {cam.thumbnail ? (
                    <img src={cam.thumbnail} alt={cam.name} className="w-24 h-16 object-cover rounded mb-2" />
                  ) : (
                    <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 flex items-center justify-center text-gray-500">No Preview</div>
                  )}
                  <span className="font-medium">{cam.name}</span>
                </button>
              )) : (
                <div className="col-span-3 text-center text-sm text-gray-500">No cameras available for this project.</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto py-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-2xl font-semibold">{p.name}</h2>
            </div>
            <div className="text-sm text-gray-600">{p.location}</div>
          </div>
          {/* Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{p.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge>{String(p.status ?? '').replace('_', '-').replace('-', ' ')}</Badge>
                <span className="text-gray-600">{p.location}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                  <span className="text-gray-600">Contractor</span>
                  <div className="font-medium">{p.contractor}</div>
                </div>
                <div>
                  <span className="text-gray-600">Budget</span>
                  <div className="font-medium">{p.budget}</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{p.progress ?? 0}%</span>
                </div>
                <Progress value={Number(p.progress ?? 0)} className="h-2" />
              </div>
              <div className="text-sm text-gray-600 mt-2">
                Deadline: {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'TBD'}
              </div>
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {(p.stages || []).map((stage) => (
                  <li key={stage.name} className="flex justify-between">
                    <span>{stage.name}</span>
                    <span className="text-gray-500">{stage.date ? new Date(stage.date).toLocaleDateString() : ''}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Camera Footage Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Camera Footage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Video player area (shows when a camera selected) */}
                {selectedCam ? (
                  <div className="bg-black rounded overflow-hidden">
                    <img
                      ref={videoRef}
                      src={feedBase}
                      alt="Video Stream"
                      style={{ alignSelf: 'center', width: '100%' }}
                    />
                    <div className="p-2 text-sm text-white">Live feed: {selectedCam.name}</div>
                  </div>
                ) : (
                  <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-gray-500">
                    No camera selected — select a camera below to view live footage
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(p.cameras && p.cameras.length > 0) ? p.cameras.map((cam) => (
                    <button key={cam.id} className="flex flex-col items-center p-4 border rounded" onClick={() => setSelectedCam(mockCamera)}>
                      {cam.thumbnail ? (
                        <img src={cam.thumbnail} alt={cam.name} className="w-24 h-16 object-cover rounded mb-2" />
                      ) : (
                        <div className="w-24 h-16 bg-gray-200 dark:bg-gray-700 rounded mb-2 flex items-center justify-center text-gray-500">No Preview</div>
                      )}
                      <span className="font-medium">{cam.name}</span>
                    </button>
                  )) : (
                    <div className="col-span-3 text-center text-sm text-gray-500">No cameras available for this project.</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
    </MainLayout>
  );
}
