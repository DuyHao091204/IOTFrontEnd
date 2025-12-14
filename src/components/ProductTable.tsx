import { useState } from "react";

type Product = {
  id: number;
  name: string;
  sku: string;
  sellPrice: number | string;
  stock: number | string;
  rfidcount: number | string;
};

export default function ProductTable({ products }: { products: Product[] }) {
  const [list] = useState(products);

  return (
    <div className="bg-[#2f3e74] text-white rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-semibold mb-3">Danh sách sản phẩm</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border border-blue-700 rounded-lg overflow-hidden">
          <thead className="bg-[#3f54a3] text-white uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-2 border-b border-blue-700">#</th>
              <th className="px-4 py-2 border-b border-blue-700">
                Tên sản phẩm
              </th>
              <th className="px-4 py-2 border-b border-blue-700">SKU</th>
              <th className="px-4 py-2 border-b border-blue-700">Giá bán</th>
              <th className="px-4 py-2 border-b border-blue-700">Số lượng</th>
              <th className="px-4 py-2 border-b border-blue-700">
                RFID Connected
              </th>
            </tr>
          </thead>

          <tbody>
            {list.map((p, idx) => (
              <tr key={p.id} className="hover:bg-[#5265b8] transition-colors">
                <td className="px-4 py-2 border-b border-blue-700 text-blue-100">
                  {idx + 1}
                </td>

                <td className="px-4 py-2 border-b border-blue-700 font-medium">
                  {p.name}
                </td>

                <td className="px-4 py-2 border-b border-blue-700 text-blue-200">
                  {p.sku}
                </td>

                <td className="px-4 py-2 border-b border-blue-700 text-yellow-300">
                  {Number(p.sellPrice).toLocaleString()}
                </td>

                <td className="px-4 py-2 border-b border-blue-700 text-green-300">
                  {Number(p.stock)}
                </td>

                <td className="px-4 py-2 border-b border-blue-700 text-gray-300">
                  {p.rfidcount}/{p.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
