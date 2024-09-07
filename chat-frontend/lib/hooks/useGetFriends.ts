import { getFriends } from '@/server-actions/get-friends';
import { useQuery } from '@tanstack/react-query';
import useSocket from './useSocket';



export const useGetFriends = (userId: string) => {
    const { onlineUsers } = useSocket(userId);

    return useQuery({
        queryKey: ['friends', userId],
        queryFn: () => getFriends(userId, onlineUsers),
        enabled: onlineUsers.size > 0, 
        staleTime: 1000 * 60 * 5
    });
};
