import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import AppHeader from '../../components/AppHeader'; // Import the shared header
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';


export default function MyCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    async function fetchCars() {
      try {
        const { data } = await API.get('/cars');
        setCars(data);
      } catch (err) {
        setError('Could not fetch cars. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      try {
        await API.delete(`/cars/${carId}`);
        setCars(cars.filter(car => car._id !== carId));
        setSuccess('Car deleted successfully.');
        setSnackbarOpen(true);
      } catch (err) {
        setError('Could not delete the car. Please try again.');
        setSnackbarOpen(true);
        console.error(err);
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
            My Garage
          </Typography>
          <Button variant="contained" color="primary" component={Link} to="/add-car">
            + Add New Car
          </Button>
        </Box>

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={success ? 'success' : 'error'} sx={{ width: '100%' }}>
            {success || error}
          </Alert>
        </Snackbar>

        {loading && <CircularProgress />}
        {error && !success && <Alert severity="error">{error}</Alert>}
        
        {!loading && (
          <Grid container spacing={4}>
            {cars.map((car) => (
              <Grid item key={car._id} xs={12} sm={6} md={4}>
                <Card> {/* Card is now styled globally by theme.js */}
                  <CardMedia
                    component="img"
                    height="200"
                    image={car.imageUrl ? `http://localhost:5000/${car.imageUrl}` : 'https://via.placeholder.com/300x200.png?text=No+Image'}
                    alt={`Image of ${car.make} ${car.model}`}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" sx={{ color: 'text.primary' }}>
                      {car.make} {car.model} ({car.year})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Reg No:</strong> {car.regNo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>VIN:</strong> {car.vin}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Color:</strong> {car.color}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Fuel:</strong> {car.fuelType}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', padding: 2 }}>
                    <Box>
                      <Button size="small" component={Link} to={`/edit-car/${car._id}`}>Edit</Button>
                      <Button size="small" color="error" onClick={() => handleDelete(car._id)} sx={{ ml: 1 }}>Delete</Button>
                    </Box>
                    <Button size="small" variant="outlined" component={Link} to={`/my-cars/${car._id}/history`}>
                      View Service History
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
         {!loading && cars.length === 0 && (
          <Typography sx={{mt: 4, textAlign: 'center', color: 'text.secondary'}}>You haven't added any cars yet. Add one to get started!</Typography>
        )}
      </Container>
    </Box>
  );
}
