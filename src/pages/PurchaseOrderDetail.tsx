import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft } from 'lucide-react';

export default function PurchaseOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    api
      .get(`/purchaseorders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => alert('Không thể tải thông tin đơn hàng'));
  }, [id]);

  if (!order)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-lg">
        Đang tải dữ liệu...
      </div>
    );

  const total =
    order.items?.reduce(
      (sum: number, i: any) => sum + Number(i.lineTotal || 0),
      0,
    ) || 0;

  return (
    <div className="flex flex-col flex-1 bg-[#eef1f8] min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-10 border border-gray-100">
        {/* 🔙 Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition shadow mb-6"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>

        {/* 🧾 Thông tin đơn nhập */}
        <div className="flex justify-between items-start mb-8 border-b pb-4">
          <div>
            <h2 className="text-3xl font-semibold text-blue-900 mb-3">
              Chi tiết đơn nhập #{order.id}
            </h2>
            <p className="text-gray-700 text-base">
              <b>Ngày tạo:</b>{' '}
              {new Date(order.createdAt).toLocaleDateString('vi-VN')}
            </p>
            <p className="text-gray-700 text-base">
              <b>Nhà cung cấp:</b> {order.supplier?.name || 'Không xác định'}
            </p>
            {order.note && (
              <p className="text-gray-700 text-base">
                <b>Ghi chú:</b> <i>{order.note}</i>
              </p>
            )}
          </div>

          <span
            className={`px-4 py-2 text-sm font-semibold rounded-xl uppercase tracking-wide ${
              order.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : order.status === 'received'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-700'
            }`}
          >
            {order.status}
          </span>
        </div>

        {/* 📦 Danh sách sản phẩm */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Danh sách sản phẩm
        </h3>
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full text-sm text-gray-800 border-collapse">
            <thead className="bg-blue-800 text-white text-base">
              <tr>
                <th className="px-5 py-3 text-left">SKU</th>
                <th className="px-5 py-3 text-left">Tên sản phẩm</th>
                <th className="px-5 py-3 text-center">Số lượng</th>
                <th className="px-5 py-3 text-center">Giá nhập (1 lô)</th>
                <th className="px-5 py-3 text-center">Giá / sản phẩm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {(order.items ?? []).map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-3">{item.sku}</td>
                  <td className="px-5 py-3">{item.name}</td>
                  <td className="px-5 py-3 text-center">{item.qty}</td>
                  <td className="px-5 py-3 text-center text-blue-700 font-medium">
                    {Number(item.lineTotal).toLocaleString('vi-VN')} ₫
                  </td>
                  <td className="px-5 py-3 text-center text-gray-800">
                    {item.qty > 0
                      ? `${(Number(item.lineTotal) / item.qty).toLocaleString(
                          'vi-VN',
                        )} ₫`
                      : '0 ₫'}
                  </td>
                </tr>
              ))}
              {(!order.items || order.items.length === 0) && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-400 italic"
                  >
                    Chưa có sản phẩm nào trong đơn này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 💰 Tổng cộng */}
        <div className="text-right mt-6 text-xl font-semibold text-blue-800">
          Tổng cộng:{' '}
          <span className="text-3xl font-bold text-blue-900">
            {total.toLocaleString('vi-VN')} ₫
          </span>
        </div>
      </div>
    </div>
  );
}
