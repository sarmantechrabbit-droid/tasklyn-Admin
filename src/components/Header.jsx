import { useState } from "react";
import { Search, Bell, ChevronDown } from "lucide-react";
import profile from "../assets/Profile.png";

export default function Header({ title, subtitle }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="bg-[#F7F7F7]">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Title & Subtitle */}
        <div>
          <h1 className="text-[20px] font-semibold text-[#141414]">{title}</h1>
          <p className="text-[14px] text-[#6B7280]">{subtitle}</p>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {/* <div className="relative">
            <div
              className="bg-white p-3 rounded-[12px] border border-[#E5E7EB] cursor-pointer"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="w-5 h-5 text-[#6B7280]" />
            </div>
            {searchOpen && (
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="absolute top-12 right-0 w-60 px-3 py-2 border rounded-lg outline-none shadow-lg"
              />
            )}
          </div> */}

          {/* Notifications */}
          {/* <div className="relative">
            <div
              className="bg-white p-3 rounded-[12px] border border-[#E5E7EB] cursor-pointer"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Bell className="w-5 h-5 text-[#6B7280]" />
            </div>
            {notificationsOpen && (
              <div className="absolute top-12 right-0 w-72 bg-white border rounded-lg shadow-lg p-4">
                <p className="text-gray-500 text-sm">No new notifications</p>
              </div>
            )}
          </div> */}

          {/* Profile */}
          <div
            className="flex items-center gap-2 bg-white p-3 rounded-[12px] border border-[#E5E7EB] cursor-pointer relative"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <img src={profile} className="w-8 h-8 rounded-full" />
            <div className="text-sm leading-tight">
              <p className="font-medium text-[#141414]">Jacob Farrel</p>
              <p className="text-xs text-[#6B7280]">jacobfarrel@gmail.com</p>
            </div>
            <ChevronDown size={16} className="text-[#6B7280]" />

            {profileOpen && (
              <div className="absolute top-12 right-0 w-48 bg-white border rounded-lg shadow-lg p-4">
                <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded">
                  Profile
                </button>
                <button className="w-full text-left px-2 py-1 hover:bg-gray-100 rounded mt-1">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
