import { NavLink } from "react-router-dom";

export default function HeaderMain({
  onToggleSidebar,
}: {
  onToggleSidebar: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl w-full px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded border"
          >
            ☰
          </button>
          <NavLink to="/dashboard" className="font-bold text-blue-600">
            Dashboard
          </NavLink>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <NavLink
              to="/prompts"
              className={({ isActive }) =>
                isActive ? "text-blue-600" : "text-gray-600"
              }
            >
              Prompts
            </NavLink>
          </nav>
        </div>
        <div className="text-sm text-gray-600">
          
          <span>Hi!</span>
        </div>
      </div>
    </header>
  );
}
