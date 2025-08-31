'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Play,
  Pause,
  SkipBack,
  SkipForward 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface ThreeViewerProps {
  modelUrl?: string;
  title?: string;
}

export function ThreeViewer({ modelUrl, title = "3D Site Model" }: ThreeViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);

  useEffect(() => {
    if (!mountRef.current) return;

    // Simulate Three.js scene initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleReset = () => {
    // Reset camera position
    console.log('Resetting 3D view');
  };

  const handleZoomIn = () => {
    // Zoom in functionality
    console.log('Zooming in');
  };

  const handleZoomOut = () => {
    // Zoom out functionality
    console.log('Zooming out');
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>{title}</span>
            <Badge variant="outline" className="text-xs">
              WebGL Enabled
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 3D Viewer Container */}
        <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <div ref={mountRef} className="w-full h-full">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
                />
                <span className="ml-3 text-gray-600 dark:text-gray-400">
                  Loading 3D Model...
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-800 dark:to-gray-700">
                <div className="text-center space-y-4">
                  <motion.div
                    animate={{ 
                      rotateY: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 4,
                      ease: "easeInOut"
                    }}
                    className="w-24 h-24 bg-gradient-to-br from-blue-600 to-orange-500 rounded-xl mx-auto flex items-center justify-center"
                  >
                    <span className="text-white text-2xl font-bold">3D</span>
                  </motion.div>
                  <p className="text-gray-600 dark:text-gray-400">
                    3D Model Viewer
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Connect to backend for full 3D visualization
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Timeline */}
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Construction Timeline</span>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={togglePlayback}>
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <SkipBack className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <SkipForward className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <Slider
              value={progress}
              onValueChange={setProgress}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Foundation</span>
              <span>Superstructure</span>
              <span>Interiors</span>
              <span>Finishing</span>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">75%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-600">92%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Model Accuracy</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">3</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Stages Detected</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}