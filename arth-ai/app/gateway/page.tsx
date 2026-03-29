import type { Metadata } from 'next';
import GatewayScreen from '@/components/gateway/GatewayScreen';

export const metadata: Metadata = { title: 'Arth AI — Select Input Method' };

export default function GatewayPage() {
  return <GatewayScreen />;
}
