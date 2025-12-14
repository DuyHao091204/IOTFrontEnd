import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/suppliers');
      setSuppliers(res.data);
    } catch (err) {
      console.error('Không thể tải danh sách nhà cung cấp:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc muốn xoá nhà cung cấp này không?')) return;
    try {
      await api.delete(`/suppliers/${id}`);
      setSuppliers(suppliers.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Lỗi khi xoá:', err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Danh sách Nhà Cung Cấp
        </h2>
        <Link
          to="/suppliers/add"
          className="flex items-center gap-2 bg-black !text-white px-4 py-2 rounded-lg border border-gray-800 hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> Thêm mới
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      ) : suppliers.length === 0 ? (
        <p className="text-gray-500 italic">Chưa có nhà cung cấp nào.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Tên nhà cung cấp</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Số điện thoại</th>
                <th className="px-4 py-2">Địa chỉ</th>
                <th className="px-4 py-2">Ngày tạo</th>
                <th className="px-4 py-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {suppliers.map((s, idx) => (
                <tr key={s.id} className="hover:bg-blue-50">
                  <td className="px-4 py-2">{idx + 1}</td>
                  <td className="px-4 py-2 font-medium text-gray-800">
                    {s.name}
                  </td>
                  <td className="px-4 py-2">{s.email || '-'}</td>
                  <td className="px-4 py-2">{s.phone || '-'}</td>
                  <td className="px-4 py-2">{s.address || '-'}</td>
                  <td className="px-4 py-2">
                    {new Date(s.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="Sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Xoá"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
