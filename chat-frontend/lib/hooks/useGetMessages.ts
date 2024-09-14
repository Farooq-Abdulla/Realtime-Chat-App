import getMessagesofLoggedInUser from "@/server-actions/get-messages-of-logged-in-user"
import { Messages } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"

export const useGetMessages=(userId:string, senderId:string)=>{
    return useQuery<Messages[]>({
        queryKey:["messages", userId, senderId],
        queryFn:()=> getMessagesofLoggedInUser(userId),
    })
}