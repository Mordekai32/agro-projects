export default function ProductTable({ products, showActions, showBuyButton }) {
  if (products.length === 0) return <p className="text-gray-500">No products found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Unit</th>
            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
            {(showActions || showBuyButton) && (
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((p) => (
            <tr key={p.product_id}>
              <td className="px-4 py-2 whitespace-nowrap">{p.product_name}</td>
              <td className="px-4 py-2 whitespace-nowrap">{p.category}</td>
              <td className="px-4 py-2 whitespace-nowrap text-right">RWF {p.price_per_unit}</td>
              <td className="px-4 py-2 whitespace-nowrap text-right">{p.quantity_available}</td>
              {(showActions || showBuyButton) && (
                <td className="px-4 py-2 whitespace-nowrap text-center">
                  {showActions && (
                    <>
                      <button className="text-blue-600 hover:underline mr-2">Edit</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </>
                  )}
                  {showBuyButton && (
                    <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Buy</button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}