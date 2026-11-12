import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import WeatherDashboard from './WeatherDashboard'
import ExploreWeather from './pages/ExploreWeather'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/explore" element={<ExploreWeather />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<WeatherDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App