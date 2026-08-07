import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import PasswordStrength from '../../components/auth/PasswordStrength'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import SuccessAlert from '../../components/ui/SuccessAlert'
import ErrorAlert from '../../components/ui/ErrorAlert'

function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const next = {}
    if (!form.password) {
      next.password = 'Password is required'
    } else if (form.password.length < 8) {
      next.password = 'Password must be at least 8 characters'
    }
    if (!form.confirmPassword) {
      next.confirmPassword = 'Please confirm your password'
    } else if (form.confirmPassword !== form.password) {
      next.confirmPassword = 'Passwords do not match'
    }
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1200)
  }

  return (
    <AuthLayout>
      <div className="rounded-xl border border-border bg-white p-8 shadow-lg shadow-ink/5">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-ink">Reset password</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Choose a new password for your account.
          </p>
        </div>

        {success ? (
          <div className="space-y-6">
            <SuccessAlert message="Your password has been reset successfully." />
            <Button fullWidth onClick={() => navigate('/login')}>
              Back to login
            </Button>
          </div>
        ) : (
          <>
            {!token && <ErrorAlert message="Reset token is missing from the URL." className="mb-6" />}
            <ErrorAlert message={error} className="mb-6" />

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    label="New Password"
                    placeholder="Enter a new password"
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm New Password"
                  placeholder="Re-enter the new password"
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
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-[42px] rounded-lg p-1 text-ink-muted transition-colors duration-200 hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/25"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <Button type="submit" fullWidth loading={loading} disabled={!token}>
                {loading ? 'Resetting...' : 'Reset password'}
              </Button>
            </form>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors duration-200 hover:text-primary-700"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>
          </>
        )}
      </div>
    </AuthLayout>
  )
}

export default ResetPassword
