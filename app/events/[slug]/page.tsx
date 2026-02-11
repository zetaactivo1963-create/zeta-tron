import { redirect } from 'next/navigation';

export default async function EventoPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  if (slug === 'zeta-grid-2') {
    redirect('/eventos/zeta-grid-2');
  }
  
  redirect('/');
}
