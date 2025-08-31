'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/use-language';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  stage: string;
  analysisResult?: {
    confidence: number;
    predictedStage: string;
    status: 'success' | 'error' | 'pending';
  };
}

const constructionStages = [
  { value: 'foundation', label: 'Foundation' },
  { value: 'superstructure', label: 'Superstructure' },
  { value: 'interiors', label: 'Interiors' },
  { value: 'finishing', label: 'Finishing' },
  { value: 'landscaping', label: 'Landscaping' }
];

export function ImageUpload() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { t } = useLanguage();

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: UploadedImage[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      stage: '',
    }));

    setImages(prev => [...prev, ...newImages]);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      // Clean up preview URLs
      const removed = prev.find(img => img.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.preview);
      }
      return updated;
    });
  };

  const updateImageStage = (id: string, stage: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, stage } : img
    ));
  };

  const analyzeImages = async () => {
    setIsAnalyzing(true);
    
    // Simulate ML analysis
    for (let i = 0; i < images.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setImages(prev => prev.map(img => {
        if (img.stage && !img.analysisResult) {
          const confidence = Math.random() * 0.3 + 0.7; // 70-100%
          const isCorrect = Math.random() > 0.2; // 80% accuracy
          
          return {
            ...img,
            analysisResult: {
              confidence: confidence * 100,
              predictedStage: isCorrect ? img.stage : constructionStages[Math.floor(Math.random() * constructionStages.length)].value,
              status: isCorrect ? 'success' : 'error'
            }
          };
        }
        return img;
      }));
    }
    
    setIsAnalyzing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ImageIcon className="h-5 w-5" />
          <span>{t('upload_images')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Drop images here or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Supports multiple images (PNG, JPG, JPEG)
            </p>
          </label>
        </div>

        {/* Image Grid */}
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Uploaded Images ({images.length})</h3>
                {images.some(img => img.stage) && (
                  <Button onClick={analyzeImages} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Images'
                    )}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="relative aspect-video">
                        <img
                          src={image.preview}
                          alt="Construction site"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(image.id)}
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        
                        {image.analysisResult && (
                          <div className="absolute bottom-2 left-2">
                            {image.analysisResult.status === 'success' ? (
                              <Badge className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {image.analysisResult.confidence.toFixed(0)}%
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Mismatch
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      <CardContent className="p-3 space-y-3">
                        <Select
                          value={image.stage}
                          onValueChange={(value) => updateImageStage(image.id, value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('select_stage')} />
                          </SelectTrigger>
                          <SelectContent>
                            {constructionStages.map(stage => (
                              <SelectItem key={stage.value} value={stage.value}>
                                {stage.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {image.analysisResult && (
                          <div className="text-xs space-y-1">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Predicted:</span>
                              <span className="font-medium capitalize">
                                {image.analysisResult.predictedStage}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Confidence:</span>
                              <span className="font-medium">
                                {image.analysisResult.confidence.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}