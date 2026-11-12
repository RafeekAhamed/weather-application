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
} from 'lucide-react'
import { useTheme } from '../context/useTheme'
import './Login.css'
import SocialAuthButtons from '../components/SocialAuthButtons'
import AuthWeatherBackground from '../components/AuthWeatherBackground'

const CURRENT_YEAR = new Date().getFullYear()

function Login() {
  const { isNight, setTheme } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [message, setMessage] = useState('')

  function handleSocialClick(provider: string) {
    setMessage(
      `${provider} sign-in will be enabled after secure OAuth backend integration.`,
    )
  }
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(
      'The login interface is ready. Secure account authentication will be connected in the backend phase.',
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
          <span>SkyCast<span className="brand-light"> Weather</span></span>
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
            <p className="auth-eyebrow">WELCOME BACK</p>
            <h1>Sign in to SkyCast</h1>
            <p className="auth-description">
              Your weather dashboard, forecasts and air quality information
              are waiting for you.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Email address</label>
            <div className="auth-input-wrapper">
              <Mail size={18} />
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-password-heading">
              <label htmlFor="login-password">Password</label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <div className="auth-input-wrapper">
              <LockKeyhole size={18} />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
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

            <label className="auth-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Remember me</span>
            </label>

            <button type="submit" className="auth-submit-button">
              Sign in
            </button>

            {message && (
              <p className="auth-status-message" role="status">
                {message}
              </p>
            )}
          </form>

          <SocialAuthButtons onProviderClick={handleSocialClick} />

          <div className="auth-divider">
            <span>NEW TO SKYCAST?</span>
          </div>

          <p className="auth-signup-prompt">
            Don't have an account? <Link to="/signup">Create account</Link>
          </p>

          <p className="auth-security-note">
            Your account security matters. Secure authentication will be
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

export default Login