import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginRegister from './pages/LoginRegister';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';

function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/login" element={<LoginRegister setUser={setUser} />} />
          <Route path="/product/:id" element={<ProductDetail user={user} />} />
          <Route path="/cart" element={<Cart user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;