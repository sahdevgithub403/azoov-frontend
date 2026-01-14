import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInvoice } from '../../api/invoiceApi';
import { getCustomers } from '../../api/customerApi';
import { getProducts } from '../../api/productApi';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    discount: '0',
    taxRate: '10',
    paymentMethod: 'CASH',
    internalNote: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [customersRes, productsRes] = await Promise.all([getCustomers(), getProducts()]);
      setCustomers(customersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const addItem = (product) => {
    const existingItem = items.find((item) => item.productId === product.id);
    if (existingItem) {
      setItems(
        items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * parseFloat(item.unitPrice) }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          description: `${product.name} • SKU: ${product.sku || 'N/A'}`,
          quantity: 1,
          unitPrice: parseFloat(product.price),
          total: parseFloat(product.price),
        },
      ]);
    }
  };

  const updateItemQuantity = (index, change) => {
    const newItems = [...items];
    newItems[index].quantity = Math.max(1, newItems[index].quantity + change);
    newItems[index].total = newItems[index].quantity * parseFloat(newItems[index].unitPrice);
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0);
    const discount = parseFloat(formData.discount || 0);
    const taxableAmount = subtotal - discount;
    const tax = (taxableAmount * parseFloat(formData.taxRate || 0)) / 100;
    const total = taxableAmount + tax;
    return { subtotal, discount, tax, total };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || items.length === 0) {
      alert('Please select a customer and add at least one item');
      return;
    }

    setLoading(true);
    try {
      const { subtotal, discount, tax, total } = calculateTotals();
      await createInvoice({
        customerId: selectedCustomer.id,
        issuedDate: new Date(),
        discount: discount,
        taxRate: parseFloat(formData.taxRate),
        paymentMethod: formData.paymentMethod,
        internalNote: formData.internalNote,
        items: items.map((item) => ({
          productId: item.productId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      });
      navigate('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, discount, tax, total } = calculateTotals();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Invoice</h1>
          <p className="text-gray-600 mt-1">Invoice #INV-2023-8492 • <span className="text-primary-500">Draft</span></p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate('/invoices')}>
            Cancel
          </Button>
          <Button variant="secondary">💾 Save Draft</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                👤 Customer Details
              </h2>
              <Button variant="outline" size="sm">Add New</Button>
            </div>
            <select
              value={selectedCustomer?.id || ''}
              onChange={(e) => {
                const customer = customers.find((c) => c.id === parseInt(e.target.value));
                setSelectedCustomer(customer);
              }}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">SELECT CUSTOMER</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </select>
            {selectedCustomer && (
              <div className="mt-4 space-y-2 text-sm">
                <p><strong>BILLING ADDRESS:</strong> {selectedCustomer.address || 'N/A'}</p>
                <p><strong>EMAIL:</strong> {selectedCustomer.email || 'N/A'}</p>
                <p><strong>PHONE:</strong> {selectedCustomer.phone || 'N/A'}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                🛒 Invoice Items
              </h2>
              <div className="flex gap-2">
                <Button variant="outline">📷 Scan</Button>
                <Button onClick={() => {/* Open product modal */}}>+ Add Item</Button>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search products to add..."
              className="w-full px-4 py-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div className="flex-1">
                    <p className="font-medium">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateItemQuantity(index, -1)}
                      className="px-2 py-1 border rounded"
                    >
                      -
                    </button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(index, 1)}
                      className="px-2 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>
                  <div className="w-24 text-right font-semibold">{formatCurrency(item.unitPrice)}</div>
                  <div className="w-24 text-right font-semibold">{formatCurrency(item.total)}</div>
                  <button onClick={() => removeItem(index)} className="text-red-500">🗑️</button>
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-center py-8 text-gray-500">No items added yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              🧮 Summary
            </h2>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-24"
                />
              </div>
              <div className="flex justify-between">
                <span>Tax (VAT {formData.taxRate}%):</span>
                <span className="font-semibold">{formatCurrency(tax)}</span>
              </div>
            </div>
            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Amount:</span>
                <span className="text-2xl font-bold text-primary-600">{formatCurrency(total)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Includes all applicable taxes</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">INTERNAL NOTE</label>
              <textarea
                value={formData.internalNote}
                onChange={(e) => setFormData({ ...formData, internalNote: e.target.value })}
                placeholder="Add a note for staff..."
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="3"
              />
            </div>
            <Button
              onClick={handleSubmit}
              disabled={loading || !selectedCustomer || items.length === 0}
              className="w-full bg-primary-500 hover:bg-primary-600 mb-3"
            >
              {loading ? 'Generating...' : 'Generate Invoice →'}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">🖨️ Print</Button>
              <Button variant="outline" className="flex-1">✉️ Email</Button>
            </div>
            <div className="mt-4 flex gap-2">
              {['CARD', 'CASH', 'UPI'].map((method) => (
                <button
                  key={method}
                  onClick={() => setFormData({ ...formData, paymentMethod: method })}
                  className={`flex-1 px-4 py-2 border rounded-lg ${
                    formData.paymentMethod === method ? 'bg-primary-500 text-white' : ''
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;

