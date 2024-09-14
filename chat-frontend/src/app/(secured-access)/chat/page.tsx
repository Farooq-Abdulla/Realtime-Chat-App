import ChatWindow from "@/components/ui/chat-window";
import getServerSession from "@/lib/getServerSession";



export default async function ChatPage() {
  const session = await getServerSession()
  const userId= session?.user?.id
  return(
    <>
      <ChatWindow userId={userId!}/>
    </>
  )
}