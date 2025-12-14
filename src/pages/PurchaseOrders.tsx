import { useEffect, useState } from 'react';
import { Plus, Eye, Loader2, Pencil, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

type PurchaseOrder = {
  id: number;
  code: string;
  supplier?: { name: string };
  createdAt: string;
  totalCost: string;
  status: string;
  createdBy?: { username: string };
};

export default function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🧭 Lấy danh sách đơn nhập hàng
  const fetchOrders = async () => {
    try {
      const res = await api.get('/purchaseorders');
      setOrders(res.data);
    } catch (err) {
      console.error('Lỗi khi tải danh sách đơn hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Xác nhận nhập kho
  const handleConfirm = async (id: number) => {
    if (!window.confirm('Xác nhận nhập kho cho đơn này?')) return;
    try {
      await api.put(`/purchaseorders/${id}/receive`);
      alert('✅ Đã xác nhận nhập kho và cập nhật sản phẩm');
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi xác nhận đơn nhập');
    }
  };

  // 🗑 Xóa đơn nhập hàng
  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn xóa đơn này không?')) return;
    try {
      await api.delete(`/purchaseorders/${id}`);
      alert('🗑 Đã xóa đơn nhập hàng');
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert('❌ Lỗi khi xóa đơn nhập hàng');
    }
  };

  return (
    <div className="flex flex-col flex-1 p-6 bg-[#f5f6fa]">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-800">Đơn nhập hàng</h2>
        <button
          onClick={() => navigate('/purchaseorders/add')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow"
        >
          <Plus size={18} /> Tạo đơn mới
        </button>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-500">
            <Loader2 className="animate-spin mr-2" size={18} />
            Đang tải dữ liệu...
          </div>
        ) : (
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-blue-800 text-white uppercase text-xs">
              <tr>
                <th className="px-4 py-2 font-semibold">#</th>
                <th className="px-4 py-2 font-semibold">Mã đơn</th>
                <th className="px-4 py-2 font-semibold">Nhà cung cấp</th>
                <th className="px-4 py-2 font-semibold">Ngày tạo</th>
                <th className="px-4 py-2 font-semibold">Tổng giá trị</th>
                <th className="px-4 py-2 font-semibold">Trạng thái</th>
                <th className="px-4 py-2 font-semibold">Người tạo</th>
                <th className="px-4 py-2 font-semibold text-center">
                  Hành động
                </th>
              </tr>
            </thead>

            <tbody className="bg-white text-gray-800">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-6 text-gray-400 italic"
                  >
                    Chưa có đơn nhập hàng nào
                  </td>
                </tr>
              ) : (
                orders.map((o, index) => (
                  <tr
                    key={o.id}
                    className="border-b border-gray-100 hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2 font-semibold text-blue-700">
                      {o.code || `PO-${o.id}`}
                    </td>
                    <td className="px-4 py-2">{o.supplier?.name || '—'}</td>
                    <td className="px-4 py-2">
                      {new Date(o.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-2 font-semibold text-gray-900">
                      {Number(o.totalCost).toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          o.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : o.status === 'received'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {o.createdBy?.username || '—'}
                    </td>

                    {/* 🔘 Hành động */}
                    <td className="flex justify-center gap-2 py-2">
                      <button
                        onClick={() => navigate(`/purchaseorders/${o.id}`)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => navigate(`/purchaseorders/${o.id}/edit`)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg"
                        title="Chỉnh sửa"
                      >
                        <Pencil size={16} />
                      </button>

                      {o.status === 'pending' && (
                        <button
                          onClick={() => handleConfirm(o.id)}
                          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg"
                          title="Xác nhận nhập kho"
                        >
                          <Check size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(o.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                        title="Xóa đơn"
                        disabled={o.status === 'received'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
