import { useState, ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <Header onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 space-y-6">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
