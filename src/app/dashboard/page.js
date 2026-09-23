import React from 'react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from '@/components/dashboard/DashboardClient';

export const metadata = {
  title: 'My Account | VOLT ATHLETICS',
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return <DashboardClient user={session.user} />;
}
