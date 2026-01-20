import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import OAuth2RedirectHandler from "../pages/auth/OAuth2RedirectHandler";
import DashboardLayout from "../components/layout/DashboardLayout";
import { Dashboard } from "../pages/dashboard/Dashboard";
import InventoryList from "../pages/inventory/InventoryList";
import AddProduct from "../pages/inventory/AddProduct";
import EditProduct from "../pages/inventory/EditProduct";
import Customers from "../pages/customers/Customers";
import InvoiceList from "../pages/invoices/InvoiceList";
import CreateInvoice from "../pages/invoices/CreateInvoice";
import { InvoiceDetails } from "../pages/invoices/InvoiceDetails";
import StaffManagement from "../pages/staff/StaffManagement";
import BusinessSettings from "../pages/settings/BusinessSettings";
import { Home } from "../pages/auth/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  return user ? children : <Navigate to="/home" />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route
          path="inventory"
          element={
            <RoleRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <InventoryList />
            </RoleRoute>
          }
        />
        <Route
          path="inventory/add"
          element={
            <RoleRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <AddProduct />
            </RoleRoute>
          }
        />
        <Route
          path="inventory/edit/:id"
          element={
            <RoleRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <EditProduct />
            </RoleRoute>
          }
        />
        <Route path="customers" element={<Customers />} />
        <Route path="invoices" element={<InvoiceList />} />
        <Route path="invoices/create" element={<CreateInvoice />} />
        <Route path="invoices/:id" element={<InvoiceDetails />} />
        <Route
          path="staff"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <StaffManagement />
            </RoleRoute>
          }
        />
        <Route
          path="settings"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <BusinessSettings />
            </RoleRoute>
          }
        />
        <Route
          path="admin"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <UserManagement />
            </RoleRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
