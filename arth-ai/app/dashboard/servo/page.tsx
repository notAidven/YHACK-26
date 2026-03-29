import type { Metadata } from 'next';
import ServoPage from '@/components/dashboard/ServoPage';

export const metadata: Metadata = { title: 'Servo Assist' };

export default function ServoDashboardPage() {
  return (
    <div className="h-full max-w-xl mx-auto px-4 py-6 overflow-y-auto">
      <ServoPage />
    </div>
  );
}
