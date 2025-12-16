import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import {
  Container,
  Box,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Paper,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';

function AdminHeader() {
  return (
    <AppBar position="static" color="secondary">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AutoTechnix (Admin)
        </Typography>
        <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
      </Toolbar>
    </AppBar>
  );
}

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
        setNotes(res.data.notes || '');
      } catch (e) {
        console.error(e);
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  const handleSaveNotes = async () => {
    try {
      setError('');
      setSuccess('');
      await API.patch(`/jobs/${id}/notes`, { notes });
      setSuccess('Notes saved successfully.');
    } catch (e) {
      console.error(e);
      setError('Failed to save notes.');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!job) {
    return <Alert severity="warning">Job not found.</Alert>;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AdminHeader />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" component="h1">
            Job Details ({job._id})
          </Typography>
          <Button component={Link} to={`/job/${job._id}/create-invoice`} variant="contained">
            Create Invoice
          </Button>
        </Box>

        <Paper sx={{ p: 2, mb: 3 }}>
...
        {/* Parts usage will be added here */}
        </Paper>

      </Container>
    </Box>
  );
}
