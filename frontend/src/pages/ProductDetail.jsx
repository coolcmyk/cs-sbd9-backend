import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  
  const API_URL = 'http://localhost:3000';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_URL}/item/byId/${id}`);
        if (response.data.success) {
          setProduct(response.data.payload);
        }
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setError(null);
      
      // Create transaction - expects a JSON body
      const response = await axios.post(`${API_URL}/transaction/create`, {
        user_id: user.id,
        item_id: product.id,
        quantity
      });
      
      if (response.data.success) {
        // Pay transaction - uses URL parameter
        const payResponse = await axios.post(`${API_URL}/transaction/pay/${response.data.payload.id}`);
        
        if (payResponse.data.success) {
          setMessage('Purchase successful!');
          
          // Update user balance in localStorage
          const updatedUser = {
            ...user,
            balance: user.balance - (quantity * product.price)
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Update product stock
          setProduct({
            ...product,
            stock: product.stock - quantity
          });
          
          // Reset quantity
          setQuantity(1);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
      console.error('Transaction error:', err);
    }
  };

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

  if (!product) return (
    <div className="text-center py-8">
      Product not found
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden md:flex">
        <div className="md:flex-shrink-0">
          <img 
            src={product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'} 
            alt={product.name} 
            className="w-full h-64 md:h-auto md:w-96 object-cover"
          />
        </div>
        
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-green-600 text-xl font-bold mb-4">${product.price.toLocaleString()}</p>
          <p className="text-gray-700 mb-4">Stock: {product.stock}</p>
          
          {product.stock > 0 ? (
            <div>
              <div className="flex items-center mb-4">
                <label className="mr-2">Quantity:</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), product.stock))}
                  min="1"
                  max={product.stock}
                  className="border rounded w-16 py-1 px-2"
                />
              </div>
              
              <button 
                onClick={handleBuy}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
              >
                Buy Now
              </button>
            </div>
          ) : (
            <p className="text-red-500 font-bold">Out of Stock</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;