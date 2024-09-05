import { declineFriendRequest } from "@/server-actions/decline-friend-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRejectFriendRequest = (userId:string) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (id:string)=>declineFriendRequest(id),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['incomingRequests']});
        queryClient.invalidateQueries({queryKey: ['outgoingRequests']});
        queryClient.invalidateQueries({queryKey: ['receivedRequestsCount', userId]});
        // Optionally, you can add a notification or success message here
      },
      onError: (error) => {
        console.error('Error accepting friend request:', error);
      },
    });
  };