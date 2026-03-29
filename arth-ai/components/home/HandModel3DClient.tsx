'use client';
import dynamic from 'next/dynamic';

const HandModel3D = dynamic(() => import('./HandModel3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-dim text-sm font-mono">
      Loading 3D model…
    </div>
  ),
});

export default function HandModel3DClient({ className }: { className?: string }) {
  return <HandModel3D className={className} />;
}
