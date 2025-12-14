import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";

type Stat = {
  revenue: number;
  orders: number;
};

type DashboardStats = {
  today: Stat;
  yesterday: Stat;
  lastWeek: Stat;
  lastMonth: Stat;
};

type TopProduct = {
  name: string;
  sold: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [pendingPO, setPendingPO] = useState<any[]>([]);

  useEffect(() => {
    // fetch doanh thu
    //fetch("${API_URL}/dashboard/stats")
    fetch("${API_URL}/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch(console.error);

    // fetch sản phẩm bán chạy
    fetch("${API_URL}/dashboard/top-products")
      .then((res) => res.json())
      .then((data) => setTopProducts(data))
      .catch(console.error);

    // fetch đơn chờ quét RFID
    fetch("${API_URL}/scanrfid")
      .then((res) => res.json())
      .then((data) => {
        // Lọc đúng chuẩn theo tiến độ RFID
        const pending = data.filter((po: any) =>
          po.items.some((item: any) => item.rfids.length < item.qty)
        );

        setPendingPO(pending);
      })
      .catch(console.error);
  }, []);

  const formatMoney = (v: number) => v.toLocaleString("vi-VN") + "đ";

  const countPending = pendingPO.length;

  return (
    <div className="flex flex-col flex-1 p-8 bg-[#f5f6fa] space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Tổng quan doanh thu</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-5">
        <StatCard
          title="Hôm nay"
          value={stats ? formatMoney(stats.today.revenue) : "0đ"}
          orders={stats ? `${stats.today.orders} đơn hàng` : "0 đơn hàng"}
        />
        <StatCard
          title="Hôm qua"
          value={stats ? formatMoney(stats.yesterday.revenue) : "0đ"}
          orders={stats ? `${stats.yesterday.orders} đơn hàng` : "0 đơn hàng"}
        />
        <StatCard
          title="Tuần trước"
          value={stats ? formatMoney(stats.lastWeek.revenue) : "0đ"}
          orders={stats ? `${stats.lastWeek.orders} đơn hàng` : "0 đơn hàng"}
        />
        <StatCard
          title="Tháng trước"
          value={stats ? formatMoney(stats.lastMonth.revenue) : "0đ"}
          orders={stats ? `${stats.lastMonth.orders} đơn hàng` : "0 đơn hàng"}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-5">
        <Link
          to="/sales/create"
          className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-1">Tạo Bill mới</h3>
          <p className="text-gray-500 text-sm">
            Tạo hóa đơn bán hàng nhanh chóng
          </p>
        </Link>

        <Link
          to="/scanrfid"
          className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-1">
            Đơn nhập đang chờ quét RFID
          </h3>

          <p className="text-gray-500 text-sm">
            {countPending > 0
              ? `Có ${countPending} đơn đang chờ quét`
              : "Không có đơn đang chờ quét"}
          </p>
        </Link>

        <Link
          to="/purchaseorders/add"
          className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer"
        >
          <h3 className="text-lg font-semibold mb-1">Tạo đơn nhập hàng</h3>
          <p className="text-gray-500 text-sm">
            Tạo đơn nhập hàng cho nhà cung cấp
          </p>
        </Link>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-blue-700">
          Sản phẩm bán chạy trong tháng
        </h2>

        {topProducts.length === 0 ? (
          <p className="text-gray-400 text-sm">Chưa có dữ liệu</p>
        ) : (
          <ul className="space-y-2">
            {topProducts.map((p, i) => (
              <li
                key={i}
                className="flex justify-between border-b py-2 text-sm text-gray-700"
              >
                <span>{p.name}</span>
                <span className="font-semibold">{p.sold} sản phẩm</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
