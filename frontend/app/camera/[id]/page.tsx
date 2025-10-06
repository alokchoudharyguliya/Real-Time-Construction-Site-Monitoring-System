// 'use client'

// import { useParams } from 'next/navigation';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Progress } from '@/components/ui/progress';
// import { Button } from '@/components/ui/button';

// export function generateStaticParams() {
//   // List all possible project IDs here
//   return [
//     { id: '1' },
//     { id: '2' },
// (This page was commented out previously. Provide a minimal default export so Next treats this file as a module.)

export default function CameraPlaceholderPage() {
	return (
		<div className="max-w-5xl mx-auto py-8">
			<h2 className="text-xl font-semibold">Camera page (placeholder)</h2>
			<p className="text-sm text-gray-600">This route is currently a placeholder.</p>
		</div>
	);
}

// Provide a few example params for static export
export function generateStaticParams() {
	return [
		{ id: 'cam1' },
		{ id: 'cam2' },
		{ id: 'cam3' }
	];
}
//   deadline: '2024-06-15',
