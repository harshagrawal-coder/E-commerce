import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import SuccessAlert from '../../components/ui/SuccessAlert'
import ErrorAlert from '../../components/ui/ErrorAlert'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) {
      setFieldError('Email is required')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError('Enter a valid email address')
      return
    }
    setFieldError('')
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1200)
  }

  return (
    <AuthLayout>
      <div className="rounded-xl border border-border bg-white p-8 shadow-lg shadow-ink/5">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-ink">Forgot password?</h2>
          <p className="mt-2 text-sm text-ink-muted">
            No worries, we&apos;ll send you reset instructions. Enter the email associated with
            your account.
          </p>
        </div>

        {sent ? (
          <div className="space-y-6">
            <SuccessAlert message={`Reset link sent to ${email}. Check your inbox.`} />
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 transition-colors duration-200 hover:text-primary-700"
            >
              <ArrowLeft size={16} />
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <ErrorAlert message={error} className="mb-6" />
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                placeholder="you@company.com"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setFieldError('')
                }}
                error={fieldError}
                icon={<Mail size={16} />}
              />
              <Button type="submit" fullWidth loading={loading}>
                {loading ? 'Sending link...' : 'Send reset link'}
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

export default ForgotPassword
