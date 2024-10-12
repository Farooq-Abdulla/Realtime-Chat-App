import ChatWindow from "@/components/ui/chat-window";
import getServerSession from "@/lib/getServerSession";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata:Metadata={
  title:"Chat"
}

export default async function ChatPage() {
  const session = await getServerSession()
  const userId= session?.user?.id
  if(!userId){
    redirect("/api/auth/signin?callbackUrl=/chat")
  }
  return(
    <>
      <ChatWindow userId={userId!}/>
    </>
  )
}