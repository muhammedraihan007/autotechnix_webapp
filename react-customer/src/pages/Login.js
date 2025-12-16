import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Alert, Grid } from '@mui/material';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      nav('/dashboard');
    } catch (e) {
      if (e.response) {
        setError(e.response.data.msg || 'Login failed. Please check your username and password.');
      } else {
        setError('Login failed. Please check your username and password.');
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 4,
          // The glass effect is now primarily handled by the global Card override,
          // but we can add specific adjustments if needed.
          // For consistency, we'll rely on the global theme for Cards/Boxes.
          // This Box will be styled like a Card by the global theme.
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 4, // or '16px' to match the global override
        }}
      >
        <Box className="marquee-container">
          <Typography variant="body2" className="marquee-text" sx={{ color: 'text.secondary' }}>
            Contact us: +91 98765 43210 | info@autotechnix.com | Working Hours: Mon-Sat 9 AM - 6 PM
          </Typography>
        </Box>

        <Typography component="h1" variant="h5">
          Customer Login
        </Typography>
        <Box component="form" onSubmit={submit} noValidate sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/register" style={{ color: '#90caf9', textDecoration: 'none' }}>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
