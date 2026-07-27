import { Routes, Route } from "react-router-dom";
import Home from "./pages/common/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CustomerDashboard from "./pages/Customer/CustomerDashboard";
import CookDashboard from "./pages/Cook/CookDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ProtectedRoute from "./routes/ProtectedRoutes";
import BrowseCooks from "./pages/Customer/BrowseCooks";
import CookDetails from "./pages/Customer/CookDetails";
import OrderPage from "./pages/Customer/OrderDetails"
import MyOrders from "./pages/Customer/MyOrders";
import MySubscriptionsPage from "./pages/Customer/MySubscriptions";
import {Toaster} from "react-hot-toast";
function App(){
  return(
    <>
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/customer/dashboard"
        element={
          <ProtectedRoute role="customer">
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
      path="/orders"
      element={<MyOrders/>}
      />
      <Route 
         path="/subscriptions"
         element={<MySubscriptionsPage />}
      />
      <Route
        path="/cook/dashboard"
        element={
          <ProtectedRoute role="cook">
            <CookDashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/cook/:id"
        element={<CookDetails />}
      />
      <Route path="/order/:id" element={<OrderPage />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/browse-cooks"
        element={<BrowseCooks/>}
      />
    </Routes>
    </>
  )
};
export default App;