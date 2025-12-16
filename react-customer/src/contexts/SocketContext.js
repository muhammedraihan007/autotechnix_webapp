import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      // Establish connection only when token is available
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: token
        }
      });

      newSocket.on('connect', () => {
        console.log('Socket.IO connected successfully:', newSocket.id);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket.IO disconnected.');
      });
      
      newSocket.on('connect_error', (err) => {
        console.error('Socket.IO connection error:', err.message);
      });

      setSocket(newSocket);

      // Cleanup on component unmount or token change
      return () => {
        console.log('Disconnecting Socket.IO...');
        newSocket.disconnect();
      };
    }
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}
