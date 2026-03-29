'use client';
import dynamic from 'next/dynamic';

// DashboardShell uses browser APIs (WebSocket, localStorage) — client only
const DashboardShell = dynamic(
  () => import('@/components/dashboard/DashboardShell'),
  { ssr: false }
);

export default function DashboardShellLoader({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
