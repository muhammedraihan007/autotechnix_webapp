import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Button, TextField, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import API from '../../services/api';
import AppHeader from '../../components/AppHeader'; // Import shared header

// Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function BreakdownAssistance() {
  const [position, setPosition] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cars, setCars] = useState([]);
  const [carId, setCarId] = useState('');

  useEffect(() => {
    async function fetchCars() {
      try {
        const res = await API.get('/cars'); // Corrected API endpoint
        setCars(res.data);
      } catch (err) {
        console.error("Error fetching cars", err);
        setError('Could not fetch your cars.');
      }
    }
    fetchCars();
  }, []);

  const handleSubmit = async () => {
    if (!position) {
      setError('Please select a location on the map.');
      return;
    }
    if (!carId) {
      setError('Please select a car.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const breakdownData = {
        car: carId,
        latitude: position.lat,
        longitude: position.lng,
        notes,
      };
      await API.post('/breakdowns', breakdownData);
      setSuccess('Breakdown request submitted successfully. We will be in touch shortly.');
      setCarId('');
      setNotes('');
    } catch (e) {
      console.error(e);
      setError('Failed to submit breakdown request.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppHeader />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, p: 4, 
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
      }}>
        <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
          Breakdown Assistance
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: 'text.secondary' }}>
          We'll try to find your location automatically. If needed, click on the map to adjust your location.
        </Typography>

        <Box sx={{ height: '400px', mb: 3, borderRadius: 2, overflow: 'hidden' }}>
          <MapContainer center={{ lat: 10.8505, lng: 76.2711 }} zoom={13} style={{ height: '100%', width: '100%' }}> {/* Default to Kerala, India */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
        </Box>
        
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="car-select-label">Select a Car</InputLabel>
          <Select
            labelId="car-select-label"
            id="car-select"
            value={carId}
            label="Select a Car"
            onChange={(e) => setCarId(e.target.value)}
          >
            {cars.length > 0 ? (
              cars.map((car) => (
                <MenuItem key={car._id} value={car._id}>
                  {car.make} {car.model} ({car.regNo}) {/* Changed to regNo for consistency */}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>No cars added yet. Add a car from My Garage.</MenuItem>
            )}
          </Select>
        </FormControl>

        <TextField
          label="Additional Notes (e.g., 'flat tire', 'engine won't start')"
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading || !carId || !position}
          fullWidth
        >
          {loading ? <CircularProgress size={24} /> : 'Submit Breakdown Request'}
        </Button>
      </Container>
    </Box>
  );
}
