function GoogleIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M21.35 11.1H12v2.9h5.35c-.4 2.16-2.13 3.6-4.4 3.6-2.7 0-4.9-2.2-4.9-4.9s2.2-4.9 4.9-4.9c1.2 0 2.3.45 3.15 1.2l2.1-2.1A7.9 7.9 0 0 0 12 4C7.6 4 4 7.6 4 12s3.6 8 8 8c4.4 0 8-3.6 8-8 0-.6-.05-1.1-.15-1.6Z"
        fill="#4285F4"
      />
      <path
        d="M4 12c0-.95.25-1.84.7-2.65l3.1 2.4A4.9 4.9 0 0 0 12 16.85v-2.9H8.85A5 5 0 0 1 4 12Z"
        fill="#34A853"
      />
      <path
        d="M7.05 7.55A8 8 0 0 1 12 4c1.9 0 3.65.7 5 1.85l-2.1 2.1a4.9 4.9 0 0 0-5.25-.95L7.05 7.55Z"
        fill="#FBBC05"
      />
      <path
        d="M4 12c0 .5.08 1 .23 1.45l3.1-2.4c.23.28.5.5.8.66A4.9 4.9 0 0 0 7.05 7.55L4.7 9.35A8 8 0 0 0 4 12Z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default GoogleIcon
