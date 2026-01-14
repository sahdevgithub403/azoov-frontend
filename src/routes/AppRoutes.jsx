import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import DashboardLayout from '../components/layout/DashboardLayout';
import Dashboard from '../pages/dashboard/Dashboard';
import InventoryList from '../pages/inventory/InventoryList';
import AddProduct from '../pages/inventory/AddProduct';
import Customers from '../pages/customers/Customers';
import InvoiceList from '../pages/invoices/InvoiceList';
import CreateInvoice from '../pages/invoices/CreateInvoice';
import InvoiceDetails from '../pages/invoices/InvoiceDetails';
import StaffManagement from '../pages/staff/StaffManagement';
import BusinessSettings from '../pages/settings/BusinessSettings';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<InventoryList />} />
        <Route path="inventory/add" element={<AddProduct />} />
        <Route path="customers" element={<Customers />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="invoices/create" element={<CreateInvoice />} />
        <Route path="invoices/:id" element={<InvoiceDetails />} />
        <Route path="staff" element={<StaffManagement />} />
        <Route path="settings" element={<BusinessSettings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
