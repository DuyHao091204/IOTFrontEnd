import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ChevronDown,
  Package,
  Truck,
  LayoutDashboard,
  Users,
  Settings,
  Radio,
  History,
  //Receipt,
  ShoppingCart,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  // Mở / đóng nhóm Nhập kho
  const [openKho, setOpenKho] = useState(
    location.pathname.startsWith("/purchaseorders") ||
      location.pathname.startsWith("/suppliers")
  );

  // 🎨 Style chuẩn
  const baseItem =
    "block py-2.5 px-4 rounded-lg border border-black text-white transition-all";
  const activeStyle = "bg-blue-700 border-blue-400";
  const hoverStyle = "hover:bg-blue-800 hover:border-blue-500";

  return (
    <aside className="w-64 bg-blue-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 text-2xl font-bold">
        RFID <span className="text-blue-300">Admin</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-2">
        {/* Dashboard */}
        <Link
          to="/dashboard"
          className={`${baseItem} flex items-center gap-2 ${
            location.pathname === "/dashboard"
              ? activeStyle
              : "bg-black !text-white"
          } ${hoverStyle}`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        {/* Products */}
        <Link
          to="/products"
          className={`${baseItem} flex items-center gap-2 ${
            location.pathname.startsWith("/products")
              ? activeStyle
              : "bg-black !text-white"
          } ${hoverStyle}`}
        >
          <Package size={18} />
          Sản phẩm
        </Link>

        {/* Nhập kho */}
        <div>
          <button
            onClick={() => setOpenKho(!openKho)}
            className={`w-full flex justify-between items-center py-2.5 px-4 rounded-lg border border-black text-white transition-all ${
              openKho ? activeStyle : "bg-black"
            } ${hoverStyle}`}
          >
            <span className="flex items-center gap-2">
              <Truck size={18} /> Nhập kho
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform ${openKho ? "rotate-180" : ""}`}
            />
          </button>

          {openKho && (
            <div className="ml-6 mt-1 space-y-1">
              <Link
                to="/purchaseorders"
                className={`${baseItem} text-sm ${
                  location.pathname.startsWith("/purchaseorders")
                    ? activeStyle
                    : "bg-black !text-white"
                } ${hoverStyle}`}
              >
                Đơn nhập hàng
              </Link>

              <Link
                to="/suppliers"
                className={`${baseItem} text-sm ${
                  location.pathname.startsWith("/suppliers")
                    ? activeStyle
                    : "bg-black !text-white"
                } ${hoverStyle}`}
              >
                Nhà cung cấp
              </Link>
            </div>
          )}
        </div>

        {/* Scan RFID */}
        <Link
          to="/scanrfid"
          className={`${baseItem} flex items-center gap-2 ${
            location.pathname.startsWith("/scanrfid")
              ? activeStyle
              : "bg-black !text-white"
          } ${hoverStyle}`}
        >
          <Radio size={18} />
          Scan RFID
        </Link>

        {/* RFID Inventory */}
        <Link
          to="/rfid"
          className={`${baseItem} flex items-center gap-2 ${
            location.pathname.startsWith("/rfid")
              ? activeStyle
              : "bg-black !text-white"
          } ${hoverStyle}`}
        >
          <Radio size={18} />
          RFID
        </Link>

        {/* Lịch sử quét RFID */}
        <Link
          to="/rfid-history"
          className={`${baseItem} flex items-center gap-2 ${
            location.pathname.startsWith("/rfid-history")
              ? activeStyle
              : "bg-black !text-white"
          } ${hoverStyle}`}
        >
          <History size={18} />
          Lịch sử quét
        </Link>

        {/* ============================= */}
        {/* 💵 TẠO BILL BÁN HÀNG (SALE) */}
        {/* ============================= */}
        <Link
          to="/sales"
          className={`${baseItem} flex items-center gap-2 ${
            location.pathname.startsWith("/sales")
              ? activeStyle
              : "bg-black !text-white"
          } ${hoverStyle}`}
        >
          <ShoppingCart size={18} />
          Tạo Bill
        </Link>

        {/* Employees */}
        <Link
          to="/employees"
          className={`${baseItem} flex items-center gap-2 ${
            location.pathname.startsWith("/employees")
              ? activeStyle
              : "bg-black !text-white"
          } ${hoverStyle}`}
        >
          <Users size={18} />
          Nhân viên
        </Link>

        {/* Settings */}
        <Link
          to="/settings"
          className={`${baseItem} flex items-center gap-2 ${
            location.pathname.startsWith("/settings")
              ? activeStyle
              : "bg-black !text-white"
          } ${hoverStyle}`}
        >
          <Settings size={18} />
          Cài đặt
        </Link>
      </nav>

      <footer className="text-center text-xs text-blue-300 mb-3">
        © 2025 RFID Technologies
      </footer>
    </aside>
  );
}
