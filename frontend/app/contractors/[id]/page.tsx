import ContractorProfileClient from './ContractorProfileClient';

// Provide a small set of sample IDs for static export/build-time routing.
export async function generateStaticParams() {
  // Try to fetch contractor list from backend at build time.
  try {
    const res = await fetch('http://localhost:8000/api/users/public-contractor/', { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch contractors: ${res.status}`);
    const json = await res.json();
    const list = Array.isArray(json.contractors) ? json.contractors : [];
    const params = list.slice(0, 50).map((c: any) => ({ id: String(c.id) }));
    if (params.length > 0) return params;
  } catch (err) {
    // fall through to default sample ids below
    console.warn('generateStaticParams fallback:', err);
  }

  // Fallback sample ids (keeps static export happy)
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function ContractorProfilePage({ params }: { params: { id: string } }) {
  return <ContractorProfileClient id={params.id} />;
}
