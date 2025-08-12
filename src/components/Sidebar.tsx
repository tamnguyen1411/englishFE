import React from "react";
import { NavLink } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  return (
    <>
      {/* overlay mobile */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          open ? "opacity-100 block" : "opacity-0 hidden"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed md:sticky top-0 md:top-[var(--hdr)] h-screen md:h-[calc(100vh-0px)] w-72 
                    bg-gradient-to-b from-white via-blue-50/30 to-purple-50/30 
                    border-r border-gray-200/60 backdrop-blur-sm z-50
                    transition-all duration-300 ease-in-out md:translate-x-0 shadow-xl md:shadow-none
                    ${open ? "translate-x-0" : "-translate-x-full"} md:block`}
      >
        {/* Header Space for Mobile */}
        <div className="h-14 md:hidden bg-gradient-to-r from-blue-600 to-purple-600" />

        {/* Sidebar Content */}
        <div className="p-6 h-full">
          {/* Logo/Brand Section */}
          <div className="mb-8 hidden md:block">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-bold text-gray-900">Learning Hub</h2>
                <p className="text-xs text-gray-500">English Platform</p>
              </div>
            </div>
          </div>

          {/* Menu Section */}
          <div className="mb-6">
            <div className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              MENU CHÍNH
            </div>
            <nav className="space-y-2">
              <NavLink
                to="/exercise"
                className={({ isActive }) =>
                  `group flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-[1.02]"
                      : "text-gray-700 hover:bg-white/80 hover:shadow-md hover:transform hover:scale-[1.01]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-white/20"
                          : "bg-orange-100 group-hover:bg-orange-200"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-orange-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <span
                      className={`${isActive ? "!text-white" : ""} font-medium`}
                    >
                      Bài học mới
                    </span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/prompts"
                className={({ isActive }) =>
                  `group flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-[1.02]"
                      : "text-gray-700 hover:bg-white/80 hover:shadow-md hover:transform hover:scale-[1.01]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-white/20"
                          : "bg-purple-100 group-hover:bg-purple-200"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-purple-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <span
                      className={`${isActive ? "!text-white" : ""} font-medium`}
                    >
                      Cộng đồng
                    </span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/ai-tool"
                className={({ isActive }) =>
                  `group flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-[1.02]"
                      : "text-gray-800 hover:bg-white/80 hover:shadow-md hover:transform hover:scale-[1.01]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-white/20"
                          : "bg-indigo-100 group-hover:bg-indigo-200"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-indigo-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                    <span
                      className={`${isActive ? "!text-white" : ""} font-medium`}
                    >
                      AI Tool
                    </span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `group flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-[1.02]"
                      : "text-gray-800 hover:bg-white/80 hover:shadow-md hover:transform hover:scale-[1.01]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-white/20"
                          : "bg-green-100 group-hover:bg-green-200"
                      }`}
                    >
                      <svg
                        className={`w-5 h-5 ${
                          isActive ? "text-white" : "text-green-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <span
                      className={`${isActive ? "!text-white" : ""} font-medium`}
                    >
                      Profile
                    </span>
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            </nav>
          </div>

          

          <div className="absolute bottom-20 left-6 right-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">AI Thông Minh</p>
                  <p className="text-xs text-white/80">
                    Nhiều tính năng hấp dẫn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
