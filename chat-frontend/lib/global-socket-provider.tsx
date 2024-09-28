'use client';
import { useSession } from 'next-auth/react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { config } from './config';

type UserStatus = boolean;
type OnlineUsers = Map<string, UserStatus>;

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: OnlineUsers;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode; userId: string }> = ({ children, userId }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers>(new Map());
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { status } = useSession();

  useEffect(() => {
    const newSocket = io(config.url!);
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

    newSocket.on('onlineUsersUpdate', (users: string[]) => {
      // console.log('Online users update:', users);
    const allusers=users.map((item)=> [item,true] as [string, boolean])
      setOnlineUsers(new Map(allusers));
    });


    if (status === 'unauthenticated') {
      newSocket.emit('userDisconnected', userId);
      console.log('User disconnected due to logout or session end');
    }

    return () => {
      newSocket.emit('userDisconnected', userId); 
      newSocket.disconnect();
    };
  }, [userId, status]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
