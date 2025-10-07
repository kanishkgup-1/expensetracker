import React from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";
import StatsCard from "../components/StatsCard";
import GraphCard from "../components/GraphCard";

const DashboardPage: React.FC = () => {
  return (
    <Layout>
      <Header title="Dashboard" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Expenses" value="$1,200" />
        <StatsCard title="Categories" value={5} />
        <StatsCard title="Monthly Budget" value="$2,000" />
        <StatsCard title="Remaining" value="$800" />
      </div>
      <GraphCard />
    </Layout>
  );
};

export default DashboardPage;
