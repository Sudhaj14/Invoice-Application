import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/Auth/SignUp";
import Login from "./pages/Auth/Login";

import Dashboard from "./pages/Dashboard/Dashboard";
import AllInvoices from "./pages/Invoices/AllInvoices";
import CreateInvoice from "./pages/Invoices/CreateInvoice";
import InvoiceDetail from "./pages/Invoices/InvoiceDetail";
import ProfilePage from "./pages/Profile/ProfilePage";

import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";


// ✅ Smart Home Redirect (VERY IMPORTANT)
const HomeRedirect = () => {
  const { user } = useAuth();

  return user ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>

        {/* Cosmic Notifications */}
        <Toaster 
          position="top-right" 
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(20, 20, 30, 0.8)',
              color: '#fff',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              borderRadius: '16px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            },
            success: {
              iconTheme: {
                primary: '#00E5FF',
                secondary: '#050505',
              },
              style: {
                border: '1px solid rgba(0, 229, 255, 0.3)',
              }
            },
            error: {
              iconTheme: {
                primary: '#FF4D9D',
                secondary: '#050505',
              },
              style: {
                border: '1px solid rgba(255, 77, 157, 0.3)',
              }
            }
          }}
        />

        <Routes>
          <Route path="/" element={<HomeRedirect />} />

          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/invoices" element={<AllInvoices />} />
              <Route path="/invoices/new" element={<CreateInvoice />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </Router>
    </AuthProvider>
  );
};
export default App;