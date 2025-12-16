import React, { useState, useEffect, useRef } from 'react';
import API from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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

export default function CreateJob() {
  const [cars, setCars] = useState([]);
  const [carId, setCarId] = useState('');
  const [complaint, setComplaint] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const nav = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Could not start recording. Please ensure you have given microphone permissions.');
    }
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    async function loadCars() {
      try {
        const res = await API.get('/cars');
        setCars(res.data);
        if (res.data.length > 0) {
          setCarId(res.data[0]._id); // Default to the first car
        }
      } catch (e) {
        console.error(e);
        setError('Failed to load your cars.');
      }
    }
    loadCars();
  }, []);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!carId) {
      setError('Please select a car.');
      return;
    }
    if (!complaint && !audioBlob) {
      setError('Please describe the issue or record an audio message.');
      return;
    }
    try {
      const jobRes = await API.post('/jobs', { car: carId, complaint: complaint || "See audio recording." });
      const jobId = jobRes.data._id;

      if (audioBlob) {
        const formData = new FormData();
        formData.append('audio', audioBlob, `job-${jobId}.wav`);
        await API.post(`/jobs/${jobId}/audio`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setSuccess('Service request created successfully! Redirecting to dashboard...');
      setTimeout(() => nav('/dashboard'), 2000);
    } catch (e) {
      setError('Error creating service request.');
      console.error(e);
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppHeader />
      <Container component="main" maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ padding: 4, boxShadow: 3, borderRadius: 2 }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Create a New Service Request
          </Typography>
          <Box component="form" onSubmit={submit} noValidate>
            <FormControl fullWidth margin="normal">
              <InputLabel id="car-select-label">Select Your Car</InputLabel>
              <Select
                labelId="car-select-label"
                value={carId}
                label="Select Your Car"
                onChange={e => setCarId(e.target.value)}
              >
                {cars.map(c => <MenuItem key={c._id} value={c._id}>{c.make} {c.model} - {c.regNo}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              fullWidth
              multiline
              rows={4}
              label="Describe the issue or service required"
              value={complaint}
              onChange={e => setComplaint(e.target.value)}
            />

            <Box sx={{ my: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              {!isRecording ? (
                <Button onClick={handleStartRecording} variant="outlined">Record Complaint</Button>
              ) : (
                <Button onClick={handleStopRecording} variant="outlined" color="error">Stop Recording</Button>
              )}
              {audioUrl && (
                <audio controls src={audioUrl}>
                  Your browser does not support the audio element.
                </audio>
              )}
            </Box>

            {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ width: '100%', mt: 2 }}>{success}</Alert>}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontSize: '1.1rem' }}
            >
              Submit Request
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
