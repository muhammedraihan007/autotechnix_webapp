import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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
  Alert,
  IconButton,
  Grid
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';

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

export default function CreateInvoice() {
  const { jobId } = useParams();
  const nav = useNavigate();
  const [job, setJob] = useState(null);
  const [lineItems, setLineItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }]);
  const [taxes, setTaxes] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await API.get(`/jobs/${jobId}`);
        setJob(res.data);
      } catch (e) {
        console.error(e);
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  const handleItemChange = (index, field, value) => {
    const items = [...lineItems];
    items[index][field] = value;
    setLineItems(items);
  };

  const handleAddItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const items = [...lineItems];
    items.splice(index, 1);
    setLineItems(items);
  };

  const calculateTotal = () => {
    const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    return subtotal - discount + taxes;
  };

  const handleSubmit = async () => {
    try {
      setError('');
      const invoiceData = {
        job: jobId,
        lineItems: lineItems.map(item => ({ ...item, total: item.quantity * item.unitPrice })),
        taxes,
        discount,
        total: calculateTotal()
      };
      const res = await API.post('/invoices/manual', invoiceData);
      window.open(`${API.defaults.baseURL}/${res.data.filePath}`, '_blank');
      nav(`/job/${jobId}`);
    } catch (e) {
      console.error(e);
      setError('Failed to create invoice.');
    }
  };
  
  if (loading) return <CircularProgress />;

  return (
    <Box>
      <AdminHeader />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Create Manual Invoice for Job #{job?._id}
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Invoice Items</Typography>
          {lineItems.map((item, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2, alignItems: 'center' }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Unit Price"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => handleRemoveItem(index)} disabled={lineItems.length === 1}>
                  <RemoveCircleOutline />
                </IconButton>
                <IconButton onClick={handleAddItem}>
                  <AddCircleOutline />
                </IconButton>
              </Grid>
            </Grid>
          ))}

          <Grid container spacing={2} sx={{ mt: 4 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Discount (₹)"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Taxes (₹)"
                value={taxes}
                onChange={(e) => setTaxes(parseFloat(e.target.value))}
              />
            </Grid>
          </Grid>

          <Typography variant="h5" sx={{ mt: 4, textAlign: 'right' }}>
            Total: ₹{calculateTotal().toFixed(2)}
          </Typography>

          <Button variant="contained" onClick={handleSubmit} sx={{ mt: 4 }}>
            Generate PDF Invoice
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
