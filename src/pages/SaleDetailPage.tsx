import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface ReceiptItem {
  id: number;
  qty: number;
  unitPrice: string;
  lineTotal: string;
  product: { id: number; name: string; sellPrice: string };
}

interface Receipt {
  id: number;
  status: string;
  totalQty: number;
  totalPrice: string;
  subtotal: string;
  discount: string;
  createdAt: string;
  items: ReceiptItem[];
}

export default function SaleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const loadDetail = async () => {
    const res = await axios.get(`http://localhost:3000/sales/${id}`);
    setReceipt(res.data);
  };

  useEffect(() => {
    loadDetail();
  }, []);

  if (!receipt) return <div className="p-10 text-lg">Đang tải...</div>;

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6 text-blue-700">
        Chi tiết hóa đơn <span className="text-blue-700">#{receipt.id}</span>
      </h1>

      {/* Header Info */}
      <div className="bg-white shadow-md rounded-xl p-6 flex justify-between items-center mb-8 text-black">
        <div>
          <p>
            <span className="font-medium">Trạng thái:</span>{" "}
            <span className="px-3 py-1 rounded-lg bg-green-100 text-green-700 font-semibold">
              {receipt.status}
            </span>
          </p>
          <p className="mt-2 font-medium">
            Ngày tạo: {new Date(receipt.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="text-right">
          <p className="font-medium">
            Tổng SL:{" "}
            <span className="font-bold text-blue-700">{receipt.totalQty}</span>
          </p>
          <p className="font-medium mt-2">
            Tổng tiền:{" "}
            <span className="font-bold text-blue-700">
              {Number(receipt.totalPrice).toLocaleString()} đ
            </span>
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl p-6">
        <table className="w-full">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-3 text-left">Sản phẩm</th>
              <th className="p-3 text-center">SL</th>
              <th className="p-3 text-right">Giá đơn</th>
              <th className="p-3 text-right">Thành tiền</th>
            </tr>
          </thead>

          <tbody>
            {receipt.items.map((it) => (
              <tr key={it.id} className="border-b">
                <td className="p-3 font-medium text-black">
                  {it.product.name}
                </td>
                <td className="p-3 text-center text-green-700 font-bold">
                  {it.qty}
                </td>
                <td className="p-3 text-right text-yellow-600 font-semibold">
                  {Number(it.unitPrice).toLocaleString()} đ
                </td>
                <td className="p-3 text-right font-bold text-blue-700">
                  {Number(it.lineTotal).toLocaleString()} đ
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tổng tiền */}
        <div className="text-right mt-6 text-lg text-black">
          <p>Tạm tính: {Number(receipt.subtotal).toLocaleString()} đ</p>
          <p>Giảm giá: -{Number(receipt.discount).toLocaleString()} đ</p>

          <p className="text-2xl font-bold mt-3">
            Thành tiền:{" "}
            <span className="text-blue-700">
              {Number(receipt.totalPrice).toLocaleString()} đ
            </span>
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate("/sales")}
        className="mt-8 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-900"
      >
        ← Quay lại
      </button>
    </div>
  );
}
