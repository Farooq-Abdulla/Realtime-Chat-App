import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type UserStatus = boolean;
type OnlineUsers = Map<string, UserStatus>;

interface UseSocketReturn {
  socket: Socket | null;
  onlineUsers: OnlineUsers;
  isConnected: boolean;
}

export const useSocket = (userId: string): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers>(new Map());
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const handleOnlineUsersUpdate = useCallback((users: [string, UserStatus][]) => {
      console.log('Online users update:', users);
      setOnlineUsers(new Map(users));
    },[]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setIsConnected(true);
      newSocket.emit('userConnected', userId);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setIsConnected(false);
    });

    newSocket.on('onlineUsersUpdate', handleOnlineUsersUpdate);

    return () => {
      console.log('Cleaning up socket connection');
      newSocket.off('onlineUsersUpdate', handleOnlineUsersUpdate);
      newSocket.disconnect();
    };
  }, [userId, handleOnlineUsersUpdate, onlineUsers]);

  return { socket, onlineUsers, isConnected };
};
