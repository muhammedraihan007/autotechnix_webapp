import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
  Card
} from '@mui/material';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function AppHeader() {
  const { logout } = useAuth();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AutoTechnix
        </Typography>
        <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
        <Button color="inherit" onClick={logout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}

export default function UserProfile() {
  const [user, setUser] = useState({ name: '', phone: '' });
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await API.get('/auth/me');
        setUser({ name: data.name, phone: data.phone });
      } catch (err) {
        setError('Could not load profile. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const payload = {
      name: user.name,
      phone: user.phone,
    };

    if (password) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setSnackbarOpen(true);
        return;
      }
      payload.password = password;
    }

    try {
      const { data } = await API.put('/auth/me', payload);
      setUser({ name: data.name, phone: data.phone });
      setPassword('');
      setConfirmPassword('');
      setSuccess('Profile updated successfully!');
      setSnackbarOpen(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to update profile.');
      setSnackbarOpen(true);
      console.error(err);
    }
  };
  
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
  }

  return (
    <Box>
      <AppHeader />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{color: 'text.primary'}}>
          My Profile
        </Typography>
        <Card sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              fullWidth
              required
              id="name"
              label="Full Name"
              name="name"
              value={user.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="normal"
              fullWidth
              required
              id="phone"
              label="Phone Number"
              name="phone"
              value={user.phone}
              onChange={handleInputChange}
            />
            <Typography variant="h6" sx={{ mt: 4, mb: 1, color: 'text.secondary'}}>
              Change Password (optional)
            </Typography>
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              Update Profile
            </Button>
          </Box>
        </Card>
      </Container>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
          {success || error}
        </Alert>
      </Snackbar>
    </Box>
  );
}
