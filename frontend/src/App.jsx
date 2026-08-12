import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
const ProductAdd = lazy(() => import("./pages/admin/ProductAdd"));
const ProductEdit = lazy(() => import("./pages/admin/ProductEdit"));
const ProductDetailsPage = lazy(() => import("./pages/admin/ProductDetailsPage"));
const VariantAdd = lazy(() => import("./pages/admin/VariantAdd"));
const VariantEdit = lazy(() => import("./pages/admin/VariantEdit"));

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
            <Route path="products/new" element={<ProductAdd />} />
            <Route path="products/:id" element={<ProductDetailsPage />} />
            <Route path="products/:id/edit" element={<ProductEdit />} />
            <Route path="products/:id/variants/new" element={<VariantAdd />} />
            <Route path="products/:id/variants/:variantId/edit" element={<VariantEdit />} />
            <Route path="*" element={<Navigate to="/admin/products" replace />} />
          </Route>

          <Route path="/" element={<Login />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
