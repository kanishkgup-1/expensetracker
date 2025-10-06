"use client";
import React from "react";
import Layout from "../components/Layout";
import Header from "../components/Header";

const ExpensePage: React.FC = () => {
  return (
    <Layout>
      <Header title="Expense" />
      <p className="text-gray-700 mt-4">Expense page content goes here.</p>
    </Layout>
  );
};

export default ExpensePage;
