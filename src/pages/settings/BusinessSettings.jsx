import { useEffect, useState } from 'react';
import { getBusiness, updateBusiness } from '../../api/businessApi';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

const BusinessSettings = () => {
  const [business, setBusiness] = useState({
    name: '',
    description: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    taxId: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const response = await getBusiness();
      setBusiness(response.data || {});
    } catch (error) {
      console.error('Error fetching business:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await updateBusiness(business);
      setMessage('Business settings updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update business settings');
      console.error('Error updating business:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Business Settings</h1>
        <p className="text-gray-600 mt-1">Update your company information, logos, and contact details.</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Company Information</h2>
            <div className="space-y-4">
              <Input
                label="Business Name"
                value={business.name}
                onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={business.description}
                  onChange={(e) => setBusiness({ ...business, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                value={business.email}
                onChange={(e) => setBusiness({ ...business, email: e.target.value })}
              />
              <Input
                label="Phone"
                value={business.phone}
                onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
              />
              <Input
                label="Website"
                type="url"
                value={business.website}
                onChange={(e) => setBusiness({ ...business, website: e.target.value })}
              />
              <Input
                label="Tax ID"
                value={business.taxId}
                onChange={(e) => setBusiness({ ...business, taxId: e.target.value })}
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
              <textarea
                value={business.address}
                onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="3"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Logo</h2>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                {business.logo ? (
                  <img src={business.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <span className="text-gray-400">No logo</span>
                )}
              </div>
              <div>
                <Button variant="outline" type="button">
                  Upload Logo
                </Button>
                <p className="text-sm text-gray-500 mt-2">Recommended: 200x200px, PNG or JPG</p>
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button variant="secondary" type="button" onClick={() => fetchBusiness()}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessSettings;

