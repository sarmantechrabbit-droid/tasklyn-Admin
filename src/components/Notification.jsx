import React, { useEffect, useState } from "react";
import { fetchCustomers } from "../api/customer.api";
import {
  sendNotification,
  sendNotificationBySubcription,
} from "../api/notification.api";
import { Search, Bell, ChevronDown, MoreVertical } from "lucide-react";
import Logos from "../assets/Button.png";

export default function Notification() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");
  const [subscriptionType, setSubscriptionType] = useState(null);
  const [disabledIndexes, setDisabledIndexes] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ ADDED

  const toggleDisable = (index) => {
    setDisabledIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchCustomers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setSubscriptionType(null);
  };

  const handleNotificationSubmit = async () => {
    try {
      const payload = {
        userId: users.map((user) => user._id),
        title: notificationTitle,
        text: notificationDescription,
      };
      await sendNotification(payload);
      setNotificationTitle("");
      setNotificationDescription("");
      closeModal();
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleSubcriptionNotificationSubmit = async () => {
    try {
      const payload = {
        subscriptionType,
        title: notificationTitle,
        text: notificationDescription,
      };
      await sendNotificationBySubcription(payload);
      setNotificationTitle("");
      setNotificationDescription("");
      closeModal();
    } catch (error) {
      console.error("Error sending subscription notification:", error);
    }
  };

  // ✅ FILTER + SEARCH LOGIC (FIXED)
  const filteredUsers = users.filter((user) => {
    if (selectedFilter !== "all" && user.subscription !== selectedFilter) {
      return false;
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user._id?.toLowerCase().includes(search) ||
        user.subscription?.toLowerCase().includes(search)
      );
    }

    return true;
  });

  return (
    <main className="flex-1 p-6 overflow-y-auto bg-[#F8F8F8]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Notifications</h1>
          <p className="text-sm text-gray-500">
            Track your revenue and financial performance across all platforms
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Search size={18} />
          <Bell size={18} />
          <div className="flex items-center gap-2">
            <img
              src="https://i.pravatar.cc/40"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-sm">
              <p className="font-medium">Jacob Farrel</p>
              <p className="text-xs text-gray-500">jacobfarrel@gmail.com</p>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {["All", "Free", "Paid"].map((title, i) => (
          <div key={i} className="bg-white rounded-2xl p-5">
            <div className="p-4 bg-[#F8F8F8] rounded-[12px]">
              <div className="flex justify-between items-center mb-4">
                <p className="font-medium">{title}</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-5 rounded-full relative cursor-pointer ${
                      disabledIndexes.includes(i)
                        ? "bg-black"
                        : "bg-emerald-600"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDisable(i);
                    }}
                  >
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-0.5" />
                  </div>
                  <MoreVertical size={16} />
                </div>
              </div>

              <div className="bg-white rounded-[12px] pt-[12px] pb-[8px] pl-[16px]">
                <p className="text-[#141414] font-medium text-[16px]">
                  Customer
                </p>
                <p className="text-[#141414] text-[24px] font-semibold">+330</p>
              </div>

              <button
                disabled={disabledIndexes.includes(i)}
                onClick={() => {
                  if (disabledIndexes.includes(i)) return;
                  setSubscriptionType(title.toLowerCase());
                  openModal();
                }}
                className={`mt-4 w-full py-2 rounded-[8px] text-sm ${
                  disabledIndexes.includes(i)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#187D4F] text-white"
                }`}
              >
                Notifications Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB]">
        <div className="flex items-center justify-between px-5 py-4">
          <h2 className="font-semibold">Customer List</h2>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-2 border border-[#F0F0F0] rounded-lg text-sm">
              <Search size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="w-[186px] outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="px-3 py-2 border border-[#F0F0F0] rounded-lg text-sm outline-none"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>

        <div className="m-2.5 border rounded-xl border-[#F0F0F0] px-4 py-3">
          <table className="w-full text-sm">
            <thead className="border-b border-[#F0F0F0]">
              <tr>
                <th className="px-5 py-3 text-left">Customer ID</th>
                <th className="px-5 py-3 text-left">Date</th>
                <th className="px-5 py-3 text-left">Customer Name</th>
                <th className="px-5 py-3 text-left">Contact</th>
                <th className="px-5 py-3 text-left">Subscription</th>
                <th className="px-5 py-3 text-left">Subscription Day</th>
                <th className="px-5 py-3 text-right"></th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-5 py-4 border-b border-[#F0F0F0]">{user._id}</td>
                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatar || "https://i.pravatar.cc/32"}
                          className="w-6 h-6 rounded-full"
                        />
                        {user.name}
                      </div>
                    </td>
                    <td className="px-5 py-4 border-b border-[#F0F0F0]">{user.email}</td>
                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      <span className="px-3 py-1 rounded-full text-xs bg-[#F2F4F7]">
                        {user.subscription}
                      </span>
                    </td>
                    <td className="px-5 py-4 border-b border-[#F0F0F0]">Free</td>
                    <td className="px-5 py-4 border-b border-[#F0F0F0] text-right">
                      <button className="bg-[#187D4F] p-2 rounded-lg">
                        <img
                          src={Logos}
                          onClick={openModal}
                          className="w-[30px]"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between px-5 py-4 text-sm text-[#6B7280]">
          <span>{filteredUsers.length} Entries</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <div className="bg-white p-6 rounded-lg w-[756px] relative">
            <button onClick={closeModal} className="absolute top-4 right-4 p-2">
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Notifications</h2>

            <label className="block text-sm font-medium mb-2">
              Notifications Title
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-4"
              value={notificationTitle}
              onChange={(e) => setNotificationTitle(e.target.value)}
            />

            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              className="w-full p-2 border rounded-lg mb-4"
              value={notificationDescription}
              onChange={(e) =>
                setNotificationDescription(e.target.value)
              }
            />

            <button
              onClick={() =>
                subscriptionType
                  ? handleSubcriptionNotificationSubmit()
                  : handleNotificationSubmit()
              }
              className="w-full bg-[#187D4F] text-white py-2 rounded-lg"
            >
              Notifications Message
            </button>
            
          </div>
          
        </div>
      )}
    </main>
  );
}
