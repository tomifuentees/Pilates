import { redirect } from 'next/navigation';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // In production, check session here
  return <>{children}</>;
}