type Props = {
  title: string;
  value: string;
  orders: string;
};

export default function StatCard({ title, value, orders }: Props) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-gray-800">{value}</h2>
      <p className="text-blue-600 text-sm">{orders}</p>
    </div>
  );
}
