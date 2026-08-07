import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordStrength from "../../components/auth/PasswordStrength";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Checkbox from "../../components/ui/Checkbox";
import Divider from "../../components/ui/Divider";
import ErrorAlert from "../../components/ui/ErrorAlert";
import GoogleIcon from "../../components/auth/GoogleIcon";
import { config } from "../../config/config";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!form.email) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }
    if (!form.phone) {
      next.phone = "Phone number is required";
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(form.phone)) {
      next.phone = "Enter a valid phone number";
    }
    if (!form.password) {
      next.password = "Password is required";
    } else if (form.password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }
    if (!form.confirmPassword) {
      next.confirmPassword = "Please confirm your password";
    } else if (form.confirmPassword !== form.password) {
      next.confirmPassword = "Passwords do not match";
    }
    if (!acceptTerms)
      next.acceptTerms = "You must accept the terms & conditions";
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${config.API_URI}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }
      localStorage.setItem(config.TOKEN_KEY, data.token);
      localStorage.setItem(config.USER_KEY, JSON.stringify(data.user));
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="rounded-xl border border-border bg-white p-8 shadow-lg shadow-ink/5">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Join CommerceHub to start managing your store
          </p>
        </div>

        <ErrorAlert message={error} className="mb-6" />

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="firstName"
              name="firstName"
              type="text"
              label="First Name"
              placeholder="John"
              autoComplete="given-name"
              value={form.firstName}
              onChange={handleChange}
              error={errors.firstName}
              icon={<User size={16} />}
            />
            <Input
              id="lastName"
              name="lastName"
              type="text"
              label="Last Name"
              placeholder="Doe"
              autoComplete="family-name"
              value={form.lastName}
              onChange={handleChange}
              error={errors.lastName}
              icon={<User size={16} />}
            />
          </div>

          <Input
            id="email"
            name="email"
            type="email"
            label="Email address"
            placeholder="you@company.com"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
            icon={<Mail size={16} />}
          />

          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Phone"
            placeholder="+1 555 123 4567"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
            icon={<Phone size={16} />}
          />

          <div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Create a password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock size={16} />}
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-[42px] rounded-lg p-1 text-ink-muted transition-colors duration-200 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/25"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <PasswordStrength value={form.password} />
          </div>

          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              placeholder="Re-enter your password"
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock size={16} />}
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute right-3 top-[42px] rounded-lg p-1 text-ink-muted transition-colors duration-200 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/25"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div>
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              label={
                <span className="text-sm text-ink-muted">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="font-medium text-primary-600 hover:text-primary-700"
                  >
                    Privacy Policy
                  </Link>
                </span>
              }
              error={errors.acceptTerms}
            />
          </div>

          <Button type="submit" fullWidth loading={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <Divider className="my-6">OR</Divider>

        <Button variant="secondary" fullWidth>
          <GoogleIcon size={16} />
          Sign up with Google
        </Button>

        <p className="mt-8 text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-600 transition-colors duration-200 hover:text-primary-700"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Register;
