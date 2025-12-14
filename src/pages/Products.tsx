import { useEffect, useState } from 'react';
import { api } from '../services/api';
import ProductTable from '../components/ProductTable';

type Product = {
  id: number;
  name: string;
  sku: string;
  sellPrice: number;
  stock: number;
  rfidcount: number;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data.items);
      } catch (err) {
        console.error('Lỗi tải sản phẩm:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col flex-1 p-6 bg-[#f5f6fa]">
      <h1 className="text-xl font-semibold mb-4 text-grey-200">Sản phẩm</h1>

      {loading ? (
        <p className="text-gray-500 italic">Đang tải dữ liệu...</p>
      ) : (
        <ProductTable products={products} />
      )}
    </div>
  );
}
