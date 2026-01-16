import { Search, Bell, ChevronDown, Filter, MoreVertical } from "lucide-react";
import Header from "./Header";

export default function Notification() {
  return (
    <main className="flex-1 p-6 overflow-y-auto bg-[#F8F8F8]">
      {/* Header */}
           <Header
             title="Customer"
             subtitle="Manage and analyze your customer relationships"
           />
      {/* <div className="flex justify-between items-center mb-6">
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
      </div> */}

      {/* Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {["All", "Free", "Paid"].map((title, i) => (
          <div key={i} className="bg-white rounded-2xl p-5">
            <div className="p-4 bg-[#F8F8F8] rounded-[12px]">
              <div className="flex justify-between items-center mb-4">
                <p className="font-medium">{title}</p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-5 bg-emerald-600 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-0.5" />
                  </div>
                  <MoreVertical size={16} />
                </div>
              </div>
              <div className="bg-white rounded-[12px] pt-[12px] pb-[8px] pl-[16px]">
                <p className="text-[#141414] font-[Geist] text-[16px] font-medium leading-[24px]">
                  Customer
                </p>

                <p className="text-[#141414] font-[Geist] text-[24px] font-semibold leading-[32px] tracking-[-0.24px]">
                  +330
                </p>
              </div>
              <button className="mt-4 w-full bg-[#187D4F] text-white py-2 rounded-[8px] text-sm">
                Notifications Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border">
        <div className="flex justify-between items-center px-5 py-4">
          <h2 className="font-semibold">Customer List</h2>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-gray-500">
              <Search size={16} /> Search...
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              {[
                "Customer ID",
                "Date",
                "Customer Name",
                "Contact",
                "Subscription",
                "Subscription Day",
              ].map((h) => (
                <th key={h} className="px-5 py-3 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="px-5 py-4 border-b">CUST-0{i}</td>
                <td className="px-5 py-4 border-b">25-12-2025</td>
                <td className="px-5 py-4 border-b">
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://i.pravatar.cc/32?img=${i}`}
                      className="w-6 h-6 rounded-full"
                    />
                    Dennis Lau
                  </div>
                </td>
                <td className="px-5 py-4 border-b">dennislau@gmail.com</td>
                <td className="px-5 py-4 border-b">Free</td>
                <td className="px-5 py-4 border-b">Free</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center px-5 py-4 text-sm text-gray-500">
          <span>1 – 10 of 1,676 Entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded">Previous</button>
            <button className="px-3 py-1 border rounded">Next</button>
          </div>
        </div>
      </div>
    </main>
  );
}
