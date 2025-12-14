export default function Rfid() {
  const rfids = [
    { id: 'RF001', product: 'Chai nước suối', status: 'IN_STOCK' },
    { id: 'RF002', product: 'Bánh mì gói', status: 'SOLD' },
    { id: 'RF003', product: 'Sữa Mleko 1L', status: 'LOST' },
  ];

  const colorByStatus = {
    IN_STOCK: 'text-green-600',
    SOLD: 'text-blue-600',
    LOST: 'text-red-600',
    INACTIVE: 'text-gray-500',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">RFID Tags</h1>
      <table className="w-full border border-gray-200 bg-white rounded-lg shadow">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left text-sm font-semibold text-gray-600">
              RFID Code
            </th>
            <th className="p-3 text-left text-sm font-semibold text-gray-600">
              Product
            </th>
            <th className="p-3 text-left text-sm font-semibold text-gray-600">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {rfids.map((r) => (
            <tr key={r.id} className="border-t hover:bg-gray-50">
              <td className="p-3 text-gray-800">{r.id}</td>
              <td className="p-3 text-gray-600">{r.product}</td>
              <td
                className={`p-3 font-semibold ${colorByStatus[r.status as keyof typeof colorByStatus]}`}
              >
                {r.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
