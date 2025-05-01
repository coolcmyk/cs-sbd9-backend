import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Cart({ user }) {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchTransactions();
  }, [user, navigate]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/transaction/user/${user.id}`);
      
      if (response.data.success) {
        setTransactions(response.data.payload);
      }
    } catch (err) {
      setError('Failed to load transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (transactionId) => {
    try {
      const response = await axios.post(`${API_URL}/transaction/pay/${transactionId}`);
      
      if (response.data.success) {
        // Update local transaction status
        const updatedTransactions = transactions.map(t => 
          t.id === transactionId ? { ...t, status: 'paid' } : t
        );
        setTransactions(updatedTransactions);
        
        // Update user balance in localStorage
        const transaction = transactions.find(t => t.id === transactionId);
        if (transaction) {
          const updatedUser = {
            ...user,
            balance: user.balance - transaction.total
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          // Tell the parent component about the updated user
          window.location.reload(); // This is a simple way to refresh with updated balance
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed. Please try again.');
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    if (filter === 'pending') return transaction.status === 'pending';
    if (filter === 'completed') return transaction.status === 'paid';
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-red-100 border-l-4 border-red-500 p-4 mb-4">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={fetchTransactions}
          className="text-red-700 underline mt-2"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2 text-center text-blue-700">Your Shopping Cart</h1>
      <p className="text-gray-600 text-center mb-8">View and manage your purchases</p>
      
      {/* Filter tabs */}
      <div className="flex mb-6 border-b">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 border-b-2 font-medium ${
            filter === 'all' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Transactions
        </button>
        <button 
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 border-b-2 font-medium ${
            filter === 'pending' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Pending
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 border-b-2 font-medium ${
            filter === 'completed' 
              ? 'border-blue-500 text-blue-600' 
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed
        </button>
      </div>
      
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <p className="text-xl text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={transaction.item_image_url || 'https://via.placeholder.com/40'} 
                            alt={transaction.item_name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.item_name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${transaction.total?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${transaction.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'}`}>
                        {transaction.status === 'paid' ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {transaction.status === 'pending' ? (
                        <button
                          onClick={() => handlePayment(transaction.id)}
                          className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
                        >
                          Pay Now
                        </button>
                      ) : (
                        <Link to={`/product/${transaction.item_id}`} className="text-blue-600 hover:text-blue-900">
                          View Item
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;