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
  const [searchQuery, setSearchQuery] = useState('');
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
    setSearchQuery('');
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
    const disc = parseFloat(formData.discount || 0);
    const taxableAmount = subtotal - disc;
    const taxValue = (taxableAmount * parseFloat(formData.taxRate || 0)) / 100;
    const totalValue = taxableAmount + taxValue;
    return { subtotal, discount: disc, tax: taxValue, total: totalValue };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomer || items.length === 0) {
      alert('Please select a customer and add at least one item');
      return;
    }

    setLoading(true);
    try {
      const { subtotal: _s, discount: d, tax: t, total: tot } = calculateTotals();
      await createInvoice({
        customerId: selectedCustomer.id,
        issuedDate: new Date(),
        discount: d,
        taxRate: parseFloat(formData.taxRate),
        paymentMethod: formData.paymentMethod,
        internalNote: formData.internalNote,
        items: items.map((item) => ({
          productId: item.productId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        total: tot,
        tax: t
      });
      navigate('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice');
    } finally {
      setLoading(false);
    }
  };

  const { subtotal, tax, total } = calculateTotals();

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Invoice</h1>
          <p className="text-gray-600 mt-1">Invoice #INV-{new Date().getFullYear()}-{Math.floor(Math.random() * 9000) + 1000} • <span className="text-primary-500 font-bold uppercase tracking-wider text-xs">Draft</span></p>
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">👤</span>
                Customer Details
              </h2>
              <Button variant="outline" size="sm">Add New</Button>
            </div>
            <div className="relative">
              <select
                value={selectedCustomer?.id || ''}
                onChange={(e) => {
                  const customer = customers.find((c) => c.id === parseInt(e.target.value));
                  setSelectedCustomer(customer);
                }}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#238898]/10 transition-all appearance-none"
              >
                <option value="">SELECT CUSTOMER</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>
            {selectedCustomer && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Billing Address</p>
                  <p className="text-gray-700 font-medium">{selectedCustomer.address || 'N/A'}</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-gray-700 font-medium">{selectedCustomer.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone</p>
                    <p className="text-gray-700 font-medium">{selectedCustomer.phone || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">🛒</span>
                Invoice Items
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">📷 Scan</Button>
              </div>
            </div>

            <div className="relative mb-6">
              <Input
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={() => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>}
              />
              {searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden divide-y divide-gray-50 animate-in fade-in slide-in-from-top-2">
                  {filteredProducts.map(product => (
                    <button
                      key={product.id}
                      onClick={() => addItem(product)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between group"
                    >
                      <div>
                        <p className="font-bold text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400">SKU: {product.sku || 'N/A'} • {product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#238898]">{formatCurrency(product.price)}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider group-hover:text-[#238898]">Add to cart +</p>
                      </div>
                    </button>
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-400">No products found</div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-50/50 hover:bg-gray-50 rounded-2xl border border-gray-100 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-xl shadow-sm">📦</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{item.description}</p>
                    <p className="text-xs text-gray-400">{formatCurrency(item.unitPrice)} per unit</p>
                  </div>
                  <div className="flex items-center bg-white rounded-xl border border-gray-100 p-1">
                    <button
                      onClick={() => updateItemQuantity(index, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
                    </button>
                    <span className="w-10 text-center font-bold text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateItemQuantity(index, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14" /><path d="M5 12h14" /></svg>
                    </button>
                  </div>
                  <div className="w-24 text-right font-bold text-gray-900">{formatCurrency(item.total)}</div>
                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
                  </button>
                </div>
              ))}
              {items.length === 0 && (
                <div className="text-center py-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 11 4-7" /><path d="m19 11-4-7" /><path d="M2 11h20" /><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" /><path d="M4.5 15.5h15" /></svg>
                  </div>
                  <p className="text-gray-500 font-medium">Your cart is empty</p>
                  <p className="text-xs text-gray-400 mt-1">Search or scan products to add them to the invoice</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 sticky top-24 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#238898]"></div>
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-sky-50 text-sky-600 rounded-lg flex items-center justify-center">🧮</span>
              Order Summary
            </h2>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Discount</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-20 px-2 py-1 bg-gray-50 border-none rounded-lg text-right font-bold focus:ring-2 focus:ring-[#238898]/10 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (VAT {formData.taxRate}%)</span>
                <span className="font-bold text-gray-900">{formatCurrency(tax)}</span>
              </div>
            </div>

            <div className="border-t border-gray-50 pt-6 mb-8">
              <div className="flex justify-between items-end mb-1">
                <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">Total Amount</span>
                <span className="text-3xl font-black text-[#238898]">{formatCurrency(total)}</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium text-right uppercase tracking-tighter italic">Includes all applicable taxations</p>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Internal Note</p>
                <textarea
                  value={formData.internalNote}
                  onChange={(e) => setFormData({ ...formData, internalNote: e.target.value })}
                  placeholder="Notes for internal record only..."
                  className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#238898]/10 transition-all text-sm outline-none"
                  rows="3"
                />
              </div>

              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Mode</p>
                <div className="flex gap-2">
                  {['CARD', 'CASH', 'UPI'].map((method) => (
                    <button
                      key={method}
                      onClick={() => setFormData({ ...formData, paymentMethod: method })}
                      className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all ${formData.paymentMethod === method
                        ? 'bg-[#238898] border-[#238898] text-white shadow-lg shadow-[#238898]/20 scale-105'
                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !selectedCustomer || items.length === 0}
                  className="w-full py-4 text-base font-black shadow-2xl"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      PROCESSING...
                    </div>
                  ) : 'FINALIZE INVOICE →'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvoice;

