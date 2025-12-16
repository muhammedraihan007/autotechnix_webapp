import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  Divider,
  Box,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  Link,
  FormControl,
  Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const statusColors = {
  'Pending': 'warning',
  'In Progress': 'info',
  'Completed': 'success',
  'Cancelled': 'error',
};

const API_URL = 'http://localhost:5000';

export default function JobList() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get('/jobs');
      setJobs(res.data.jobs);
    } catch (e) {
      console.error(e);
      setError('Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await API.patch(`/jobs/${jobId}/status`, { status: newStatus });
      // Refresh the job list to show the updated status
      fetchJobs();
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update job status.');
    }
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Paper elevation={3}>
      <List>
        {jobs.length > 0 ? jobs.map((job, index) => (
          <React.Fragment key={job._id}>
            <ListItem alignItems="flex-start" sx={{ flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                <ListItemText
                  primary={
                    <Typography variant="h6">
                      {job.car?.model || 'Unknown Car'} ({job.car?.regNo || 'N/A'})
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        Customer: {job.customer?.name || 'N/A'} ({job.customer?.phone || 'N/A'})
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2" color="text.primary">
                        Complaint: {job.complaint}
                      </Typography>
                    </>
                  }
                />
                <Chip label={job.status} color={statusColors[job.status] || 'default'} />
              </Box>
              <Box sx={{ display: 'flex', width: '100%', alignItems: 'center', mt: 2, gap: 2 }}>
                {job.audioRecording && (
                   <Link href={`${API_URL}/${job.audioRecording}`} target="_blank" rel="noopener">
                    Listen to Complaint
                  </Link>
                )}
                <FormControl size="small" sx={{minWidth: 150}}>
                  <Select
                    value={job.status}
                    onChange={(e) => handleStatusChange(job._id, e.target.value)}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
                <Button component={RouterLink} to={`/job/${job._id}`} variant="outlined" size="small">
                  View Details
                </Button>
              </Box>
            </ListItem>
            {index < jobs.length - 1 && <Divider />}
          </React.Fragment>
        )) : (
          <ListItem>
            <ListItemText primary="No jobs found." />
          </ListItem>
        )}
      </List>
    </Paper>
  );
}
