import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Receipt {
  id: number;
  totalQty: number;
  totalPrice: string;
  status: string;
  createdAt: string;
}

export default function SalePage() {
  const [sales, setSales] = useState<Receipt[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    const res = await axios.get("${API_URL}/sales");
    setSales(res.data);
  };

  const handleCreate = async () => {
    const res = await axios.post("${API_URL}/sales/create");
    navigate(`/sales/create/${res.data.id}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-5xl font-bold text-white mb-6">Hóa đơn</h1>

      <div className="bg-[#1e2a5a] text-white p-6 rounded-2xl shadow-xl">
        {/* Title + Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Danh sách hóa đơn</h2>

          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-black rounded-lg hover:bg-gray-800 transition text-white"
          >
            + Tạo bill mới
          </button>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl">
          <table className="w-full">
            <thead className="bg-[#2f3f8f] text-white">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">Tổng SL</th>
                <th className="p-3 text-left">Tổng tiền</th>
                <th className="p-3 text-left">Trạng thái</th>
                <th className="p-3 text-left">Ngày</th>
              </tr>
            </thead>

            <tbody>
              {sales.map((s, index) => (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/sales/${s.id}`)}
                  className="border-b border-[#2f3f8f] hover:bg-[#243268] cursor-pointer transition"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 text-green-400">{s.totalQty}</td>
                  <td className="p-3 text-yellow-300">{s.totalPrice}</td>
                  <td className="p-3">
                    {s.status === "DRAFT" ? (
                      <span className="text-yellow-300 font-semibold">
                        DRAFT
                      </span>
                    ) : (
                      <span className="text-green-300 font-semibold">
                        {s.status}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sales.length === 0 && (
          <div className="text-center text-gray-300 py-6">
            Chưa có hóa đơn nào.
          </div>
        )}
      </div>
    </div>
  );
}
