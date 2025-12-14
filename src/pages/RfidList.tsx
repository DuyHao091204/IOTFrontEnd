import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type RfidOrder = {
  id: number;
  supplier: string;
  createdAt: string;
  totalItems: number;
  totalScanned: number;
};

export default function RfidList() {
  const [orders, setOrders] = useState<RfidOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("${API_URL}/scanrfid")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        // Map từ dữ liệu backend → UI
        const mapped = data.map((po: any) => ({
          id: po.id,
          supplier: po.supplier?.name || "N/A",
          createdAt: po.createdAt,
          totalItems: po.items.reduce((sum: number, i: any) => sum + i.qty, 0),
          totalScanned: po.items.reduce(
            (sum: number, i: any) => sum + i.rfids.length,
            0
          ),
        }));
        const filtered = mapped.filter(
          (p: any) => p.totalScanned < p.totalItems
        );

        setOrders(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch scanrfid error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Đang tải danh sách...</div>;
  }

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">
        Đơn hàng chờ quét RFID
      </h2>

      <div className="bg-blue-900 p-6 rounded-xl shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-blue-800 text-left">
            <tr>
              <th className="p-3">Mã đơn</th>
              <th>Nhà cung cấp</th>
              <th>Ngày tạo</th>
              <th>Tiến độ RFID</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-b border-blue-700 hover:bg-blue-800 transition"
              >
                <td className="p-3 font-semibold">PO-{o.id}</td>
                <td>{o.supplier}</td>
                <td>{o.createdAt.replace("T", " ").split(".")[0]}</td>
                <td>
                  <span className="font-bold text-yellow-400">
                    {o.totalScanned}
                  </span>
                  /<span className="text-blue-200">{o.totalItems}</span>
                </td>

                <td className="text-center">
                  <Link
                    className="px-5 py-2 bg-gradient-to-r from-red-900 to-red-400 
                    hover:from-blue-500 hover:to-blue-300 !text-black rounded-lg 
                    font-semibold shadow-md"
                    to={`/scanrfid/${o.id}`}
                  >
                    Quét RFID
                  </Link>
                </td>
              </tr>
            ))}

            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-5 text-center text-gray-300 italic"
                >
                  Không có đơn đang chờ quét.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
