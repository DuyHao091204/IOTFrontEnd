import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft } from 'lucide-react';

export default function AddSupplier() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/suppliers', form);
      alert('Thêm nhà thành công!');
      navigate('/suppliers');
    } catch (err) {
      console.error('Lỗi khi thêm:', err);
      alert('Thêm thất bại. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Thêm Nhà Cung Cấp
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={18} />
          Quay lại
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 space-y-5"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Tên nhà cung cấp <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 placeholder-gray-400 focus:ring focus:ring-blue-200 bg-white"
            placeholder="Nhập tên nhà cung cấp"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 focus:ring focus:ring-blue-200"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Số điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 focus:ring focus:ring-blue-200"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Địa chỉ
          </label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 focus:ring focus:ring-blue-200"
            placeholder="Nhập địa chỉ"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          {loading ? 'Đang thêm...' : 'Thêm Nhà Cung Cấp'}
        </button>
      </form>
    </div>
  );
}
