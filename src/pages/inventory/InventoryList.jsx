import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../api/productApi";
import { formatCurrency } from "../../utils/formatCurrency";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";

const InventoryList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [stockFilter, setStockFilter] = useState("All Stock Status");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchProducts = useCallback(async () => {
    try {
      const response = await getProducts();
      setProducts(response.data || []);
      setFilteredProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filterProducts = useCallback(() => {
    let filtered = [...products];

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (categoryFilter !== "All Categories") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (stockFilter === "Low Stock") {
      filtered = filtered.filter(
        (p) => p.isLowStock || p.stockLevel <= (p.lowStockThreshold || 10),
      );
    } else if (stockFilter === "In Stock") {
      filtered = filtered.filter(
        (p) => p.stockLevel > (p.lowStockThreshold || 10),
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchQuery, categoryFilter, stockFilter]);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, categoryFilter, stockFilter, filterProducts]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const categories = [
    "All Categories",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];
  const totalProducts = products.length;
  const lowStockCount = products.filter(
    (p) => p.isLowStock || p.stockLevel <= (p.lowStockThreshold || 10),
  ).length;
  const totalValue = products.reduce(
    (sum, p) => sum + parseFloat(p.price || 0) * (p.stockLevel || 0),
    0,
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-[#F7F9FB]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Inventory Management
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Track stock levels and manage your product catalog.
          </p>
        </div>
        <div className="flex justify-end">
          <Link to="/inventory/add">
            <button className="px-6 py-3 bg-[#5B8DEF] hover:bg-[#4a7bdc] border-2 border-gray-900 text-white font-bold rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] transition-all active:shadow-none active:translate-y-[4px] flex items-center gap-2">
              <span className="text-xl leading-none mb-1">+</span>
              Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Products Card */}
        <div className="bg-white rounded-[20px] p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 bg-blue-50 border-2 border-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <span className="px-3 py-1 bg-green-100 border-2 border-green-200 text-green-700 text-xs font-bold rounded-full">
              +5%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-1">
            Total Products
          </h3>
          <p className="text-4xl font-extrabold text-gray-900">
            {totalProducts}
          </p>
        </div>

        {/* Low Stock Card */}
        <div className="bg-white rounded-[20px] p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 bg-yellow-50 border-2 border-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <span className="px-3 py-1 bg-orange-100 border-2 border-orange-200 text-orange-700 text-xs font-bold rounded-full">
              Action Needed
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-1">
            Low Stock Items
          </h3>
          <p className="text-4xl font-extrabold text-gray-900">
            {lowStockCount}
          </p>
        </div>

        {/* Total Value Card */}
        <div className="bg-white rounded-[20px] p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:translate-y-[-2px] transition-transform">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-12 h-12 bg-gray-50 border-2 border-gray-900 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <span className="px-3 py-1 bg-green-100 border-2 border-green-200 text-green-700 text-xs font-bold rounded-full">
              +8%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wide mb-1">
            Total Value
          </h3>
          <p className="text-4xl font-extrabold text-gray-900">
            {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[20px] border-2 border-gray-900 shadow-sm p-6">
        {/* Filters Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder="Search products by name, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 border-2 border-gray-900 rounded-3xl focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-[1px] transition-all placeholder:text-gray-400 font-medium text-gray-900"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-[#5B8DEF]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </span>
          </div>
          
          <div className="relative min-w-[200px]">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-900 rounded-3xl focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-[1px] transition-all font-bold text-gray-700 bg-white appearance-none cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
               <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

          <div className="relative min-w-[200px]">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-900 rounded-3xl focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:-translate-y-[1px] transition-all font-bold text-gray-700 bg-white appearance-none cursor-pointer"
            >
              <option>All Stock Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
               <svg className="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto rounded-xl border-2 border-gray-100">
          <table className="w-full">
            <thead className="bg-gray-50 border-b-2 border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  PRODUCT NAME
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  CATEGORY
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  PRICE
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-900 uppercase tracking-wider w-1/4">
                  STOCK LEVEL
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-4 text-left text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.map((product) => {
                const isLowStock =
                  product.isLowStock ||
                  product.stockLevel <= (product.lowStockThreshold || 10);
                const stockPercentage = Math.min(
                  (product.stockLevel / 100) * 100,
                  100,
                );
                return (
                  <tr key={product.id} className="hover:bg-[#F7F9FB] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center text-xl group-hover:border-[#5B8DEF] transition-colors">
                           📦
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-bold text-gray-600">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {formatCurrency(product.price || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold w-8 text-right">{product.stockLevel}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2.5 border border-gray-200">
                          <div
                            className={`h-full rounded-full ${
                              isLowStock ? "bg-orange-500" : "bg-[#5B8DEF]"
                            }`}
                            style={{ width: `${stockPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          isLowStock
                            ? "bg-orange-50 text-orange-700 border-orange-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {isLowStock ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/inventory/edit/${product.id}`}
                          className="p-2 text-gray-400 hover:text-[#5B8DEF] hover:bg-[#5B8DEF]/10 rounded-lg transition-colors"
                        >
                          ✏️
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          <p className="text-center py-12 text-gray-400 font-medium">No products found</p>
        )}

        {totalPages > 1 && (
          <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 font-bold">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
              {filteredProducts.length} results
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