'use client';
import { handleAcceptFriendRequest } from "@/server-actions/accept-friend-request";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../global-socket-provider";

export const useAcceptFriendRequest = (userId:string) => {
    const queryClient = useQueryClient();
    const {socket}=useSocket();
    
    const handleRequest=async(id:string)=>{
      let obj=await handleAcceptFriendRequest(id)
      console.log('From useAcceptFriendsReq', obj.senderId, obj.receiverId)
      socket?.emit('friendRequest', obj );
    }
  
    return useMutation({
      mutationFn: async(id:string)=> handleRequest(id),
      onSuccess: () => {
        queryClient.invalidateQueries({queryKey: ['incomingRequests']});
        queryClient.invalidateQueries({queryKey: ['outgoingRequests']});
        queryClient.invalidateQueries({queryKey: ['receivedRequestsCount', userId]});

      },
      onError: (error) => {
        console.error('Error accepting friend request:', error);
      },
    });
  };