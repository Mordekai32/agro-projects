export default function TransactionTable({ transactions }) {
  if (transactions.length === 0) return <p className="text-gray-500">No transactions found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((t) => (
            <tr key={t.transaction_id}>
              <td className="px-4 py-2 whitespace-nowrap">{t.product_name || `Product #${t.product_id}`}</td>
              <td className="px-4 py-2 whitespace-nowrap text-right">{t.quantity_bought}</td>
              <td className="px-4 py-2 whitespace-nowrap text-right">RWF {t.total_price}</td>
              <td className="px-4 py-2 whitespace-nowrap text-right">RWF {t.commission_fee}</td>
              <td className="px-4 py-2 whitespace-nowrap">{new Date(t.transaction_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}