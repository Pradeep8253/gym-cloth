import React from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import AdminClient from '@/components/admin/AdminClient';

export const metadata = {
  title: 'Admin Dashboard | VOLT ATHLETICS',
};

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return <AdminClient user={session.user} />;
}
