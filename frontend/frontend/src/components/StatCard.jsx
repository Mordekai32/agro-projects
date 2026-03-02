export default function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-center">
      <span className="text-4xl mr-3">{icon}</span>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}