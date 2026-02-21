import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <Sidebar />
      
      {/* Mobile Bottom Nav */}
      <MobileNav />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col">
        <TopBar />
        
        {/* Page Content Wraps here, pb-24 handles mobile nav space */}
        <main className="flex-1 p-6 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>
    </div>
  );
}
