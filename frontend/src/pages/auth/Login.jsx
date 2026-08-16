import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Checkbox from "../../components/ui/Checkbox";
import Divider from "../../components/ui/Divider";
import ErrorAlert from "../../components/ui/ErrorAlert";
import GoogleIcon from "../../components/auth/GoogleIcon";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/slices/authSlices";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { loading, error, user } = useSelector((state) => state.auth);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.email) {
      next.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }
    if (!form.password) {
      next.password = "Password is required";
    }
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const next = validate();
    setErrors(next);

    if (Object.keys(next).length) return;

    try {
      const response = await dispatch(loginUser(form)).unwrap();
      if (response.user.role === "admin") {
        navigate("/admin");
      } else if (response.user.role === "vendor") {
        navigate("/vendor");
      } else {
        navigate("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout>
      <div className="rounded-xl border border-border bg-white p-8 shadow-lg shadow-ink/5">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-ink">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-ink-muted">
            Sign in to your account to continue
          </p>
        </div>

        <ErrorAlert message={error} className="mb-6" />

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

          <div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="Enter your password"
                autoComplete="current-password"
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
          </div>

          <div className="flex items-center justify-between">
            <Checkbox
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              label="Remember me"
            />
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary-600 transition-colors duration-200 hover:text-primary-700"
            >
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <Divider className="my-6">OR</Divider>

        <Button variant="secondary" fullWidth>
          <GoogleIcon size={16} />
          Continue with Google
        </Button>

        <p className="mt-8 text-center text-sm text-ink-muted">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-primary-600 transition-colors duration-200 hover:text-primary-700"
          >
            Register
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Login;
