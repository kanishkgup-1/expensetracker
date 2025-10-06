"use client";
import React from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";

const CategoriesPage: React.FC = () => {
  return (
    <Layout>
      <Header title="Categories" />
      <p className="text-gray-700 mt-4">Categories page content goes here.</p>
    </Layout>
  );
};

export default CategoriesPage;
