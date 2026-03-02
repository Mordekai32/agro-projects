import { useEffect, useState } from 'react';
import { getProducts, getMyTransactions, getWeather, getArticles } from '../services/api';
import StatCard from '../components/StatCard';
import ProductTable from '../components/ProductTable';
import TransactionTable from '../components/TransactionTable';

export default function BuyerDashboardContent() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [weather, setWeather] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, txRes, weatherRes, artRes] = await Promise.all([
          getProducts(),
          getMyTransactions(),
          getWeather(),
          getArticles(),
        ]);
        setProducts(prodRes.data);
        setTransactions(txRes.data);
        setWeather(weatherRes.data);
        setArticles(artRes.data.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-8">Loading...</div>;

  const totalSpent = transactions.reduce((sum, t) => sum + parseFloat(t.total_price), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Products Available" value={products.length} icon="🌾" />
        <StatCard title="My Purchases" value={transactions.length} icon="🛒" />
        <StatCard title="Total Spent" value={`RWF ${totalSpent.toLocaleString()}`} icon="💵" />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Available Products</h2>
        <ProductTable products={products.slice(0, 5)} showBuyButton />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">My Purchase History</h2>
        <TransactionTable transactions={transactions.slice(0, 5)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Weather Updates</h2>
          {weather.map(w => (
            <div key={w.weather_id} className="border-b py-2">
              <strong>{w.district}:</strong> {w.temperature}°C, rain {w.rainfall_probability}%
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Latest Advisory</h2>
          {articles.map(a => (
            <div key={a.article_id} className="border-b py-2">
              <a href={`/advisory/${a.article_id}`} className="text-blue-600 hover:underline">
                {a.title}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}