import { SidebarProvider } from "@/components/layout/admin/SidebarContext";
import AdminSidebar from "@/components/layout/admin/AdminSidebar";
import MainWrapper from "@/components/layout/admin/MainWrapper";
import AdminHeaderContainer from "@/components/layout/admin/AdminHeaderContainer";

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
          <AdminHeaderContainer />
          {children}
        </MainWrapper>
      </div>
    </SidebarProvider>
  );
}
