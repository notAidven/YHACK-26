import type { Metadata } from 'next';
import HandMonitor from '@/components/dashboard/HandMonitor';

export const metadata: Metadata = { title: 'ROM Monitor' };

export default function MonitorPage() {
  return (
    <div className="h-full max-w-xl mx-auto px-4 py-6 overflow-y-auto">
      <HandMonitor />
    </div>
  );
}
