
import CheckDeliveredMsgsOfaUser from "@/server-actions/check-delivered-messages-of-user";
import { useQuery } from "@tanstack/react-query";

const useCheckReceivedMessages=( receiverId:string)=>{
    return useQuery({
        queryKey:['count', receiverId],
        queryFn: ()=>  CheckDeliveredMsgsOfaUser(receiverId)
    })
}
export default useCheckReceivedMessages;