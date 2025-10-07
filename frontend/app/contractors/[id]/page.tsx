import ContractorProfileClient from './ContractorProfileClient';

// Provide a small set of sample IDs for static export/build-time routing.
export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function ContractorProfilePage({ params }: { params: { id: string } }) {
  return <ContractorProfileClient id={params.id} />;
}
