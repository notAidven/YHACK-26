import type { Metadata } from 'next';
import ExerciseStation from '@/components/dashboard/ExerciseStation';

export const metadata: Metadata = { title: 'Exercises' };

export default function ExercisesPage() {
  return (
    <div className="h-full max-w-2xl mx-auto px-4 py-6 overflow-y-auto">
      <ExerciseStation />
    </div>
  );
}
