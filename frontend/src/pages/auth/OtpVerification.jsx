import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, RefreshCw, ArrowLeft } from 'lucide-react'
import AuthLayout from '../../components/auth/AuthLayout'
import Button from '../../components/ui/Button'
import ErrorAlert from '../../components/ui/ErrorAlert'
import SuccessAlert from '../../components/ui/SuccessAlert'

const OTP_LENGTH = 6

function OtpVerification() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [verified, setVerified] = useState(false)
  const inputsRef = useRef([])

  useEffect(() => {
    inputsRef.current[0]?.focus()
  }, [])
  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    setError('')

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!digits) return
    const next = Array(OTP_LENGTH).fill('')
    digits.split('').forEach((d, i) => {
      next[i] = d
    })
    setOtp(next)
    setError('')
    inputsRef.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (otp.some((d) => !d)) {
      setError('Please enter the complete 6-digit code.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setVerified(true)
    }, 1200)
  }

  const handleResend = () => {
    setError('')
    setResending(true)
    setTimeout(() => setResending(false), 1200)
  }

  if (verified) {
    return (
      <AuthLayout>
        <div className="rounded-xl border border-border bg-white p-8 text-center shadow-lg shadow-ink/5">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 text-green-600">
            <ShieldCheck size={28} />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-ink">Verified!</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Your account has been verified successfully.
          </p>
          <Button fullWidth className="mt-8" onClick={() => {}}>
            Continue to dashboard
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <div className="rounded-xl border border-border bg-white p-8 shadow-lg shadow-ink/5">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
            <ShieldCheck size={28} />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-ink">Two-factor verification</h2>
          <p className="mt-2 text-sm text-ink-muted">
            Enter the 6-digit code sent to your email or phone to continue.
          </p>
        </div>

        <ErrorAlert message={error} className="mt-6" />
        <SuccessAlert
          message={resending ? 'New code sent successfully.' : ''}
          className="mt-6"
        />

        <form onSubmit={handleSubmit} noValidate className="mt-8">
          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                aria-label={`Digit ${index + 1}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={[
                  'h-14 w-full max-w-14 rounded-xl border bg-white text-center text-lg font-semibold text-ink',
                  'shadow-sm transition-colors duration-200 ease-out',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/25'
                    : 'border-border hover:border-ink-muted/40 focus:border-primary-600 focus:ring-primary-600/25',
                ].join(' ')}
              />
            ))}
          </div>

          <Button type="submit" fullWidth loading={loading} className="mt-8">
            {loading ? 'Verifying...' : 'Verify code'}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-muted">
          Didn&apos;t receive the code?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="inline-flex items-center gap-1.5 font-medium text-primary-600 transition-colors duration-200 hover:text-primary-700 disabled:opacity-60"
          >
            <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
            Resend
          </button>
        </div>

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

export default OtpVerification
