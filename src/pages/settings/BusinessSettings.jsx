import { useEffect, useState } from 'react';
import { getBusiness, updateBusiness } from '../../api/businessApi';
import Loader from '../../components/common/Loader';

// Icons
const Icons = {
  Store: () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/></svg>
  ),
  Upload: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
  ),
  Mail: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  ),
  Phone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
  ),
  Bulb: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2C9DA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
  ),
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  Save: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
  )
};

const BusinessSettings = () => {
  const [business, setBusiness] = useState({
    name: '',
    description: '',
    address: '',
    email: '',
    phone: '',
    website: '',
    taxId: '',
    currency: 'USD ($)',
    timezone: '(GMT-05:00) Eastern Time (US & Canada)',
    logo: null
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
      // Merge response with defaults to ensure controlled inputs
      setBusiness(prev => ({ ...prev, ...(response.data || {}) }));
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
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="mb-8">
        <div className="text-xs text-gray-400 mb-1 font-medium">Settings / Business Profile</div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Business Settings</h1>
        <p className="text-gray-500 mt-2 text-sm max-w-2xl">
          Manage your shop's public identity, logo, and contact details visible to your customers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Logo & Tips */}
        <div className="w-full lg:w-85 shrink-0 space-y-6">
          
          {/* Shop Logo Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4">Shop Logo</h2>
            
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#2C9DA6] hover:bg-gray-50 transition-colors group h-64 bg-gray-50/50">
               {business.logo ? (
                 <img src={business.logo} alt="Shop Logo" className="w-32 h-32 object-contain mb-4" />
               ) : (
                <>
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Icons.Store />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Click to upload</span>
                  <span className="text-xs text-gray-400 mt-1">SVG, PNG, JPG (max. 800x800px)</span>
                </>
               )}
            </div>

            <button type="button" className="w-full mt-4 flex items-center justify-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium py-2 hover:bg-red-50 rounded-lg transition-colors">
              <Icons.Trash /> Remove Logo
            </button>
          </div>

          {/* Pro Tip Card */}
          <div className="bg-[#EEF7F8] rounded-2xl p-5 border border-[#E0F0F1]">
            <div className="flex gap-3">
              <div className="mt-0.5"><Icons.Bulb /></div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">Pro Tip</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Your business logo appears on all printed invoices and customer email notifications. Make sure it's high resolution!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form Inputs */}
        <div className="flex-1 space-y-6">
          
          {/* General Information Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-lg font-bold text-gray-900">General Information</h2>
               <div className="cursor-help" title="These details will be publicly visible"><Icons.Info /></div>
            </div>

            <div className="space-y-6">
              
              {/* Row 1: Name & Tax ID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700 ml-1">Business Name</label>
                  <input
                    type="text"
                    value={business.name}
                    onChange={(e) => setBusiness({ ...business, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-[#2C9DA6] focus:ring-1 focus:ring-[#2C9DA6] transition-all placeholder-gray-400"
                    placeholder="Joe's Coffee Roasters"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700 ml-1">Tax ID / VAT</label>
                  <input
                    type="text"
                    value={business.taxId}
                    onChange={(e) => setBusiness({ ...business, taxId: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-[#2C9DA6] focus:ring-1 focus:ring-[#2C9DA6] transition-all placeholder-gray-400"
                    placeholder="e.g. US-123456789"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700 ml-1">Support Email</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2"><Icons.Mail /></span>
                    <input
                      type="email"
                      value={business.email}
                      onChange={(e) => setBusiness({ ...business, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-[#2C9DA6] focus:ring-1 focus:ring-[#2C9DA6] transition-all placeholder-gray-400"
                      placeholder="hello@joescoffee.com"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2"><Icons.Phone /></span>
                    <input
                      type="tel"
                      value={business.phone}
                      onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-[#2C9DA6] focus:ring-1 focus:ring-[#2C9DA6] transition-all placeholder-gray-400"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Address */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-gray-700 ml-1">Physical Address</label>
                <textarea
                  value={business.address}
                  onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                  rows="2"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-[#2C9DA6] focus:ring-1 focus:ring-[#2C9DA6] transition-all placeholder-gray-400 resize-none"
                  placeholder="123 Main St, Springfield, IL 62704"
                />
              </div>

              {/* Separator */}
              <div className="pt-2 pb-2">
                 <div className="h-px bg-gray-100"></div>
              </div>

              {/* Regional Settings Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-4">Regional Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-400 ml-1 uppercase tracking-wide">Currency</label>
                        <div className="relative">
                            <select 
                                value={business.currency}
                                onChange={(e) => setBusiness({ ...business, currency: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 appearance-none focus:outline-none focus:border-[#2C9DA6] focus:ring-1 focus:ring-[#2C9DA6] cursor-pointer"
                            >
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                                <option>INR (₹)</option>
                            </select>
                             <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4"/></svg>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-gray-400 ml-1 uppercase tracking-wide">Timezone</label>
                        <div className="relative">
                            <select 
                                value={business.timezone}
                                onChange={(e) => setBusiness({ ...business, timezone: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 appearance-none focus:outline-none focus:border-[#2C9DA6] focus:ring-1 focus:ring-[#2C9DA6] cursor-pointer"
                            >
                                <option>(GMT-05:00) Eastern Time (US & Canada)</option>
                                <option>(GMT+00:00) UTC</option>
                                <option>(GMT+05:30) India Standard Time</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m1 1 4 4 4-4"/></svg>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

            </div>
          </div>
          
          {/* Action Footer */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex justify-end items-center gap-4">
            <button 
                type="button" 
                onClick={() => fetchBusiness()}
                className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
                Cancel Changes
            </button>
            <button 
                type="submit" 
                disabled={saving}
                className="px-6 py-2.5 bg-[#2C9DA6] hover:bg-[#25858d] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#2C9DA6]/30 flex items-center gap-2 transition-all active:scale-[0.98]"
            >
                {saving ? (
                    'Saving...'
                ) : (
                    <>
                        <Icons.Save /> Update Settings
                    </>
                )}
            </button>
          </div>

        </div>
      </form>

      {/* Toast Message */}
      {message && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-xl shadow-2xl transform transition-all duration-300 z-50 flex items-center gap-3 ${message.includes('success') ? 'bg-gray-900 text-white' : 'bg-red-500 text-white'}`}>
          <span className="text-xl">{message.includes('success') ? '✅' : '❌'}</span>
          <p className="font-medium text-sm">{message}</p>
        </div>
      )}

    </div>
  );
};

export default BusinessSettings;