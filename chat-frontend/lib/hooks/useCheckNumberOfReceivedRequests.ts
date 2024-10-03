'use client';
import CheckNumberOfReceivedRequests from "@/server-actions/check-numberof-received-requests";
import { useQuery } from "@tanstack/react-query";

export const useCheckNumberOfReceivedRequests=(userId: string)=>{
    return useQuery({
        queryKey: ["receivedRequestsCount", userId],
        queryFn: () => CheckNumberOfReceivedRequests(userId),
        enabled: !!userId,
      });
}