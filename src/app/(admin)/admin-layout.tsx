import { AdminSidebar, AdminHeader } from '@/components/admin-sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <AdminSidebar />
      <AdminHeader />
      <div className="lg:pl-64">
        <main className="max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}