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

/* Dashboard Layout */
function DashboardLayout() {
  return (
    <div className="flex w-full">
      <Sidebar />

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