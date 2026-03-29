import type { Metadata } from 'next';
import DashboardShellLoader from './DashboardShellLoader';

export const metadata: Metadata = {
  title: { default: 'Dashboard · Arth AI', template: '%s · Dashboard · Arth AI' },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShellLoader>{children}</DashboardShellLoader>;
}
