import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

// Re-using the AppHeader for consistency
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

const statusColors = {
  'Pending': 'warning',
  'In Progress': 'info',
  'Completed': 'success',
  'Cancelled': 'error',
};

export default function TrackJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await API.get('/jobs');
        setJobs(res.data.jobs); // The endpoint returns a paginated object
      } catch (e) {
        console.error(e);
        setError('Failed to load job history.');
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppHeader />
      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          My Service History
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Paper elevation={3}>
            import JobCard from '../components/JobCard';
...
            <List>
              {jobs.length > 0 ? jobs.map((job, index) => (
                <JobCard key={job._id} job={job} isLast={index === jobs.length - 1} />
              )) : (
                <ListItem>
                  <ListItemText primary="You have no service history." />
                </ListItem>
              )}
            </List>
...
          </Paper>
        )}
      </Container>
    </Box>
  );
}
