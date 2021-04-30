import React from "react";
import Posts from "./questions/Questions";
import Navigation from "./Navigation";

const Dashboard = () => {
  return (
    <div>
      <Navigation />
      <Posts />
    </div>
  );
};

export default Dashboard;
