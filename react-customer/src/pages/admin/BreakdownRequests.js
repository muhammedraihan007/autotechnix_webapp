import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import API from '../../services/api';
import { Link } from 'react-router-dom';

export default function BreakdownRequests() {
  const [breakdowns, setBreakdowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBreakdowns() {
      try {
        const res = await API.get('/breakdowns');
        setBreakdowns(res.data);
      } catch (e) {
        console.error(e);
        setError('Failed to load breakdown requests.');
      } finally {
        setLoading(false);
      }
    }
    fetchBreakdowns();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await API.put(`/breakdowns/${id}`, { status });
      setBreakdowns(breakdowns.map(b => b._id === id ? { ...b, status } : b));
    } catch (e) {
      console.error(e);
      setError('Failed to update status.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Container sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Breakdown Requests
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Car</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakdowns.map((breakdown) => (
              <TableRow key={breakdown._id}>
                <TableCell>{new Date(breakdown.createdAt).toLocaleString()}</TableCell>
                <TableCell>{breakdown.customer.name} ({breakdown.customer.phone})</TableCell>
                <TableCell>{breakdown.car.make} {breakdown.car.model} ({breakdown.car.regNo})</TableCell>
                <TableCell>
                  <a href={`https://www.google.com/maps?q=${breakdown.location.coordinates[1]},${breakdown.location.coordinates[0]}`} target="_blank" rel="noopener noreferrer">
                    View on Map
                  </a>
                </TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={breakdown.status}
                      onChange={(e) => handleStatusChange(breakdown._id, e.target.value)}
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="in_progress">In Progress</MenuItem>
                      <MenuItem value="resolved">Resolved</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>{breakdown.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
