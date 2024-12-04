import React from "react";
import { Outlet } from "react-router-dom";
import "./AdminLayout.css"; // Optional: for any additional styling
import Sidebar from "../Sidebar/Sidebar";
import MenuBar from "../MenuBar/MenuBar";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <MenuBar />
      <Sidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
