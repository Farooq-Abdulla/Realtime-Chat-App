import { getFriends } from '@/server-actions/get-friends';
import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useSocket } from '../global-socket-provider';

export const useGetFriends = (userId: string) => {
  const { onlineUsers, isConnected } = useSocket();

  const fetchFriends = useCallback(async () => {
    const friends = await getFriends(userId);
    return friends.map(friend => ({
      ...friend,
      status: onlineUsers.get(friend.id) ? 'online' : 'offline' as 'online'|'offline'
    }));
  }, [userId, onlineUsers]);

  return useQuery({
    queryKey: ['friends', userId],
    queryFn: fetchFriends,
    enabled: isConnected && onlineUsers.size > 0
  });
};
