import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  FileText,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: ShoppingCart, label: "Orders", active: false },
    { icon: Users, label: "Customers", active: false },
    { icon: FileText, label: "Template", active: false },
  ];

  return (
    <div
      className={`${
        collapsed ? "w-20" : "w-64"
      } bg-[#452C7D] text-white flex flex-col transition-all duration-300 fixed h-full z-50`}
    >
      {/* Logo */}
      <div className="p-6  flex items-center justify-between">
        {!collapsed && (
          <>
            <h1
              style={{ fontFamily: '"Press Start 2P", monospace' }}
              className="text-lg tracking-wide"
            >
              CEKREK.IN
            </h1>
            <button
              onClick={onToggle}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </>
        )}

        {collapsed && (
          <div className="w-full flex justify-center">
            <button
              onClick={onToggle}
              className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer"
              title="Expand sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`flex items-center ${
              collapsed ? "justify-center px-2" : "space-x-3 px-4"
            } py-3 rounded-lg transition-all duration-200 group relative ${
              item.active
                ? "bg-white/20 text-white shadow-lg"
                : "text-purple-200 hover:bg-white/10 hover:text-white"
            }`}
            title={collapsed ? item.label : ""}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{item.label}</span>}

            {/* Tooltip for collapsed state */}
            {collapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </a>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <a
          href="#"
          className={`flex items-center ${
            collapsed ? "justify-center px-2" : "space-x-3 px-4"
          } py-3 rounded-lg text-purple-200 hover:bg-white/10 hover:text-white transition-all duration-200 group relative`}
          title={collapsed ? "Logout" : ""}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium">Logout</span>}

          {/* Tooltip for collapsed state */}
          {collapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Logout
            </div>
          )}
        </a>
      </div>
    </div>
  );
};

export default Sidebar;
