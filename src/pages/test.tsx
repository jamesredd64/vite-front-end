import React from 'react';
import './test.css'; // Assuming a separate CSS file for styles

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="sidebar">
        <h3>TailAdmin</h3>
        <ul>
          <li>Dashboard</li>
          <li>eCommerce</li>
          <li>Analytics</li>
          <li>Marketing</li>
          <li>CRM</li>
          <li>Stocks</li>
          <li>SaaS</li>
          <li>Calendar</li>
          <li>User Profile</li>
          <li>Task</li>
          <li>Forms</li>
          <li>Tables</li>
          <li>Pages</li>
        </ul>
      </div>

      <div className="main-content">
        <div className="header">
          <h2>Dashboard</h2>
          <div className="user-info">
            <span>Musharof</span>
          </div>
        </div>

        <div className="stats">
          <div className="stat-card">
            <h4>Avg. Client Rating</h4>
            <p>7.8/10</p>
          </div>
          <div className="stat-card">
            <h4>Instagram Followers</h4>
            <p>5,934 <span>(-3.59% vs last month)</span></p>
          </div>
          <div className="stat-card">
            <h4>Total Revenue</h4>
            <p>$9,758 <span>(+15% vs last month)</span></p>
          </div>
        </div>

        <div className="traffic-chart">
          <h3>Impression & Data Traffic</h3>
          <p>Jun 1, 2024 - Dec 1, 2025</p>
          {/* Placeholder for chart component */}
          <div className="chart-placeholder">
            <p>[Chart Placeholder]</p>
          </div>
        </div>

        <div className="traffic-stats">
          <h3>Traffic Stats</h3>
          <div className="traffic-stat">
            <h4>New Subscribers</h4>
            <p>567K <span>(+3.85% vs last week)</span></p>
          </div>
          <div className="traffic-stat">
            <h4>Conversion Rate</h4>
            <p>276K <span>(-5.39% vs last week)</span></p>
          </div>
          <div className="traffic-stat">
            <h4>Page Bounce Rate</h4>
            <p>285 <span>(+12.74% vs last week)</span></p>
          </div>
        </div>

        <div className="featured-campaigns">
          <h3>Featured Campaigns</h3>
          <div className="campaign">
            <span>Creator</span> - Campaign Name
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;