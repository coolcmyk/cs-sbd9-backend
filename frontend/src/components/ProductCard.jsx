import { Link } from 'react-router-dom';

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={product.image_url || 'https://via.placeholder.com/300x200?text=No+Image'} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        {product.stock < 5 && product.stock > 0 && (
          <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
            Low Stock: {product.stock}
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-1 truncate">{product.name}</h3>
        <p className="text-green-600 font-bold text-xl mb-3">${product.price.toLocaleString()}</p>
        <Link 
          to={`/product/${product.id}`}
          className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;