import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../api/productApi';
import { formatCurrency } from '../../utils/formatCurrency';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';

const InventoryList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [stockFilter, setStockFilter] = useState('All Stock Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, categoryFilter, stockFilter, filterProducts]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await getProducts();
      setProducts(response.data || []);
      setFilteredProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== 'All Categories') {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (stockFilter === 'Low Stock') {
      filtered = filtered.filter((p) => p.isLowStock || p.stockLevel <= (p.lowStockThreshold || 10));
    } else if (stockFilter === 'In Stock') {
      filtered = filtered.filter((p) => p.stockLevel > (p.lowStockThreshold || 10));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchQuery, categoryFilter, stockFilter]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const categories = ['All Categories', ...new Set(products.map((p) => p.category).filter(Boolean))];
  const totalProducts = products.length;
  const lowStockCount = products.filter((p) => p.isLowStock || p.stockLevel <= (p.lowStockThreshold || 10)).length;
  const totalValue = products.reduce((sum, p) => sum + parseFloat(p.price || 0) * (p.stockLevel || 0), 0);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600 mt-1">Track stock levels and manage your product catalog.</p>
      </div>

      <div className="flex justify-end">
        <Link to="/inventory/add">
          <Button className="bg-primary-500 hover:bg-primary-600">
            <span className="mr-2">+</span>
            Add Product
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <span className="text-green-500 text-sm font-semibold">+5%</span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Products</h3>
          <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <span className="text-orange-500 text-xs font-semibold">Action Needed</span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Low Stock Items</h3>
          <p className="text-2xl font-bold text-gray-900">{lowStockCount}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className="text-green-500 text-sm font-semibold">+8%</span>
          </div>
          <h3 className="text-gray-600 text-sm mb-1">Total Value</h3>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalValue)}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search products by name, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🔍</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option>All Stock Status</option>
            <option>In Stock</option>
            <option>Low Stock</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-sm font-semibold text-gray-600">
                <th className="pb-3">PRODUCT NAME</th>
                <th className="pb-3">CATEGORY</th>
                <th className="pb-3">PRICE</th>
                <th className="pb-3">STOCK LEVEL</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => {
                const isLowStock = product.isLowStock || product.stockLevel <= (product.lowStockThreshold || 10);
                const stockPercentage = Math.min((product.stockLevel / 100) * 100, 100);
                return (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded"></div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">{product.category}</span>
                    </td>
                    <td className="py-4 font-semibold">{formatCurrency(product.price || 0)}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span>{product.stockLevel}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
                          <div
                            className={`h-2 rounded-full ${isLowStock ? 'bg-orange-500' : 'bg-green-500'
                              }`}
                            style={{ width: `${stockPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${isLowStock
                          ? 'bg-orange-100 text-orange-600'
                          : 'bg-green-100 text-green-600'
                          }`}
                      >
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/inventory/edit/${product.id}`}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center py-8 text-gray-500">No products found</p>
        )}

        {totalPages > 1 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}{' '}
              results
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryList;

