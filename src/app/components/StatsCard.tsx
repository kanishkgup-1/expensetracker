"use client";

import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold">{title}</h2>
      <p className="text-2xl mt-2">{value}</p>
    </div>
  );
};

export default StatsCard;
