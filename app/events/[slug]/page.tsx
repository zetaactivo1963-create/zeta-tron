"use client";

import { redirect } from 'next/navigation';

export default function EventoPage({ params }: { params: { slug: string } }) {
  if (params.slug === 'zeta-grid-2') {
    redirect('/events/zeta-grid-2');
  }
  
  redirect('/');
}
