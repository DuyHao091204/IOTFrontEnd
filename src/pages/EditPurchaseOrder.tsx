import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';

type PurchaseOrderItem = {
  sku: string;
  name: string;
  qty: number;
  lineTotal: number; // tổng giá nhập cho 1 lô sản phẩm
};

type Supplier = {
  id: number;
  name: string;
};

export default function EditPurchaseOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [form, setForm] = useState({
    supplierId: '',
    note: '',
    items: [] as PurchaseOrderItem[],
  });

  // 🧭 Lấy dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [poRes, supplierRes] = await Promise.all([
          api.get(`/purchaseorders/${id}`),
          api.get('/suppliers'),
        ]);

        const po = poRes.data;
        setForm({
          supplierId: po.supplierId?.toString() || '',
          note: po.note || '',
          items:
            po.items?.map((i: any) => ({
              sku: i.sku,
              name: i.name,
              qty: i.qty,
              lineTotal: i.lineTotal ?? i.qty * i.unitCost, // fallback
            })) || [],
        });

        setSuppliers(supplierRes.data);
      } catch (err) {
        alert('Không thể tải dữ liệu đơn nhập hàng');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // 🧾 Hàm cập nhật field
  const handleItemChange = (index: number, key: string, value: any) => {
    const updated = [...form.items];
    (updated[index] as any)[key] = value;
    setForm({ ...form, items: updated });
  };

  // ➕ Thêm dòng
  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { sku: '', name: '', qty: 1, lineTotal: 0 }],
    });
  };

  // ❌ Xóa dòng
  const removeItem = (index: number) => {
    const updated = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updated });
  };

  // 💾 Lưu lại
  const handleSave = async () => {
    if (!form.items.length) return alert('Phải có ít nhất 1 sản phẩm');
    setSaving(true);
    try {
      await api.put(`/purchaseorders/${id}`, {
        ...form,
        items: form.items.map((i) => ({
          sku: i.sku,
          name: i.name,
          qty: Number(i.qty),
          lineTotal: Number(i.lineTotal),
          unitCost: i.qty > 0 ? Number(i.lineTotal) / Number(i.qty) : 0, // giá từng sản phẩm
        })),
      });
      alert('Cập nhật đơn nhập hàng thành công');
      navigate('/purchaseorders');
    } catch (err) {
      console.error(err);
      alert('Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        <Loader2 className="animate-spin mr-2" /> Đang tải dữ liệu...
      </div>
    );

  return (
    <div className="flex flex-col flex-1 bg-[#f6f8fb] min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold text-blue-800 mb-6">
          Chỉnh sửa đơn nhập hàng #{id}
        </h2>

        {/* Thông tin chung */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhà cung cấp
            </label>
            <select
              value={form.supplierId}
              onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
              className="w-full border border-gray-300 text-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Chọn nhà cung cấp --</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ghi chú
            </label>
            <input
              type="text"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 text-gray-700 focus:ring-blue-500"
              placeholder="VD: đơn nhập hàng tháng 11"
            />
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">SKU</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Tên sản phẩm
                </th>
                <th className="px-4 py-2 text-center font-semibold">
                  Số lượng
                </th>
                <th className="px-4 py-2 text-center font-semibold">
                  Giá nhập (1 lô)
                </th>
                <th className="px-4 py-2 text-center font-semibold">
                  Giá / sản phẩm
                </th>
                <th className="px-4 py-2 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {form.items.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item.sku}
                      onChange={(e) =>
                        handleItemChange(i, 'sku', e.target.value)
                      }
                      className="w-full border border-gray-300 rounded p-1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(i, 'name', e.target.value)
                      }
                      className="w-full border border-gray-300 rounded p-1"
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) =>
                        handleItemChange(i, 'qty', Number(e.target.value))
                      }
                      className="w-20 border border-gray-300 rounded p-1 text-center"
                      min={1}
                    />
                  </td>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="number"
                      value={item.lineTotal}
                      onChange={(e) =>
                        handleItemChange(i, 'lineTotal', Number(e.target.value))
                      }
                      className="w-28 border border-gray-300 rounded p-1 text-center"
                      min={0}
                    />
                  </td>
                  <td className="px-4 py-2 text-center text-blue-700 font-medium">
                    {item.qty > 0
                      ? `${(item.lineTotal / item.qty).toLocaleString('vi-VN')} ₫`
                      : '0 ₫'}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => removeItem(i)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Nút thêm sản phẩm */}
        <div className="mt-4">
          <button
            onClick={addItem}
            className="flex items-center gap-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow transition"
          >
            <Plus size={16} /> Thêm sản phẩm
          </button>
        </div>

        {/* Tổng cộng */}
        <div className="text-right text-lg font-semibold mt-6 text-blue-800">
          Tổng cộng:{' '}
          <span className="text-2xl">
            {form.items
              .reduce((sum, i) => sum + Number(i.lineTotal || 0), 0)
              .toLocaleString('vi-VN')}{' '}
            ₫
          </span>
        </div>

        {/* Nút lưu */}
        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg shadow transition font-medium"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Đang lưu...
              </>
            ) : (
              <>
                <Save size={16} /> Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
