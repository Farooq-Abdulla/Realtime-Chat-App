import { declineFriendRequest } from "@/server-actions/decline-friend-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../global-socket-provider";

export const useRejectFriendRequest = (userId:string) => {
    const queryClient = useQueryClient();
    const {socket}=useSocket();
    const handleRequest=async(id:string)=>{
      let obj=await declineFriendRequest(id)
      // console.log('From useRejectFriendsReq', obj.senderId, obj.receiverId)
      socket?.emit('friendRequest', obj );
    }
  
    return useMutation({
      mutationFn: async(id:string)=>handleRequest(id),
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