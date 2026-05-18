import { redirect } from 'next/navigation';

// Lab projects now live under /work/[slug] — redirect for any old links
export default function LabPage({ params }: { params: { slug: string } }) {
  redirect(`/work/${params.slug}`);
}
