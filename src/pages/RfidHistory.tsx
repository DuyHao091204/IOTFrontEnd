import { useEffect, useState } from "react";

type EventRow = {
  id: number;
  rfidUid: string;
  action: string;
  timestamp: string;
  rfid?: {
    product?: {
      name: string;
      sku: string;
    };
  };
};

export default function RfidHistoryPage() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [filtered, setFiltered] = useState<EventRow[]>([]);

  const [search, setSearch] = useState("");
  const [action, setAction] = useState("");
  const [date, setDate] = useState("");

  // ==========================================
  // Format Action đẹp
  // ==========================================
  function formatAction(raw: string) {
    if (raw.startsWith("STORE_PO_")) {
      const id = raw.replace("STORE_PO_", "");
      return `Nhập kho (PO-${id})`;
    }

    if (raw.startsWith("SELL_RECEIPT_")) {
      const receiptId = raw.replace("SELL_RECEIPT_", "");
      return `Bán hàng (Bill #${receiptId})`;
    }

    switch (raw) {
      case "STORE":
        return "Nhập kho";
      case "SCAN":
        return "Quét RFID";
      case "CHECK":
        return "Kiểm tra";
      case "SELL":
        return "Bán hàng";
      default:
        return raw;
    }
  }

  // ==========================================
  // Badge màu hành động
  // ==========================================
  function actionColor(a: string) {
    if (a.startsWith("STORE") || a === "STORE")
      return "bg-green-500/20 text-green-300 border-green-300/30";
    if (a.startsWith("SELL") || a === "SELL")
      return "bg-red-500/20 text-red-300 border-red-300/30";
    if (a === "SCAN") return "bg-blue-500/20 text-blue-300 border-blue-300/30";
    if (a === "CHECK")
      return "bg-yellow-500/20 text-yellow-300 border-yellow-300/30";

    return "bg-gray-500/20 text-gray-300 border-gray-300/30";
  }

  // ==========================================
  // Load dữ liệu
  // ==========================================
  useEffect(() => {
    fetch("http://localhost:3000/rfid-events/history")
      .then((res) => res.json())
      .then((data) => {
        setRows(data ?? []);
        setFiltered(data ?? []);
      })
      .catch(console.error);
  }, []);

  // ==========================================
  // Filtering logic
  // ==========================================
  useEffect(() => {
    let data = rows;

    if (search.trim() !== "") {
      data = data.filter((e) =>
        e.rfidUid.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (action !== "") {
      data = data.filter((e) => e.action === action);
    }

    if (date !== "") {
      data = data.filter((e) => {
        const d = new Date(e.timestamp);

        // convert về local timezone (VN GMT+7)
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        const localDate = `${year}-${month}-${day}`; // yyyy-mm-dd chuẩn

        return localDate === date;
      });
    }

    setFiltered(data);
  }, [search, action, date, rows]);

  // ==========================================
  // Render UI
  // ==========================================
  return (
    <div className="p-6 w-full">
      <h1 className="text-4xl font-bold text-[#0F1A2C] mb-10">
        RFID Dashboard
      </h1>

      <h2 className="text-2xl font-bold text-[#0F1A2C] mb-4">
        Lịch sử quét RFID
      </h2>

      {/* FILTER BAR */}
      <div className="bg-white shadow-lg rounded-2xl p-4 mb-8 flex flex-wrap gap-4 border border-gray-200 text-black">
        <input
          type="text"
          placeholder="Tìm theo UID..."
          className="border rounded-lg px-3 py-2 w-60 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border rounded-lg px-3 py-2 w-40 shadow-sm "
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="">Tất cả hành động</option>
          <option value="SCAN">SCAN</option>
          <option value="STORE">STORE</option>
          <option value="SELL">SELL</option>
        </select>

        <input
          type="date"
          className="border rounded-lg px-3 py-2 shadow-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-[#123B8A] text-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#1E4DB7] text-white">
            <tr className="text-sm uppercase tracking-wide">
              <th className="p-4 border-b border-white/20">UID</th>
              <th className="p-4 border-b border-white/20">Sản phẩm</th>
              <th className="p-4 border-b border-white/20">Hành động</th>
              <th className="p-4 border-b border-white/20">Thời gian</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((e) => (
              <tr
                key={e.id}
                className="hover:bg-[#1E4DB7]/20 transition text-sm"
              >
                <td className="p-4 border-b border-white/10 font-mono">
                  {e.rfidUid}
                </td>

                <td className="p-4 border-b border-white/10">
                  {e.rfid?.product?.name
                    ? `${e.rfid.product.name} (${e.rfid.product.sku})`
                    : "Không có dữ liệu"}
                </td>

                <td className="p-4 border-b border-white/10">
                  <span
                    className={`px-3 py-1 text-xs border rounded-full ${actionColor(
                      e.action
                    )}`}
                  >
                    {formatAction(e.action)}
                  </span>
                </td>

                <td className="p-4 border-b border-white/10">
                  {new Date(e.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="p-6 text-center text-white/70 border-b border-white/10"
                >
                  Không có dữ liệu lịch sử phù hợp
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
