import React, { useEffect, useState } from "react";
import { fetchCustomers } from "../api/customer.api";
import {
  sendNotification,
  sendNotificationBySubcription,
} from "../api/notification.api";
import { Search, Bell, ChevronDown, MoreVertical } from "lucide-react";
import Logos from "../assets/Button.png";
import { Editor } from "@tinymce/tinymce-react";

export default function Notification() {
  const [users, setUsers] = useState([]);
  const [counts, setCoounts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");
  const [subscriptionType, setSubscriptionType] = useState(null);
  const [disabledIndexes, setDisabledIndexes] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ ADDED
  const [singleUserId, setSingleuserId] = useState(null);
  const [errors, setErrors] = useState({});

  const toggleDisable = (index) => {
    setDisabledIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

 const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!notificationTitle.trim()) {
      newErrors.title = "Notification title is required";
    } else if (notificationTitle.length > 150) {
      newErrors.title = "Notification title cannot exceed 150 characters";
    }

    // Remove HTML tags from TinyMCE content
    const plainTextDescription = notificationDescription
      ?.replace(/<[^>]*>/g, "")
      .trim();

    // Description validation
    if (!plainTextDescription) {
      newErrors.description = "Notification description is required";
    } else if (plainTextDescription.length > 500) {
      newErrors.description =
        "Notification description cannot exceed 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await fetchCustomers();
        console.log(data?.users);
        setUsers(data?.users);
        setCoounts(data.counts);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUsers();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
     setNotificationTitle("");
    setNotificationDescription("");
    setIsModalOpen(false);
    setSubscriptionType(null);
  };

  const handleNotificationSubmit = async () => {
    if (!validateForm()) return;
     setNotificationTitle("");
    setNotificationDescription("");
    try {
      const payload = {
        userId: singleUserId,
        title: notificationTitle,
        text: notificationDescription,
      };

      console.log(payload);

      await sendNotification(payload);
      setNotificationTitle("");
      setNotificationDescription("");
      closeModal();
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleSubcriptionNotificationSubmit = async () => {
    if (!validateForm()) return;
     setNotificationTitle("");
    setNotificationDescription("");
    try {
      const payload = {
        subscriptionType,
        title: notificationTitle,
        text: notificationDescription,
      };
      console.log(payload);
      await sendNotificationBySubcription(payload);
      setNotificationTitle("");
      setNotificationDescription("");
      closeModal();
    } catch (error) {
      console.error("Error sending subscription notification:", error);
      alert("User Not Exits!");
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

      <div className="flex justify-end">
        <button
          onClick={() => {
            openModal();
          }}
          className="bg-[#187D4F] text-white px-4 py-2 rounded-lg text-sm my-6"
        >
          Send Notification
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {["all", "free", "paid"].map((title, i) => (
          <div key={i} className="bg-white rounded-2xl p-5">
            <div className="p-4 bg-[#F8F8F8] rounded-[12px]">
              <div className="flex justify-between items-center mb-4">
                <p className="font-medium">{title} Customer</p>
              </div>

              <div className=" pt-[12px] pb-[8px] pl-[16px]">
                <p className="text-[#141414] text-[24px] font-semibold">
                  + {counts[title]}
                  {console.log(title)}
                </p>
              </div>
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
                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      {user._id}
                    </td>
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
                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      {user.email}
                    </td>
                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      <span className="px-3 py-1 rounded-full text-xs bg-[#F2F4F7]">
                        {user.subscription}
                      </span>
                    </td>
                    <td className="px-5 py-4 border-b border-[#F0F0F0]">
                      {user.subscription === "paid"
                        ? user.subscriptionDuration || "-"
                        : "Free"}
                    </td>

                    <td className="px-5 py-4 border-b border-[#F0F0F0] text-right">
                      <button className="bg-[#187D4F] p-2 rounded-lg">
                        <img
                          src={Logos}
                          onClick={() => {
                            openModal();
                            setSingleuserId(user._id);
                          }}
                          className="w-[30px] cursor-pointer"
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
            <button
              onClick={() => {
                closeModal();
                setSingleuserId(null);
              }}
              className="absolute top-4 right-4 p-2 cursor"
            >
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

            {errors.title && (
              <p className="text-red-500 text-xs mb-2">{errors.title}</p>
            )}

            <Editor
              apiKey="uq1bvbygm7unbpibelm9t86eba7uvjp7lqhcd7u6d9f4azy6"
              value={notificationDescription} // ✅ bind state
              onEditorChange={(content) => setNotificationDescription(content)} // ✅ update state
              init={{
                plugins: [
                  // Core editing features
                  "anchor",
                  "autolink",
                  "charmap",
                  "codesample",
                  "emoticons",
                  "link",
                  "lists",
                  "media",
                  "searchreplace",
                  "table",
                  "visualblocks",
                  "wordcount",
                  "checklist",
                  "mediaembed",
                  "casechange",
                  "formatpainter",
                  "pageembed",
                  "a11ychecker",
                  "tinymcespellchecker",
                  "permanentpen",
                  "powerpaste",
                  "advtable",
                  "advcode",
                  "advtemplate",
                  "ai",
                  "uploadcare",
                  "mentions",
                  "tinycomments",
                  "tableofcontents",
                  "footnotes",
                  "mergetags",
                  "autocorrect",
                  "typography",
                  "inlinecss",
                  "markdown",
                  "importword",
                  "exportword",
                  "exportpdf",
                ],
                toolbar:
                  "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography uploadcare | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                tinycomments_mode: "embedded",
                tinycomments_author: "Author name",
                mergetags_list: [
                  { value: "First.Name", title: "First Name" },
                  { value: "Email", title: "Email" },
                ],
                ai_request: (request, respondWith) =>
                  respondWith.string(() =>
                    Promise.reject("See docs to implement AI Assistant"),
                  ),
                uploadcare_public_key: "87fcfed8192486f487fa",
              }}
              initialValue="Welcome to TinyMCE!"
            />

            <label className="block text-sm font-medium mb-2">Send To</label>

            <div className="flex gap-3 mb-4">
              {["all", "free", "paid"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSubscriptionType(type)}
                  className={`px-4 py-2 rounded-lg text-sm border
        ${
          subscriptionType === type
            ? "bg-[#187D4F] text-white border-[#187D4F]"
            : "bg-white text-gray-700 border-gray-300"
        }
      `}
                >
                  {type.toUpperCase()}
                </button>
              ))}
            </div>

            {errors.description && (
              <p className="text-red-500 text-xs mt-2">{errors.description}</p>
            )}

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