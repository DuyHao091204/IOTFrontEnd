import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Rfid from "./pages/Rfid";
import RfidList from "./pages/RfidList";
import PurchaseOrders from "./pages/PurchaseOrders";
import Login from "./pages/Login";
import type { JSX } from "react";
import CreatePurchaseOrder from "./pages/CreatePurchaseOrder";
import Suppliers from "./pages/Supplier";
import AddSupplier from "./pages/AddSupplier";
import PurchaseOrderDetail from "./pages/PurchaseOrderDetail";
import EditPurchaseOrder from "./pages/EditPurchaseOrder";
import RfidScanPage from "./pages/RfidScanPage";
import SalePage from "./pages/SalePage";
import SaleDetailPage from "./pages/SaleDetailPage";
import SaleCreatePage from "./pages/SaleCreatePage";
import RfidHistoryPage from "./pages/RfidHistory";

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/*"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />

        {/* NHẬP KHO */}
        <Route path="purchaseorders" element={<PurchaseOrders />} />
        <Route path="purchaseorders/add" element={<CreatePurchaseOrder />} />
        <Route path="purchaseorders/:id" element={<PurchaseOrderDetail />} />
        <Route path="purchaseorders/:id/edit" element={<EditPurchaseOrder />} />

        {/* SCAN RFID (trang bạn muốn) */}
        <Route path="scanrfid" element={<RfidList />} />
        <Route path="scanrfid/:poId" element={<RfidScanPage />} />

        {/* DB RFID */}
        <Route path="rfid-database" element={<Rfid />} />
        <Route path="rfid-history" element={<RfidHistoryPage />} />

        <Route path="sales" element={<SalePage />} />
        <Route path="sales/create" element={<SaleCreatePage />} />
        <Route path="sales/create/:id" element={<SaleCreatePage />} />
        <Route path="sales/:id" element={<SaleDetailPage />} />

        {/* Nhân viên, cài đặt */}
        <Route path="suppliers" element={<Suppliers />} />
        <Route path="suppliers/add" element={<AddSupplier />} />
      </Route>
    </Routes>
  );
}
