import React from 'react';
import {
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Typography,
  Link
} from '@mui/material';
import API from '../services/api';

const statusColors = {
  'Pending': 'warning',
  'In Progress': 'info',
  'Completed': 'success',
  'Cancelled': 'error',
};

export default function JobCard({ job, isLast }) {
  const audioUrl = job.audioRecording ? `${API.defaults.baseURL}/${job.audioRecording}` : null;

  return (
    <React.Fragment>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={
            <Typography variant="h6">
              {job.car?.model || 'Unknown Car'} ({job.car?.regNo || 'N/A'})
            </Typography>
          }
          secondary={
            <>
              <Typography component="span" variant="body2" color="text.primary">
                Issue: {job.complaint}
              </Typography>
              <br />
              <Typography component="span" sx={{mt: 1}}>
                Job ID: {job._id}
              </Typography>
            </>
          }
        />
        <Chip label={job.status} color={statusColors[job.status] || 'default'} />
      </ListItem>
      {audioUrl && (
        <ListItem>
          <Link href={audioUrl} target="_blank" rel="noopener">
            View Recorded Audio
          </Link>
        </ListItem>
      )}
      {!isLast && <Divider variant="inset" component="li" />}
    </React.Fragment>
  );
}
