import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
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
  CircularProgress,
  Autocomplete
} from '@mui/material';
import AppHeader from '../components/AppHeader'; // Import the shared header
import { carMakes } from '../data/carMakes'; // Import the car makes data

export default function EditCar() {
  const { id } = useParams();
  const nav = useNavigate();
  const [car, setCar] = useState(null);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    regNo: '',
    vin: '',
    color: '',
    fuelType: 'Petrol',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchCar() {
      try {
        const { data } = await API.get(`/cars/${id}`);
        setCar(data);
        setFormData({
          make: data.make,
          model: data.model,
          year: data.year,
          regNo: data.regNo,
          vin: data.vin,
          color: data.color || '',
          fuelType: data.fuelType || 'Petrol',
        });
        if (data.imageUrl) {
          setImagePreview(`http://localhost:5000/${data.imageUrl}`);
        }
      } catch (err) {
        setError('Failed to fetch car details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCar();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMakeChange = (event, newValue) => {
    setFormData(prev => ({ ...prev, make: newValue }));
  };

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

    try {
      const updatedFormData = new FormData();
      for (const key in formData) {
        updatedFormData.append(key, formData[key]);
      }
      if (image) {
        updatedFormData.append('image', image);
      }

      await API.put(`/cars/${id}`, updatedFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSuccess('Car updated successfully! Redirecting to your garage...');
      setTimeout(() => nav('/my-cars'), 2000);
    } catch (e) {
      setError(e.response?.data?.message || 'Error updating car. Please try again.');
      console.error(e);
    }
  }

  if (loading) {
    return (
       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
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
            Edit Car Details
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {car && (
            <Box component="form" onSubmit={submit} noValidate>
              <Grid container spacing={2}>
                 <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={carMakes}
                    getOptionLabel={(option) => option}
                    value={formData.make}
                    onChange={handleMakeChange}
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
                  <TextField name="model" label="Model" value={formData.model} onChange={handleInputChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="year" label="Year" type="number" value={formData.year} onChange={handleInputChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="regNo" label="Registration Number" value={formData.regNo} onChange={handleInputChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="vin" label="VIN" value={formData.vin} onChange={handleInputChange} fullWidth required />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="color" label="Color" value={formData.color} onChange={handleInputChange} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Fuel Type</InputLabel>
                    <Select name="fuelType" value={formData.fuelType} label="Fuel Type" onChange={handleInputChange}>
                      <MenuItem value="Petrol">Petrol</MenuItem>
                      <MenuItem value="Diesel">Diesel</MenuItem>
                      <MenuItem value="Electric">Electric</MenuItem>
                      <MenuItem value="Hybrid">Hybrid</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Avatar src={imagePreview} alt="Car Preview" sx={{ width: 150, height: 150, margin: 'auto', mb: 2 }} variant="rounded" />
                  <Button variant="contained" component="label">
                    Upload New Image
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </Button>
                </Grid>
              </Grid>

              {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}
              
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, fontSize: '1.1rem' }}>
                Save Changes
              </Button>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
