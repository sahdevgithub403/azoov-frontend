import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../api/productApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    price: '',
    stockLevel: '',
    lowStockThreshold: '10',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createProduct({
        ...formData,
        price: parseFloat(formData.price),
        stockLevel: parseInt(formData.stockLevel),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
      });
      navigate('/inventory');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Product</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <Input
              label="Stock Level"
              type="number"
              value={formData.stockLevel}
              onChange={(e) => setFormData({ ...formData, stockLevel: e.target.value })}
              required
            />
          </div>

          <Input
            label="Low Stock Threshold"
            type="number"
            value={formData.lowStockThreshold}
            onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/inventory')}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

