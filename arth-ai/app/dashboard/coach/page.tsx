import type { Metadata } from 'next';
import CoachPanel from '@/components/dashboard/CoachPanel';

export const metadata: Metadata = { title: 'Therapy Coach' };

export default function CoachDashboardPage() {
  return (
    <div className="h-full max-w-xl mx-auto px-4 py-6 flex flex-col overflow-hidden">
      <CoachPanel />
    </div>
  );
}
