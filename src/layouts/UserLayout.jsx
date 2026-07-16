import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function UserLayout({ children }) {
  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] font-sans text-[#0A192F]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default UserLayout;