import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { fetchCurrentUser } from "./store/slices/authSlices";
import { useDispatch, useSelector } from "react-redux";
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
const PendingVariants = lazy(() => import("./pages/admin/PendingVariants"));
const Vendors = lazy(() => import("./pages/admin/Vendors"));
const VendorDetails = lazy(() => import("./pages/admin/VendorDetails"));
const VendorLayout = lazy(() => import("./components/vendor/VendorLayout"));
const VendorDashboard = lazy(() => import("./pages/vendor/VendorDashboard"));
const VendorProducts = lazy(() => import("./pages/vendor/VendorProducts"));
const VendorProductAdd = lazy(() => import("./pages/vendor/VendorProductAdd"));
const VendorProductEdit = lazy(() => import("./pages/vendor/VendorProductEdit"));
const VendorProductDetailsPage = lazy(() =>
  import("./pages/vendor/VendorProductDetailsPage"),
);
const VendorVariantAdd = lazy(() => import("./pages/vendor/VendorVariantAdd"));
const VendorVariantEdit = lazy(() =>
  import("./pages/vendor/VendorVariantEdit"),
);

function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, isInitialized } = useSelector((state) => state.auth);
  
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (user.role === "vendor") {
      return <Navigate to="/vendor" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}

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

          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="subcategories" element={<SubCategories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="vendors/:id" element={<VendorDetails />} />
            <Route path="attributes" element={<Attributes />} />
            <Route path="attribute-values" element={<AttributeValues />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductAdd />} />
            <Route path="products/:id" element={<ProductDetailsPage />} />
            <Route path="products/:id/edit" element={<ProductEdit />} />
            <Route path="products/:id/variants/new" element={<VariantAdd />} />
            <Route path="products/:id/variants/:variantId/edit" element={<VariantEdit />} />
            <Route path="variants/pending" element={<PendingVariants />} />
            <Route path="*" element={<Navigate to="/admin/products" replace />} />
          </Route>

          <Route path="/vendor" element={
            <ProtectedRoute allowedRoles={["vendor"]}>
              <VendorLayout />
            </ProtectedRoute>
          }>
            <Route index element={<VendorDashboard />} />
            <Route path="products" element={<VendorProducts />} />
            <Route path="products/new" element={<VendorProductAdd />} />
            <Route path="products/:id" element={<VendorProductDetailsPage />} />
            <Route path="products/:id/edit" element={<VendorProductEdit />} />
            <Route path="products/:id/variants/new" element={<VendorVariantAdd />} />
            <Route
              path="products/:id/variants/:variantId/edit"
              element={<VendorVariantEdit />}
            />
            <Route path="*" element={<Navigate to="/vendor" replace />} />
          </Route>

          <Route path="/" element={<Login />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
