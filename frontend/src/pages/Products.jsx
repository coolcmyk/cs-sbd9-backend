import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/item`);
        if (response.data.success) {
          setProducts(response.data.payload);
        }
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  );

  return (
    <div className="py-8 px-4">
      <h1 className="text-4xl font-extrabold mb-2 text-center text-blue-700">Shopping Marketplace</h1>
      <p className="text-gray-600 text-center mb-10">Find the best products for the best prices</p>
      
      {products.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 13h4v4h-4v-4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h4v4H7V8z" />
          </svg>
          <p className="text-gray-500 text-xl">No products available</p>
          <p className="text-gray-400 mt-2">Please check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;