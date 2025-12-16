import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';
import { ThemeProvider } from '@mui/material/styles';
import { darkTheme } from './theme';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import NotificationProvider from './components/NotificationProvider';
import ProtectedRoute from './components/ProtectedRoute';

// Import all pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/customer/UserProfile';
import AddCar from './pages/AddCar';
import MyCars from './pages/customer/MyCars';
import EditCar from './pages/EditCar';
import CreateJob from './pages/CreateJob';
import TrackJob from './pages/TrackJob';
import CarServiceHistory from './pages/customer/CarServiceHistory';
import JobDetails from './pages/admin/JobDetails';
import CreateInvoice from './pages/admin/CreateInvoice';
import BreakdownAssistance from './pages/customer/BreakdownAssistance';
import BreakdownRequests from './pages/admin/BreakdownRequests';

function App(){
  return (
    <ThemeProvider theme={darkTheme}>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider />
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<Login/>} />
              <Route path='/login' element={<Login/>} />
              <Route path='/register' element={<Register/>} />

              {/* Protected Routes */}
              <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
              <Route path='/profile' element={<ProtectedRoute><UserProfile/></ProtectedRoute>} />
              <Route path='/add-car' element={<ProtectedRoute><AddCar/></ProtectedRoute>} />
              <Route path='/my-cars' element={<ProtectedRoute><MyCars/></ProtectedRoute>} />
              <Route path='/my-cars/:carId/history' element={<ProtectedRoute><CarServiceHistory/></ProtectedRoute>} />
              <Route path='/edit-car/:id' element={<ProtectedRoute><EditCar/></ProtectedRoute>} />
              <Route path='/create-job' element={<ProtectedRoute><CreateJob/></ProtectedRoute>} />
              <Route path='/track-job' element={<ProtectedRoute><TrackJob/></ProtectedRoute>} />
              <Route path='/job/:id' element={<ProtectedRoute><JobDetails/></ProtectedRoute>} />
              <Route path='/job/:jobId/create-invoice' element={<ProtectedRoute><CreateInvoice/></ProtectedRoute>} />
              <Route path='/breakdown-assistance' element={<ProtectedRoute><BreakdownAssistance/></ProtectedRoute>} />
              <Route path='/admin/breakdown-requests' element={<ProtectedRoute><BreakdownRequests/></ProtectedRoute>} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);