
import CheckDeliveredMsgsOfaUser from "@/server-actions/check-delivered-messages-of-user";
import { useQuery } from "@tanstack/react-query";

const useCheckReceivedMessages=( userId:string)=>{
    return useQuery({
        queryKey:['count', userId],
        queryFn: ()=>  CheckDeliveredMsgsOfaUser(userId)
    })
}
export default useCheckReceivedMessages;