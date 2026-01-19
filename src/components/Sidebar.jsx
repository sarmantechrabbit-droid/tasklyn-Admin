import { NavLink, useNavigate } from "react-router-dom";
import charts from "../assets/chart-bar.png";
import chart from "../assets/chats.png";
import money from "../assets/money.png";
import user from "../assets/users-four.png";
import ticket from "../assets/ticket.png";
import { LogOut } from "lucide-react";
import arrow from "../assets/arrow.png";
import Logo from "../assets/Logo(1).png";

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const menu = [
    { icon: user, label: "Customer", path: "/customer" },
    { icon: chart, label: "Notification", path: "/notification" },
    { icon: charts, label: "History Notification", path: "/history" },
    { icon: money, label: "Subscription", path: "/subscription" },
    { icon: ticket, label: "Coupon", path: "/coupon" },
  ];

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="w-[260px] bg-white border-r border-[#E5E7EB] flex flex-col justify-between min-h-screen">
      {/* Top */}
      <div>
        {/* Logo / Close Sidebar */}
        <div
          onClick={onClose}
          className="flex items-center px-6 py-5 gap-3 cursor-pointer select-none"
        >
          <img src={Logo} alt="Logo" className="h-[50px] w-[50px]" />

          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              TeamSync
            </span>
            <span className="text-sm text-gray-500">
              TeamSync
            </span>
          </div>

          <img
            src={arrow}
            alt="Close Sidebar"
            className="h-6 w-6 ml-auto"
          />
        </div>

        {/* Menu */}
        <nav className="px-4 py-6 space-y-1 text-sm">
          {menu.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${
                  isActive
                    ? "bg-[#F3F4F6] text-[#111827] font-medium"
                    : "text-[#6B7280] hover:bg-[#F9FAFB]"
                }`
              }
            >
              <img src={item.icon} className="w-[18px] h-[18px]" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-4 py-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-sm border border-[#E5E7EB] rounded-xl py-2 text-[#374151] hover:bg-[#F9FAFB] transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
