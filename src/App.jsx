import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Customer from "./components/Customer";
import Notification from "./components/Notification";
import HistoryNotification from "./components/HistoryNotification";
import Subscription from "./components/Subscription";
import EditPackageModal from "./components/EditPackageModal";
import CouponDashboard from "./components/CouponDashboard";
import CreateCouponModal from "./components/CreateCouponModal";
import Login from '../src/pages/Login'; 
import ProtectedRoute from './rooutes/ProtectedRoute';
import { useState } from "react";
import arrow from '../src/assets/arrow.png'

/* Dashboard Layout */
function DashboardLayout() {
   const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar onClose={() => setSidebarOpen(false)} />
      )}

      {/* Open Sidebar Arrow (when closed) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute left-2 top-6 z-50 bg-white border border-gray-200 rounded-full p-2 shadow-md hover:bg-gray-100 transition"
        >
          <img
            src={arrow}
            alt="Open Sidebar"
            className="h-6 w-6 rotate-180"
          />
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/customer" replace />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/history" element={<HistoryNotification />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/editplan" element={<EditPackageModal />} />
          <Route path="/coupon" element={<CouponDashboard />} />
          <Route path="/createcoupon" element={<CreateCouponModal />} />
        </Routes>
      </div>
    </div>
  );
}


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED DASHBOARD */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}