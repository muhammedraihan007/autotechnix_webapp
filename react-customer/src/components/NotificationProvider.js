import React, { useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';
import toast, { Toaster } from 'react-hot-toast';

export default function NotificationProvider() {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      const listener = (data) => {
        console.log('Received jobStatusUpdated event:', data);
        toast.success(data.message || `Job ${data.jobId} status updated to ${data.status}`);
      };

      socket.on('jobStatusUpdated', listener);

      // Cleanup
      return () => {
        socket.off('jobStatusUpdated', listener);
      };
    }
  }, [socket]);

  return (
    // The Toaster component renders the actual notifications
    <Toaster
      position="top-right"
      toastOptions={{
        // Define default options
        duration: 8000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        // Default options for specific types
        success: {
          duration: 10000,
          theme: {
            primary: 'green',
            secondary: 'black',
          },
        },
      }}
    />
  );
}
