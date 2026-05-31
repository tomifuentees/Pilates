import { redirect } from 'next/navigation';
import { ClientNav } from '@/components/client-nav';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In production, check session here and redirect if not authenticated
  return (
    <div className="min-h-screen pb-16">
      <main className="max-w-lg mx-auto">{children}</main>
      <ClientNav />
    </div>
  );
}