import { useEffect, useState } from 'react';
import { getProducts } from '../services/api'; // ✅ corrected import

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await getProducts(); // ✅ corrected function call
      setProducts(data);
    };
    load();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.product_id} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold">{p.product_name}</h2>
            <p>Price: {p.price_per_unit} RWF</p>
            <p>Available: {p.quantity_available} kg</p>
          </div>
        ))}
      </div>
    </div>
  );
}