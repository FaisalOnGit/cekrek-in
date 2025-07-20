import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsGrid from "../components/StatsGrid";
import ReportsChart from "../components/ReportsChart";
import AnalyticsChart from "../components/AnalyticsChart";
import RecentCustomers from "../components/RecentCustomers";
import TopTemplates from "../components/TopTemplates";

function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
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
        <main className="flex-1 p-6 space-y-6">
          <StatsGrid />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ReportsChart />
            <AnalyticsChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentCustomers />
            <TopTemplates />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
