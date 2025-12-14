import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import mqtt from "mqtt";
import type { Bill } from "../types/sale";
src / pages / SaleCreatePage.tsx;

export default function SaleCreatePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState<Bill | null>(null);
  const [popup, setPopup] = useState<{ type: string; msg: string } | null>(
    null
  );

  const clientRef = useRef<mqtt.MqttClient | null>(null);

  // ============================
  // CASE 1: Không có billId → Tự tạo hóa đơn mới
  // ============================
  useEffect(() => {
    if (!id) {
      const createAndRedirect = async () => {
        const res = await axios.post("${API_URL}/sales/create");
        navigate(`/sales/create/${res.data.id}`, { replace: true });
      };

      createAndRedirect();
    }
  }, [id, navigate]);

  // ============================
  // Hàm load bill
  // ============================
  const loadBill = async () => {
    if (!id) return;
    const res = await axios.get(`${API_URL}/sales/${id}`);
    setBill(res.data);
  };

  const showPopup = (type: string, msg: string) => {
    setPopup({ type, msg });
    setTimeout(() => setPopup(null), 2500);
  };

  // =============================
  // CASE 2: Có billId → Bán hàng
  // =============================
  useEffect(() => {
    if (!id) return;

    axios.post(`${API_URL}/sales/${id}/start-sell`);
    loadBill();

    const client = mqtt.connect(
      "wss://pee4ef34.ala.eu-central-1.emqxsl.com:8084/mqtt",
      {
        username: "admin",
        password: "123",
        reconnectPeriod: 500,
      }
    );

    clientRef.current = client;

    client.on("connect", () => {
      client.subscribe("rfid/sell/result");
    });

    client.on("message", (topic, msg) => {
      if (topic === "rfid/sell/result") {
        const data = JSON.parse(msg.toString());

        if (data.success) {
          showPopup("success", `Đã thêm sản phẩm UID: ${data.uid}`);
          loadBill();
        } else {
          showPopup("error", data.reason);
        }
      }
    });

    return () => {
      axios.post("${API_URL}/sales/stop-sell");
      client.end();
    };
  }, [id]);

  const handleCheckout = async () => {
    await axios.post(`${API_URL}/sales/${id}/checkout`);
    await axios.post("${API_URL}/sales/stop-sell");
    navigate("/sales");
  };

  if (!bill)
    return <p className="p-6 text-lg text-gray-500">Đang tải hóa đơn...</p>;

  // ==============================
  // Giao diện bán hàng
  // ==============================
  return (
    <div className="p-8 flex justify-center">
      <div className="w-full max-w-5xl">
        <button
          onClick={() => navigate("/sales")}
          className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          ← Quay lại danh sách bill
        </button>

        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Bán hàng — Bill <span className="text-blue-700">#{bill.id}</span>
        </h1>

        <div className="bg-white shadow-lg rounded-2xl p-8">
          <p className="text-center text-green-600 font-semibold text-lg mb-4">
            Đang ở chế độ bán hàng (quét RFID)...
          </p>

          <div className="overflow-hidden rounded-xl border shadow-sm">
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="p-3 text-left">Tên sản phẩm</th>
                  <th className="p-3 text-center">SL</th>
                  <th className="p-3 text-right">Giá đơn</th>
                  <th className="p-3 text-right">Thành tiền</th>
                </tr>
              </thead>

              <tbody>
                {bill.items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-gray-500">
                      Chưa có sản phẩm nào. Hãy quét RFID.
                    </td>
                  </tr>
                ) : (
                  bill.items.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b hover:bg-gray-50 text-black"
                    >
                      <td className="p-3">{item.product.name}</td>
                      <td className="p-3 text-center text-green-700">
                        {item.qty}
                      </td>
                      <td className="p-3 text-right text-yellow-600 font-semibold">
                        {Number(item.product.sellPrice).toLocaleString()} đ
                      </td>
                      <td className="p-3 text-right font-bold text-blue-700">
                        {Number(item.lineTotal).toLocaleString()} đ
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="text-right mt-6 text-3xl font-bold">
            Tổng tiền:{" "}
            <span className="text-blue-700">
              {Number(bill.totalPrice).toLocaleString()} đ
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="mt-8 w-full py-4 bg-black text-white text-lg font-semibold rounded-xl hover:bg-gray-900 transition shadow-md"
          >
            Thanh toán
          </button>
        </div>

        {popup && (
          <div
            className={`fixed top-6 right-6 px-6 py-3 rounded-xl text-white shadow-lg
            ${popup.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {popup.msg}
          </div>
        )}
      </div>
    </div>
  );
}
