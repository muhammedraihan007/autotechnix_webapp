import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar
} from '@mui/material';
import JobList from '../../components/admin/JobList';

function AdminHeader() {
  const { logout } = useAuth();

  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AutoTechnix (Admin)
        </Typography>
        <Button color="inherit" onClick={logout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

export default function AdminDashboard() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AdminHeader />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <Button component={Link} to="/admin/breakdown-requests" variant="contained">
            View Breakdown Requests
          </Button>
        </Box>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Customer Service Requests
        </Typography>
        <JobList />
      </Container>
    </Box>
  );
}
