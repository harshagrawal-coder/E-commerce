import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MailCheck, RefreshCw, ArrowLeft } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import Button from '../../components/ui/Button'
import SuccessAlert from '../../components/ui/SuccessAlert'
import ErrorAlert from '../../components/ui/ErrorAlert'

function VerifyEmail() {
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const email = 'user@example.com'

  const handleResend = () => {
    setError('')
    setResending(true)
    setTimeout(() => {
      setResending(false)
      setSent(true)
    }, 1200)
  }

  return (
    <AuthLayout>
      <div className="rounded-xl border border-border bg-white p-8 shadow-lg shadow-ink/5">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <MailCheck size={28} />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-ink">Verify your email</h2>
          <p className="mt-2 text-sm text-ink-muted">
            We&apos;ve sent a verification link to{' '}
            <span className="font-medium text-ink">{email}</span>. Click the link in the email to
            activate your account.
          </p>
        </div>

        <ErrorAlert message={error} className="mt-6" />
        <SuccessAlert
          message={sent ? 'Verification email resent successfully.' : ''}
          className="mt-6"
        />

        <div className="mt-8 space-y-3">
          <Button type="button" fullWidth loading={loading} onClick={() => setLoading(true)}>
            {loading ? 'Opening inbox...' : 'Open email inbox'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            loading={resending}
            onClick={handleResend}
          >
            {!resending && <RefreshCw size={16} />}
            {resending ? 'Resending...' : 'Resend verification email'}
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-ink-muted">
          Didn&apos;t get the email?{' '}
          <button
            type="button"
            onClick={handleResend}
            className="font-medium text-primary-600 transition-colors duration-200 hover:text-primary-700"
          >
            Resend it
          </button>
        </p>

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-2 text-sm font-medium text-ink-muted transition-colors duration-200 hover:text-ink"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>
      </div>
    </AuthLayout>
  )
}

export default VerifyEmail
