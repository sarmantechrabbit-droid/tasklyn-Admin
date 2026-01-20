import { NavLink, useNavigate } from "react-router-dom";
import charts from "../assets/chart-bar.png";
import chart from "../assets/chats.png";
import money from "../assets/money.png";
import user from "../assets/users-four.png";
import ticket from "../assets/ticket.png";
import { LogOut } from "lucide-react";
import arrow from "../assets/arrow.png";
import Logo from "../assets/Logo(1).png";
import { useState } from "react";

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { icon: user, label: "Customer", path: "/customer" },
    { icon: chart, label: "Notification", path: "/notification" },
    { icon: charts, label: "History Notification", path: "/history" },
    { icon: money, label: "Subscription", path: "/subscription" },
    { icon: ticket, label: "Coupon", path: "/coupon" },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside
      className={`flex flex-col justify-between min-h-screen border-r border-[#E5E7EB] bg-white transition-all
      ${collapsed ? "w-20" : "w-[260px]"}
      `}
    >
      {/* Top */}
      <div>
        {/* Logo / Collapse Toggle */}
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center px-4 py-4 gap-3 cursor-pointer select-none"
        >
          <img src={Logo} alt="Logo" className={`h-[50px] w-[50px] transition ${collapsed ? "hidden" : "block"}`} />
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">TeamSync</span>
              <span className="text-sm text-gray-500">TeamSync</span>
            </div>
          )}
          <img
            src={arrow}
            alt="Toggle Sidebar"
            className={`h-6 w-6 ml-auto transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </div>

        {/* Menu */}
        <nav className="px-2 py-6 space-y-1 text-sm">
          {menu.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition
                ${isActive
                  ? "bg-[#F3F4F6] text-[#111827] font-medium"
                  : "text-[#6B7280] hover:bg-[#F9FAFB]"
                }`
              }
            >
              <img src={item.icon} className="w-5 h-5" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-2 py-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-sm border border-[#E5E7EB] rounded-xl py-2 text-[#374151] hover:bg-[#F9FAFB] transition"
        >
          <LogOut size={16} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
}
