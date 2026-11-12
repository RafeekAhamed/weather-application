interface SocialAuthButtonsProps {
  onProviderClick: (provider: string) => void
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.7c3.9-3.6 6-8.8 6-15Z" />
      <path fill="#34A853" d="M24 44c5.4 0 9.9-1.8 13.2-4.8l-6.7-5.1c-1.8 1.2-4 1.9-6.5 1.9-5 0-9.2-3.4-10.7-8H6.4v5.3A20 20 0 0 0 24 44Z" />
      <path fill="#FBBC05" d="M13.3 28a12 12 0 0 1 0-8V14.7H6.4a20 20 0 0 0 0 18.6l6.9-5.3Z" />
      <path fill="#EA4335" d="M24 12c2.9 0 5.5 1 7.6 3.1l5.7-5.7C33.9 6.1 29.4 4 24 4A20 20 0 0 0 6.4 14.7l6.9 5.3c1.5-4.6 5.7-8 10.7-8Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52c0-.84-.69-1.52-1.55-1.52ZM7.93 18.46H4.96V9h2.97v9.46ZM6.45 7.71a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.01 10.75h-2.97v-4.6c0-1.1-.02-2.51-1.53-2.51-1.53 0-1.77 1.2-1.77 2.43v4.68H9.22V9h2.85v1.29h.04c.4-.75 1.37-1.53 2.82-1.53 3.01 0 3.56 1.98 3.56 4.56v5.14Z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.4l7.3-8.4L1.9 2h6.5l4.4 6.9L18.9 2Zm-1.1 18h1.7L7.4 3.9H5.6L17.8 20Z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M24 12a12 12 0 1 0-13.88 11.86v-8.4H7.08V12h3.04V9.36c0-3 1.79-4.66 4.52-4.66 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.92-1.95 1.86V12h3.32l-.53 3.46h-2.79v8.4A12 12 0 0 0 24 12Z" />
    </svg>
  )
}

const providers = [
  { name: 'Google', className: 'social-google', Icon: GoogleIcon },
  { name: 'LinkedIn', className: 'social-linkedin', Icon: LinkedInIcon },
  { name: 'Instagram', className: 'social-instagram', Icon: InstagramIcon },
  { name: 'X', className: 'social-x', Icon: XIcon },
  { name: 'Facebook', className: 'social-facebook', Icon: FacebookIcon },
]

function SocialAuthButtons({ onProviderClick }: SocialAuthButtonsProps) {
  return (
    <section className="social-auth-section" aria-label="Social sign in">
      <div className="social-auth-divider">
        <span>OR CONTINUE WITH</span>
      </div>

      <div className="social-auth-grid">
        {providers.map(({ name, className, Icon }) => (
          <button
            key={name}
            type="button"
            className="social-auth-button"
            aria-label={`Continue with ${name}`}
            title={name}
            onClick={() => onProviderClick(name)}
          >
            <span className={`social-brand-mark ${className}`}>
              <Icon />
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default SocialAuthButtons