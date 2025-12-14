import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import mqtt from "mqtt";

// Kết nối MQTT
const client = mqtt.connect(
  "wss://pee4ef34.ala.eu-central-1.emqxsl.com:8084/mqtt",
  {
    username: "admin",
    password: "123",
  }
);

type PoItem = {
  id: number;
  sku: string;
  name: string;
  qty: number;
  scanned: number;
  productId: number;
};

type PoDetail = {
  id: number;
  supplier: string;
  createdAt: string;
  items: PoItem[];
};

export default function RfidScanPage() {
  const { poId } = useParams();
  const [po, setPo] = useState<PoDetail | null>(null);

  const [loadingItemId, setLoadingItemId] = useState<number | null>(null);

  const [popup, setPopup] = useState<{ type: string; msg: string } | null>(
    null
  );

  // Hàm hiển thị popup 3 giây
  const showPopup = (type: string, msg: string) => {
    setPopup({ type, msg });
    setTimeout(() => setPopup(null), 3000);
  };

  // Load PO data
  const loadPo = () => {
    fetch(`http://localhost:3000/scanrfid/${poId}`)
      .then((res) => res.json())
      .then(setPo)
      .catch(console.error);
  };

  // Load PO khi vào trang
  useEffect(() => {
    if (poId) loadPo();
  }, [poId]);

  // Lắng nghe MQTT từ backend
  useEffect(() => {
    client.subscribe("rfid/store/result");

    client.on("message", (topic, message) => {
      if (topic === "rfid/store/result") {
        const data = JSON.parse(message.toString());

        if (data.finished) {
          showPopup("success", "Đã quét đủ số lượng!");
          setLoadingItemId(null);
          loadPo();
          return;
        }

        if (data.success) {
          showPopup("success", "🎉 Quét RFID thành công!");
          loadPo();

          const item = po?.items.find((i) => i.id === data.itemId);
          if (item && item.scanned + 1 >= item.qty) {
            showPopup("success", "🎉 Đã quét đủ số lượng!");
            setLoadingItemId(null);
          }
        } else {
          showPopup("error", data.reason || "❌ Thẻ RFID đã được sử dụng!");
        }
      }
    });
  }, []);

  // Bắt đầu quét RFID
  const handleScan = async (itemId: number) => {
    if (loadingItemId) return; // nếu đang scan thì không bấm lại

    setLoadingItemId(itemId);

    await fetch(`http://localhost:3000/scanrfid/${poId}/start/${itemId}`, {
      method: "POST",
    });
  };

  // Dừng quét RFID
  const handleStop = async () => {
    await fetch(`http://localhost:3000/scanrfid/${poId}/stop`, {
      method: "POST",
    });

    setLoadingItemId(null);
  };

  if (!po) return <div className="p-6 text-white">Đang tải...</div>;

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-2 text-blue-700">
        Quét RFID cho PO #{po.id}
      </h1>
      <p className="text-blue-700 mb-8">Nhà cung cấp: {po.supplier}</p>

      <div className="bg-blue-900 p-6 rounded-xl shadow-lg">
        <table className="w-full text-sm">
          <thead className="bg-blue-800 text-left">
            <tr>
              <th className="p-3">#</th>
              <th>Tên SP</th>
              <th>SKU</th>
              <th>SL</th>
              <th>Đã quét</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {po.items.map((it, idx) => (
              <tr
                key={it.id}
                className="border-b border-blue-700 hover:bg-blue-800 transition"
              >
                <td className="p-3">{idx + 1}</td>
                <td>{it.name}</td>
                <td className="text-blue-300">{it.sku}</td>
                <td>{it.qty}</td>
                <td className="font-semibold text-yellow-400">
                  {it.scanned}/{it.qty}
                </td>

                <td className="p-3">
                  {loadingItemId === it.id ? (
                    <div className="flex items-center gap-3">
                      {/* Nút Đang quét */}
                      <button
                        disabled
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg font-semibold"
                      >
                        Đang quét...
                      </button>

                      {/* Nút Dừng */}
                      <button
                        onClick={() => handleStop()}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-400 transition"
                      >
                        Dừng
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleScan(it.id)}
                      className="px-4 py-2 bg-yellow-400 text-white rounded-lg font-semibold hover:bg-yellow-300 transition"
                    >
                      Quét RFID
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* POPUP */}
      {popup && (
        <div
          className={`
            fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg text-white text-lg
            ${popup.type === "success" ? "bg-green-600" : "bg-red-600"}
          `}
        >
          {popup.msg}
        </div>
      )}
    </div>
  );
}
