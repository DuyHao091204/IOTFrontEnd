import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Loader2, Plus, Trash2, FileSpreadsheet, FileDown } from "lucide-react";
import * as XLSX from "xlsx";

// ----------------------
// 🔹 Kiểu dữ liệu
// ----------------------
type PurchaseOrderItem = {
  sku: string;
  name: string;
  qty: number; // Số lượng
  lineTotal: number; // Thành tiền (lô)
};

interface CreatePOForm {
  supplierId: string;
  note: string;
  items: PurchaseOrderItem[];
}

// ----------------------
// 🔹 Component chính
// ----------------------
export default function CreatePurchaseOrder() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [form, setForm] = useState<CreatePOForm>({
    supplierId: "",
    note: "",
    items: [{ sku: "", name: "", qty: 1, lineTotal: 0 }],
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🟢 Lấy danh sách nhà cung cấp
  useEffect(() => {
    api
      .get("/suppliers")
      .then((res) => setSuppliers(res.data))
      .catch(() => alert("Không thể tải danh sách nhà cung cấp"));
  }, []);

  // ➕ Thêm sản phẩm
  const handleAddItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { sku: "", name: "", qty: 1, lineTotal: 0 }],
    }));
  };

  // ❌ Xoá sản phẩm
  const handleRemoveItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // ✏️ Cập nhật dòng sản phẩm
  const handleItemChange = (
    index: number,
    field: keyof PurchaseOrderItem,
    value: any
  ) => {
    const updated = [...form.items];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, items: updated });
  };

  // 📥 Import Excel
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      const workbook = XLSX.read(data as string, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const importedItems = jsonData.map((row: any) => ({
        sku: row.sku || "",
        name: row.name || "",
        qty: Number(row.qty) || 1,
        lineTotal: Number(row.lineTotal) || 0,
      }));

      setForm((prev) => ({ ...prev, items: importedItems }));
    };
    reader.readAsBinaryString(file);
  };

  // 📤 Download template
  const handleDownloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      { sku: "SP001", name: "Tên sản phẩm", qty: 10, lineTotal: 250000 },
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "purchase_order_template.xlsx");
  };

  // 💰 Tổng giá trị
  const totalCost = form.items.reduce((sum, item) => sum + item.lineTotal, 0);

  // 🚀 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.supplierId) return alert("Vui lòng chọn nhà cung cấp!");
    if (!form.items.length) return alert("Phải có ít nhất 1 sản phẩm!");

    setLoading(true);

    try {
      await api.post("/purchaseorders", {
        supplierId: Number(form.supplierId),
        createdById: 1,
        note: form.note,
        items: form.items,
      });

      alert("✅ Tạo đơn nhập hàng thành công!");
      navigate("/purchaseorders");
    } catch (err) {
      console.error(err);
      alert("❌ Không thể tạo đơn nhập hàng!");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // 🧱 Giao diện
  // ----------------------
  return (
    <div className="min-h-screen bg-[#f6f8fb] flex flex-col flex-1 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow rounded-xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Tạo Đơn Nhập Hàng
          </h2>

          <button
            onClick={() => navigate("/purchaseorders")}
            type="button"
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            ← Quay lại
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
          {/* Nhà cung cấp */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Nhà cung cấp *</label>
              <select
                value={form.supplierId}
                onChange={(e) =>
                  setForm({ ...form, supplierId: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
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
              <label className="block text-sm mb-1">Ghi chú</label>
              <input
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Bảng sản phẩm */}
          <div>
            <label className="block text-sm mb-2">Danh sách sản phẩm</label>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded overflow-hidden">
                <thead className="bg-blue-800 text-white">
                  <tr>
                    <th className="px-3 py-2 w-32">SKU</th>
                    <th className="px-3 py-2 w-64">Tên sản phẩm</th>
                    <th className="px-3 py-2 w-20 text-center">SL</th>
                    <th className="px-3 py-2 w-32 text-center">
                      Thành tiền (lô)
                    </th>
                    <th className="px-3 py-2 w-32 text-center">
                      Giá nhập / 1 SP
                    </th>
                    <th className="px-3 py-2 w-32 text-center">
                      Giá bán đề xuất
                    </th>
                    <th className="px-3 py-2 w-16 text-center">Xóa</th>
                  </tr>
                </thead>

                <tbody>
                  {form.items.map((item, index) => {
                    const qty = Number(item.qty) || 1;
                    const unitPrice = item.lineTotal / qty;
                    const suggested = unitPrice * 1.2;

                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        {/* SKU */}
                        <td className="px-3 py-2">
                          <input
                            value={item.sku}
                            onChange={(e) =>
                              handleItemChange(index, "sku", e.target.value)
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>

                        {/* Name */}
                        <td className="px-3 py-2">
                          <input
                            value={item.name}
                            onChange={(e) =>
                              handleItemChange(index, "name", e.target.value)
                            }
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>

                        {/* SL */}
                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "qty",
                                Number(e.target.value)
                              )
                            }
                            className="w-16 border rounded px-2 py-1 text-center"
                          />
                        </td>

                        {/* Thành tiền */}
                        <td className="px-3 py-2 text-center">
                          <input
                            type="number"
                            value={item.lineTotal}
                            onChange={(e) =>
                              handleItemChange(
                                index,
                                "lineTotal",
                                Number(e.target.value)
                              )
                            }
                            className="w-24 border rounded px-2 py-1 text-center"
                          />
                        </td>

                        {/* NEW — Giá nhập / 1 SP */}
                        <td className="px-3 py-2 text-center font-medium text-blue-700">
                          {isFinite(unitPrice)
                            ? unitPrice.toLocaleString("vi-VN") + " ₫"
                            : "0 ₫"}
                        </td>

                        {/* NEW — Giá bán đề xuất */}
                        <td className="px-3 py-2 text-center font-semibold text-green-700">
                          {isFinite(suggested)
                            ? suggested.toLocaleString("vi-VN") + " ₫"
                            : "0 ₫"}
                        </td>

                        {/* Xóa */}
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-4 mt-4">
              <button
                type="button"
                onClick={handleAddItem}
                className="text-blue-600 font-medium flex items-center gap-1"
              >
                <Plus size={16} /> Thêm sản phẩm
              </button>

              <label className="text-green-600 font-medium flex items-center gap-2 cursor-pointer">
                <FileSpreadsheet size={16} />
                Import Excel
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleImportExcel}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Tải mẫu */}
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="text-gray-600 flex items-center gap-1"
          >
            <FileDown size={16} /> Tải mẫu Excel
          </button>

          {/* Tổng giá trị */}
          <div className="text-right text-blue-700 bg-blue-50 p-2 rounded-lg font-medium">
            Tổng giá trị đơn:{" "}
            <span className="text-lg">
              {totalCost.toLocaleString("vi-VN")} ₫
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-900"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={16} />
                Đang lưu...
              </span>
            ) : (
              "Thêm Đơn Nhập Hàng"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
