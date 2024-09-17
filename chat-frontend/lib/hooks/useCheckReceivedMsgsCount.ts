// import { Contact } from "@/components/ui/chat-window";
// import CheckDeliveredMsgsOfaUser from "@/server-actions/check-delivered-messages-of-user";
// import { useQuery } from "@tanstack/react-query";

// const useCheckReceivedMessages=(friends:Contact[], receiverId:string)=>{
//     const fetchUnreadMessages=()=>{
//         return friends.map(async(friend)=>await  CheckDeliveredMsgsOfaUser(friend.id, receiverId) )
//     }
//     return useQuery({
//         queryKey:['count', receiverId],
//         queryFn: fetchUnreadMessages
//     })
// }
// export default useCheckReceivedMessages;