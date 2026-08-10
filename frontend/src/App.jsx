import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { fetchCurrentUser } from "./store/slices/authSlices";
import { useDispatch } from "react-redux";
import { config } from "./config/config";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const OtpVerification = lazy(() => import("./pages/auth/OtpVerification"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const SubCategories = lazy(() => import("./pages/admin/SubCategories"));
const Brands = lazy(() => import("./pages/admin/Brands"));
const Attributes = lazy(() => import("./pages/admin/Attributes"));
const AttributeValues = lazy(() => import("./pages/admin/AttributeValues"));
const Products = lazy(() => import("./pages/admin/Products"));
const ProductVariants = lazy(() => import("./pages/admin/ProductVariants"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem(config.TOKEN_KEY);
    if (token) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/otp" element={<OtpVerification />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<SubCategories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="attributes" element={<Attributes />} />
            <Route path="attribute-values" element={<AttributeValues />} />
            <Route path="products" element={<Products />} />
            <Route path="variants" element={<ProductVariants />} />
          </Route>

          <Route path="/" element={<Login />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
