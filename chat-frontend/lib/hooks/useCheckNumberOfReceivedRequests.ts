import CheckNumberOfReceivedRequests from "@/server-actions/check-numberof-received-requests";
import { useQuery } from "@tanstack/react-query";

export const useCheckNumberOfReceivedRequests=(userId: string)=>{
    return useQuery<number>({
        queryKey: ["receivedRequestsCount", userId],
        queryFn: async () => {
          if (!userId) throw new Error("User ID is required");
          // console.log("Fetching number of received requests for userId:", userId);
          const count= await CheckNumberOfReceivedRequests(userId);
          // console.log('count :', count)
          return count
        },
        enabled: !!userId,
      });
}