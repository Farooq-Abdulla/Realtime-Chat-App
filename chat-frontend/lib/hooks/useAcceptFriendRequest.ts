import { handleAcceptFriendRequest } from "@/server-actions/accept-friend-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useAcceptFriendRequest = (userId:string) => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: (id:string)=>handleAcceptFriendRequest(id),
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