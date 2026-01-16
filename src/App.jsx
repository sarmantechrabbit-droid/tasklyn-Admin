import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Customer from "./components/Customer";
import Notification from "./components/Notification";
import HistoryNotification from "./components/HistoryNotification";
import Header from "./components/Header";
import Subscription from "./components/Subscription";

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex w-full">

        <Sidebar />

        <div className="flex-1">
          {/* <Header /> */}

          <Routes>
            {/* DEFAULT PAGE */}
            <Route path="/" element={<Navigate to="/customer" replace />} />

            <Route path="/customer" element={<Customer />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/history" element={<HistoryNotification />} />
            <Route path="/subscription" element={<Subscription /> } />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}
