import ChatWindow from "@/components/ui/chat-window";
import getServerSession from "@/lib/getServerSession";
import React from "react";


export default async function ChatPage() {
  const session = await getServerSession()
  const userId= session?.user?.id
  return(
    <>
      <ChatWindow userId={userId!}/>
    </>
  )
}