'use client';
import SidebarDemo from "@/components/ui/sidebar-demo";
import { useSocket } from "@/lib/global-socket-provider";
import { useCheckNumberOfReceivedRequests } from "@/lib/hooks/useCheckNumberOfReceivedRequests";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";



export default function SecuredAccessLayout({children}: {children: React.ReactNode;}) {
    const session= useSession();
    const userId= session.data?.user?.id
    const {data:count}= useCheckNumberOfReceivedRequests(userId!)
    const [renderCount, setRenderCount] = useState(0);

    const {socket}=useSocket();
    const queryClient=useQueryClient();
    useEffect(()=>{
        if(!socket) return;
        socket?.on('friendRequest', (count:number)=>{
          console.log("in friendRequest effect and the count is ", count);
          // queryClient.setQueryData(["receivedRequestsCount", userId], (oldData:number)=>{
          //   return oldData-oldData+count
          // })
          queryClient.invalidateQueries({queryKey:["receivedRequestsCount", userId]})
          queryClient.refetchQueries({queryKey: ["receivedRequestsCount", userId]});
        })
        setRenderCount((prev) => prev + 1);

        return ()=>{
            socket.off('friendRequest')
        }
    },[queryClient, socket, userId, count])
  return (
    <SidebarDemo requests={count!}>{children}</SidebarDemo>

  );
}
