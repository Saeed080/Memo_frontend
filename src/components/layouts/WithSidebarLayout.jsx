// components/layouts/WithSidebarLayout.jsx
import React from "react";
import Sidebar from "../SideBar";

const WithSidebarLayout = ({ children }) => {
  return (
    <div className="h-screen flex ">
      {/* Sidebar always fixed */}
      <Sidebar />
      {/* Page content that changes with routing */}
      <div className="flex-1 mt-0 bg-gray-100  lg:my-5 lg:mr-8 lg:rounded-xl  overflow-y-hidden">
        {children}
      </div>
    </div>
  );
};

export default WithSidebarLayout;
