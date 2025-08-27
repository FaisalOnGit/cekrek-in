import Layout from "../../layout/Layout";
import StatsGrid from "../../components/StatsGrid";
import ReportsChart from "../../components/ReportsChart";
import AnalyticsChart from "../../components/AnalyticsChart";
import RecentCustomers from "../../components/RecentCustomers";
import TopTemplates from "../../components/TopTemplates";

function DashboardPage() {
  return (
    <Layout>
      <StatsGrid />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportsChart />
        <AnalyticsChart />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCustomers />
        <TopTemplates />
      </div>
    </Layout>
  );
}

export default DashboardPage;
