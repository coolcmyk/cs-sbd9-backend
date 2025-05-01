import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };
  
  const handleTopup = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    
    try {
      // Use params as the backend expects query params
      const response = await axios.post(`${API_URL}/user/topup`, null, {
        params: { id: user.id, amount: topupAmount }
      });
      
      if (response.data.success) {
        // Update user data with new balance
        const updatedUser = response.data.payload;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setShowTopup(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Top up failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div>
            <Link to="/" className="text-2xl font-bold">ShopApp</Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200 transition">Products</Link>
            {user ? (
              <>
                <Link to="/cart" className="hover:text-blue-200 transition">Cart</Link>
                <button 
                  onClick={() => setShowTopup(!showTopup)}
                  className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-sm transition"
                >
                  Balance: ${user.balance?.toLocaleString() || 0}
                </button>
                <span className="text-sm font-medium">Hi, {user.name}!</span>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-md text-sm transition"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Top-up modal */}
      {showTopup && user && (
        <div className="absolute right-4 mt-2 w-64 bg-white rounded-lg shadow-xl p-4 text-gray-800">
          <h3 className="font-bold mb-2">Top Up Balance</h3>
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
          <div className="flex items-center mb-3">
            <span className="mr-2">$</span>
            <input
              type="number"
              min="1"
              value={topupAmount}
              onChange={(e) => setTopupAmount(Math.max(1, parseInt(e.target.value) || 0))}
              className="border rounded px-2 py-1 w-full text-gray-700"
            />
          </div>
          <button
            onClick={handleTopup}
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-1 rounded text-sm"
          >
            {isLoading ? 'Processing...' : 'Add Funds'}
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;