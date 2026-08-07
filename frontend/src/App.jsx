import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import VerifyEmail from './pages/auth/VerifyEmail'
import OtpVerification from './pages/auth/OtpVerification'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Categories from './pages/admin/Categories'
import SubCategories from './pages/admin/SubCategories'
import Brands from './pages/admin/Brands'
import Attributes from './pages/admin/Attributes'
import AttributeValues from './pages/admin/AttributeValues'
import Products from './pages/admin/Products'
import ProductVariants from './pages/admin/ProductVariants'

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
}

export default App
