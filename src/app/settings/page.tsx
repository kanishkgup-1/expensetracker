import React from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";

const SettingsPage: React.FC = () => {
  return (
    <Layout>
      <Header title="Settings" />
      <p className="text-gray-700 mt-4">Settings page content goes here.</p>
    </Layout>
  );
};

export default SettingsPage;
