import { SidebarProvider } from "@/components/layout/admin/SidebarContext";
import AdminSidebar from "@/components/layout/admin/AdminSidebar";
import AdminHeader from "@/components/layout/admin/AdminHeader";
import MainWrapper from "@/components/layout/admin/MainWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-950 overflow-hidden" dir="rtl">
        <AdminSidebar />
        <MainWrapper>
          <AdminHeader />
          {children}
        </MainWrapper>
      </div>
    </SidebarProvider>
  );
}
