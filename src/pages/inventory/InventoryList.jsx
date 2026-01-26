import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../../api/productApi";
import { formatCurrency } from "../../utils/formatCurrency";
import Loader from "../../components/common/Loader";
import Pagination from "../../components/common/Pagination";
import { 
  Search, 
  Plus, 
  Package, 
  AlertTriangle, 
  DollarSign, 
  Edit, 
  Trash2, 
  Filter,
  ChevronDown 
} from "lucide-react";

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
          p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "All Categories") {
      filtered = filtered.filter((p) => p.category === categoryFilter);
    }

    if (stockFilter === "Low Stock") {
      filtered = filtered.filter(
        (p) => p.isLowStock || p.stockLevel <= (p.lowStockThreshold || 10)
      );
    } else if (stockFilter === "In Stock") {
      filtered = filtered.filter(
        (p) => p.stockLevel > (p.lowStockThreshold || 10)
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
    (p) => p.isLowStock || p.stockLevel <= (p.lowStockThreshold || 10)
  ).length;
  const totalValue = products.reduce(
    (sum, p) => sum + parseFloat(p.price || 0) * (p.stockLevel || 0),
    0
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Inventory Management
          </h1>
          <p className="text-gray-500 mt-2">
            Track stock levels and manage your product catalog.
          </p>
        </div>
        <div className="flex justify-end">
          <Link to="/inventory/add">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#189CAB] hover:bg-[#148a9c] text-white font-semibold rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
              <Plus size={20} strokeWidth={2.5} />
              Add Product
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Products Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Package size={24} />
            </div>
            <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">
              +5%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">
            Total Products
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {totalProducts}
          </p>
        </div>

        {/* Low Stock Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <span className="px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded-lg border border-orange-100">
              Action Needed
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">
            Low Stock Items
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {lowStockCount}
          </p>
        </div>

        {/* Total Value Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-50 text-[#189CAB] rounded-xl flex items-center justify-center">
              <DollarSign size={24} />
            </div>
            <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg border border-green-100">
              +8%
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wide mb-1">
            Total Value
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(totalValue)}
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Filters Section */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Search products by name, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-11 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189CAB]/20 focus:border-[#189CAB] transition-all text-gray-700 placeholder:text-gray-400 font-medium"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#189CAB]" size={18} />
            </div>
            
            <div className="flex gap-4">
              <div className="relative min-w-[180px]">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                   <Filter size={16} />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189CAB]/20 focus:border-[#189CAB] transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <div className="relative min-w-[180px]">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                   <Package size={16} />
                </div>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#189CAB]/20 focus:border-[#189CAB] transition-all font-medium text-gray-700 bg-white appearance-none cursor-pointer"
                >
                  <option>All Stock Status</option>
                  <option>In Stock</option>
                  <option>Low Stock</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider w-1/5">
                  Stock Level
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedProducts.map((product) => {
                const isLowStock =
                  product.isLowStock ||
                  product.stockLevel <= (product.lowStockThreshold || 10);
                const stockPercentage = Math.min(
                  (product.stockLevel / 100) * 100,
                  100
                );
                return (
                  <tr key={product.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-[#189CAB]/10 group-hover:text-[#189CAB] transition-colors">
                           <Package size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500 font-medium">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {formatCurrency(product.price || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm w-8 text-right text-gray-700">{product.stockLevel}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isLowStock ? "bg-orange-500" : "bg-[#189CAB]"
                            }`}
                            style={{ width: `${stockPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          isLowStock
                            ? "bg-orange-50 text-orange-700 border-orange-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}
                      >
                        {isLowStock ? "Low Stock" : "In Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/inventory/edit/${product.id}`}
                          className="p-2 text-gray-400 hover:text-[#189CAB] hover:bg-[#189CAB]/10 rounded-lg transition-all"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
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
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Package size={32} />
            </div>
            <h3 className="text-gray-900 font-semibold mb-1">No products found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your filters or search query.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-gray-50/30">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of{" "}
              <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
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