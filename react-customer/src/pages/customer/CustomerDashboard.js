import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Icon
} from '@mui/material';
import AppHeader from '../../components/AppHeader'; // Import the shared header
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BuildIcon from '@mui/icons-material/Build';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import CarCrashIcon from '@mui/icons-material/CarCrash';


const FeatureCard = ({ title, to, icon, description }) => (
  <Grid item xs={12} md={6}>
    {/* This Card is now styled globally by the theme.js file */}
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon component={icon} sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
        </Box>
        <Typography color="text.secondary" sx={{mb: 2}}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button component={Link} to={to} variant="contained" fullWidth>
          Go to {title}
        </Button>
      </CardActions>
    </Card>
  </Grid>
);

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    // The background color is removed to let the global styles apply.
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      <AppHeader />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1, color: 'text.primary' }}>
          Welcome back, {user?.name || 'Customer'}!
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
          What would you like to do today?
        </Typography>

        <Grid container spacing={4}>
          <FeatureCard 
            title="My Garage"
            to="/my-cars"
            icon={DirectionsCarIcon}
            description="View, add, or manage the cars in your digital garage."
          />
          <FeatureCard 
            title="New Service Request"
            to="/create-job"
            icon={BuildIcon}
            description="Book a new service or repair for one of your vehicles."
          />
          <FeatureCard 
            title="Track Service Status"
            to="/track-job"
            icon={PlagiarismIcon}
            description="Check the real-time status of your ongoing services."
          />
          <FeatureCard 
            title="Breakdown Assistance"
            to="/breakdown-assistance"
            icon={CarCrashIcon}
            description="Request immediate help for a vehicle breakdown."
          />
        </Grid>
      </Container>
    </Box>
  );
}
