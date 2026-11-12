import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  CloudSun,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Moon,
  Sun,
  UserRound,
} from 'lucide-react'
import { useTheme } from '../context/useTheme'
import './Login.css'
import SocialAuthButtons from '../components/SocialAuthButtons'
import AuthWeatherBackground from '../components/AuthWeatherBackground'

const CURRENT_YEAR = new Date().getFullYear()

function Signup() {
  const { isNight, setTheme } = useTheme()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [message, setMessage] = useState('')

  function handleSocialClick(provider: string) {
    setMessage(
      `${provider} sign-in will be enabled after secure OAuth backend integration.`,
    )
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    if (password.length < 8) {
      setMessage('Password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match. Please check and try again.')
      return
    }

    if (!acceptedTerms) {
      setMessage('Please accept the terms and conditions to continue.')
      return
    }

    setMessage(
      'Your registration form is ready. Account creation will be enabled when secure backend authentication is integrated.',
    )
  }

  return (
    <main className={`auth-page ${isNight ? 'night-theme' : 'light-theme'}`}>
      <AuthWeatherBackground />
      <div className="auth-topbar">
        <Link to="/" className="auth-brand" aria-label="SkyCast home">
          <span className="auth-brand-icon">
            <CloudSun size={25} />
          </span>
          <span>
            SkyCast<span className="brand-light"> Weather</span>
          </span>
        </Link>

        <div className="auth-topbar-actions">
          <span className="auth-theme-label">
            {isNight ? 'Dark mode' : 'Light mode'}
          </span>

          <button
            type="button"
            className="auth-theme-button"
            onClick={() => setTheme(isNight ? 'light' : 'dark')}
            aria-label={`Switch to ${isNight ? 'light' : 'dark'} theme`}
          >
            {isNight ? <Sun size={19} /> : <Moon size={19} />}
          </button>
        </div>
      </div>

      <section className="auth-content">
        <div className="auth-card">
          <Link to="/" className="auth-back-link">
            <ArrowLeft size={16} />
            Back to weather
          </Link>

          <div className="auth-heading">
            <div className="auth-heading-icon">
              <CloudSun size={30} />
            </div>

            <p className="auth-eyebrow">JOIN SKYCAST</p>

            <h1>Create your account</h1>

            <p className="auth-description">
              Sign up to get started with your personal weather dashboard,
              forecasts and air quality updates.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="signup-name">Full name</label>

            <div className="auth-input-wrapper">
              <UserRound size={18} />

              <input
                id="signup-name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <label htmlFor="signup-email">Email address</label>

            <div className="auth-input-wrapper">
              <Mail size={18} />

              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <label htmlFor="signup-password">Password</label>

            <div className="auth-input-wrapper">
              <LockKeyhole size={18} />

              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label htmlFor="signup-confirm-password">
              Confirm password
            </label>

            <div className="auth-input-wrapper">
              <LockKeyhole size={18} />

              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() =>
                  setShowConfirmPassword((current) => !current)
                }
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirm password'
                    : 'Show confirm password'
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            <label className="auth-remember">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
              <span>I agree to the terms and conditions.</span>
            </label>

            <button type="submit" className="auth-submit-button">
              Create account
            </button>

            {message && (
              <p className="auth-status-message" role="status">
                {message}
              </p>
            )}
          </form>

          <SocialAuthButtons onProviderClick={handleSocialClick} />

          <div className="auth-divider">
            <span>ALREADY REGISTERED?</span>
          </div>

          <p className="auth-signup-prompt">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <p className="auth-security-note">
            Your account security matters. Secure registration will be
            enabled when the backend is integrated.
          </p>
        </div>
      </section>

      <footer className="auth-footer">
        <span>© {CURRENT_YEAR} SkyCast Weather</span>
        <span>Weather information, made simple.</span>
      </footer>
    </main>
  )
}

export default Signup