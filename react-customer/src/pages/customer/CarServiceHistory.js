import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import API from '../../services/api';

export default function CarServiceHistory() {
  const { carId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const response = await API.get(`/jobs/car/${carId}`);
        setJobs(response.data);
      } catch (err) {
        setError('Failed to fetch service history. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, [carId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{color: 'text.primary'}}>
        Service History for {jobs.length > 0 ? jobs[0].car?.make + ' ' + jobs[0].car?.model : 'Car'}
      </Typography>

      {jobs.length === 0 ? (
        <Alert severity="info">No service history found for this car.</Alert>
      ) : (
        <List>
          {jobs.map((job) => (
            <Card key={job._id} sx={{ mb: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6" color="primary">Job ID: {job._id}</Typography>
                    <Typography variant="body1">Intake Date: {new Date(job.intakeDate).toLocaleDateString()}</Typography>
                    <Typography variant="body1">Status: {job.status}</Typography>
                    <Typography variant="body1">Complaint: {job.complaint}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">Estimated Delivery: {new Date(job.estDeliveryDate).toLocaleDateString()}</Typography>
                    <Typography variant="body1">Mechanic Notes: {job.notes || 'N/A'}</Typography>
                    {job.audioRecording && (
                      <Typography variant="body1">
                        Audio Recording: <a href={`http://localhost:5000/${job.audioRecording}`} target="_blank" rel="noopener noreferrer" style={{color: 'primary.main'}}>Listen</a>
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                {job.partsUsed && job.partsUsed.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6">Parts Used:</Typography>
                    <List dense>
                      {job.partsUsed.map((part, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${part.part.partName} x ${part.qty}`}
                            secondary={`Price: ₹${part.price}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Container>
  );
}
