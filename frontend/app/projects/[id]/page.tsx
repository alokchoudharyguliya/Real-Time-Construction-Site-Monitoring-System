
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

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

export default function ProjectPage() {
  // const params = useParams();
  // Fetch project data using params.id if needed
  const router = useRouter();
  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{mockProject.name}</CardTitle>
          <div className="flex items-center space-x-2 mt-2">
            <Badge>{mockProject.status.replace('-', ' ')}</Badge>
            <span className="text-gray-600">{mockProject.location}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <span className="text-gray-600">Contractor</span>
              <div className="font-medium">{mockProject.contractor}</div>
            </div>
            <div>
              <span className="text-gray-600">Budget</span>
              <div className="font-medium">{mockProject.budget}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{mockProject.progress}%</span>
            </div>
            <Progress value={mockProject.progress} className="h-2" />
          </div>
          <div className="text-sm text-gray-600 mt-2">
            Deadline: {new Date(mockProject.deadline).toLocaleDateString()}
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
            {mockProject.stages.map((stage) => (
              <li key={stage.name} className="flex justify-between">
                <span>{stage.name}</span>
                <span className="text-gray-500">{new Date(stage.date).toLocaleDateString()}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockProject.cameras.map((cam) => (
              <Button key={cam.id} variant="outline" className="flex flex-col items-center p-4">
                <img src={cam.thumbnail} alt={cam.name} className="w-24 h-16 object-cover rounded mb-2" />
                <span className="font-medium">{cam.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Camera Footage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockProject.cameras.map((cam) => (
              <Button
                key={cam.id}
                variant="outline"
                className="flex flex-col items-center p-4"
                onClick={() => router.push(`/camera/${cam.id}`)}
              >
                <img src={cam.thumbnail} alt={cam.name} className="w-24 h-16 object-cover rounded mb-2" />
                <span className="font-medium">{cam.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}