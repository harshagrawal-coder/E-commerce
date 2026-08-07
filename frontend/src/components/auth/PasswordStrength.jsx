function getStrength(value) {
  if (!value) return { score: 0, label: '', color: '' }
  let score = 0
  if (value.length >= 8) score += 1
  if (value.length >= 12) score += 1
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1

  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500', text: 'text-red-600' }
  if (score === 2) return { score, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' }
  if (score <= 4) return { score, label: 'Good', color: 'bg-primary', text: 'text-primary-600' }
  return { score: 5, label: 'Strong', color: 'bg-green-500', text: 'text-green-600' }
}
function PasswordStrength({ value }) {
  const { score, label, color, text } = getStrength(value)
  const bars = 5
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex items-center gap-1">
        {Array.from({ length: bars }).map((_, index) => (
          <span
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-200 ease-out ${
              index < score ? color : 'bg-border'
            }`}
          />
        ))}
      </div>
      {value && (
        <p className={`mt-1.5 text-xs font-medium ${text}`}>Password strength: {label}</p>
      )}
    </div>
  )
}

export default PasswordStrength
