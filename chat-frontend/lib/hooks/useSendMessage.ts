import handleStoreMessages from "@/server-actions/handle-store-messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../global-socket-provider";
export interface IPostMessageType{
    senderId:string,
    receiverId:string,
    content:string
    online:boolean
}

export const  useSendMessages=(userId:string, senderId:string)=> {
    const queryClient= useQueryClient();
    const {socket}=useSocket()
    const storeMsg= async(message:IPostMessageType)=>{
        const response=await handleStoreMessages(message)
        socket?.emit("sent-msg", response)
    }
    return useMutation({
        mutationFn: (message:IPostMessageType)=>  storeMsg(message),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:['messages', userId, senderId]})
        }
    })
    
}