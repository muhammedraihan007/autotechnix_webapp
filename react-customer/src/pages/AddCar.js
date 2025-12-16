import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Grid,
  Avatar,
  Autocomplete
} from '@mui/material';
import AppHeader from '../components/AppHeader'; // Import the shared header
import { carMakes } from '../data/carMakes'; // Import the car makes data

export default function AddCar() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [regNo, setRegNo] = useState('');
  const [vin, setVin] = useState('');
  const [color, setColor] = useState('');
  const [fuel, setFuel] = useState('Petrol');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const nav = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!make || !model || !year || !regNo || !vin) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('make', make);
      formData.append('model', model);
      formData.append('year', year);
      formData.append('regNo', regNo);
      formData.append('vin', vin);
      formData.append('color', color);
      formData.append('fuelType', fuel);
      if (image) {
        formData.append('image', image);
      }

      await API.post('/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Car added successfully! Redirecting to your garage...');
      setTimeout(() => nav('/my-cars'), 2000);
    } catch (e) {
      setError(e.response?.data?.message || 'Error adding car. Please try again.');
      console.error(e);
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppHeader />
      <Container component="main" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            p: 4,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 4,
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Add a New Car to Your Garage
          </Typography>
          <Box component="form" onSubmit={submit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={carMakes}
                  getOptionLabel={(option) => option}
                  value={make}
                  onChange={(event, newValue) => {
                    setMake(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Make"
                      required
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Model (e.g., Camry)"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Year"
                  type="number"
                  value={year}
                  onChange={e => setYear(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Registration Number"
                  value={regNo}
                  onChange={e => setRegNo(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="VIN (Vehicle Identification Number)"
                  value={vin}
                  onChange={e => setVin(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Fuel Type</InputLabel>
                  <Select
                    value={fuel}
                    label="Fuel Type"
                    onChange={e => setFuel(e.target.value)}
                  >
                    <MenuItem value="Petrol">Petrol</MenuItem>
                    <MenuItem value="Diesel">Diesel</MenuItem>
                    <MenuItem value="Electric">Electric</MenuItem>
                    <MenuItem value="Hybrid">Hybrid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'center' }}>
                {imagePreview && (
                  <Avatar
                    src={imagePreview}
                    alt="Car Preview"
                    sx={{ width: 150, height: 150, margin: 'auto', mb: 2 }}
                    variant="rounded"
                  />
                )}
                <Button
                  variant="contained"
                  component="label"
                >
                  Upload Car Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
              </Grid>
            </Grid>

            {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: '1.1rem' }}
            >
              Add Car to Garage
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
