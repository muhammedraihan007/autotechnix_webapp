import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Services from './pages/Services'
import Login from './pages/Login'
import Register from './pages/Register'
import BookAppointment from './pages/BookAppointment'
import MyBookings from './pages/MyBookings'
import BookingDetail from './pages/BookingDetail'
import MyVehicles from './pages/MyVehicles'
import MyInvoices from './pages/MyInvoices'
import Profile from './pages/Profile'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading"><div className="spinner"/></div>
  return user ? children : <Navigate to="/login" replace />
}
function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading"><div className="spinner"/></div>
  return user ? <Navigate to="/" replace /> : children
}
function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/book" element={<PrivateRoute><BookAppointment /></PrivateRoute>} />
        <Route path="/bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
        <Route path="/bookings/:id" element={<PrivateRoute><BookingDetail /></PrivateRoute>} />
        <Route path="/vehicles" element={<PrivateRoute><MyVehicles /></PrivateRoute>} />
        <Route path="/invoices" element={<PrivateRoute><MyInvoices /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
export default function App() {
  const [loaded, setLoaded] = useState(false)
  return (
    <AuthProvider>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
      {loaded && <AppRoutes />}
    </AuthProvider>
  )
}
