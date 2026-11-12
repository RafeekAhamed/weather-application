function AuthWeatherBackground() {
  return (
    <div className="auth-weather-background" aria-hidden="true">
      <div className="auth-sky-glow" />

      <div className="auth-sun">
        <span className="auth-sun-rays" />
      </div>

      <div className="auth-moon">
        <span />
      </div>

      <div className="auth-stars">
        {Array.from({ length: 18 }, (_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="auth-cloud auth-cloud-one" />
      <div className="auth-cloud auth-cloud-two" />
      <div className="auth-cloud auth-cloud-three" />

      <div className="auth-sky-haze" />
    </div>
  )
}

export default AuthWeatherBackground