import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from './admin/AdminDashboard';
import CustomerDashboard from './customer/CustomerDashboard';
import { Box, Typography } from '@mui/material';
import Loader from '../components/Loader';

export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Loader />
      </Box>
    );
  }

  if (user?.role === 'admin') {
    return <AdminDashboard />;
  }
  
  if (user?.role === 'customer') {
    return <CustomerDashboard />;
  }

  // Fallback or error view if role is not found, though ProtectedRoute should prevent this.
  return (
    <Box>
      <Typography>Error: User role not recognized.</Typography>
    </Box>
  )
}
