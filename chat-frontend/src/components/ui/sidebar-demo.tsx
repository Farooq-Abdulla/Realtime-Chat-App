"use client";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { useSocket } from "@/lib/global-socket-provider";
import { useCheckNumberOfReceivedRequests } from "@/lib/hooks/useCheckNumberOfReceivedRequests";
import useCheckReceivedMessages from "@/lib/hooks/useCheckReceivedMsgsCount";
import { cn } from "@/lib/utils";
import { Messages } from "@prisma/client";
import {
    IconArrowLeft,
    IconBrandMessenger,
    IconBrandTabler,
    IconUserBolt
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { DarkModeToggle } from "./dark-mode-toggle";


export default function SidebarDemo({children , userId}: { children: ReactNode, userId:string}) {
    const session = useSession();
    const user = session.data?.user
    // const userId= user?.id
    const router = useRouter();
    const {data:requests}= useCheckNumberOfReceivedRequests(userId!)
    const {data:unreadMsgs}=useCheckReceivedMessages(userId!)
    const {socket}=useSocket();
    const queryClient=useQueryClient();
    useEffect(()=>{
        if(!socket) {
            console.log("Some Problem")
            return
        };

        socket.on("received-msg-sidebar", (response: Messages) => {

            // console.log("From sidebar in received-msg", response);
            // queryClient.setQueryData(['count', userId], (oldObj:Record<string,number>)=>{
            //     const senderId=response.senderId;
            //     const currentCount= oldObj[senderId]|0
            //     return {...oldObj, [senderId]:currentCount+1}
            //   })
            queryClient.invalidateQueries({queryKey:['count', userId!]})
    
        });
        socket?.on('friendRequest', (count:number)=>{
        //   console.log("in friendRequest effect and the count is ", count);
        //   queryClient.invalidateQueries({queryKey:["receivedRequestsCount", userId]})
          queryClient.setQueryData(["receivedRequestsCount", userId], (oldData:number)=>{
            return count
          })
        });

        // socket.on("read-msg", (response:Messages[])=>{
        //     console.log("From sidebar in read msg ")
        //     queryClient.invalidateQueries({queryKey:['count', userId!]})

        // })
        
    

        return ()=>{
            socket.off('friendRequest')
            socket.off('read-msg')

        }
    },[queryClient, socket, userId])

    // useEffect(()=>{
    //     if(!socket) {
    //         console.log("Problem ")
    //         return
    //     }
    //     const handleReceivedMsg = (response: Messages) => {
    //         console.log("From sidebar in received-msg", response);
    //         queryClient.setQueryData(['count', userId!], (oldObj: Record<string, number>) => {
    //             const senderId = response.senderId;
    //             const currentCount = oldObj[senderId] || 0;
    //             return { ...oldObj, [senderId]: currentCount + 1 };
    //         });
    //     };
    
    //     socket.on("received-msg-sidebar", handleReceivedMsg);
    
    //     return () => {
    //         socket.off("received-msg-sidebar", handleReceivedMsg); // Cleanup listener
    //     };

    // }, [queryClient, socket, userId])
    const links = [
        {
            label: "Dashboard",
            onClick: () => router.push("/dashboard"),
            icon: (
                <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
        {
            label: "Requests",
            onClick: () => router.push("/requests"),
            icon: (
                <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
            requests: requests||0,
        },
        {
            label: "Chat",
            onClick: () => router.push("/chat"),
            icon: (
                <IconBrandMessenger className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
            requests: unreadMsgs&&Object.values(unreadMsgs!).reduce((acc,curr)=> curr+acc, 0)||0
        },
        {
            label: "Logout",
            onClick: () => signOut({ callbackUrl: '/' }),
            icon: (
                <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
        },
    ];
    const [open, setOpen] = useState(false);
    

    return (
        <div
            className={cn(
                "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "h-screen"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {/* {open ? <NewChatRequest chatWindowRequestOpen={chatRequestWindowOpen} setChatWindowRequestOpen={setChatRequestWindowOpen}><Logo /></NewChatRequest> : <LogoIcon />} */}
                        {/* {open ? <Logo /> : <LogoIcon />} */}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: `${user?.name}`,
                                onClick: () => router.push('/'),
                                icon: (
                                    <Image
                                        src={user?.image || '/logo.jpg'}
                                        className="h-7 w-7 flex-shrink-0 rounded-full"
                                        width={50}
                                        height={50}
                                        alt="Avatar"
                                    />
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <div className="flex flex-1">
                <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                    <DarkModeToggle />
                    {children}
                </div>
            </div>
        </div>
    );
}
export const Logo = () => {

    return (

        <div className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20">
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-black dark:text-white whitespace-pre"
            >
                New Chat
            </motion.span>
        </div>
    );
};

export const LogoIcon = () => {
    return (
        <Link
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
    );
};



