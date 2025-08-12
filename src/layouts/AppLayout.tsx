import { Outlet } from "react-router-dom";
import { useState } from "react";
import HeaderTop from "../components/HeaderTop";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
  const [open, setOpen] = useState(false);
  const handleMenuClick = () => {
    setOpen(!open);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <HeaderTop onMenuClick={handleMenuClick} />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-shrink-0 z-10">
          <Sidebar open={open} onClose={() => setOpen(false)} />
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
