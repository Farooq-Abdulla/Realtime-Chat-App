import ChatRequestsComponent from "@/components/sent-received-requests";
import getServerSession from "../../../../lib/getServerSession";

export default async function RequestsPage(){
  const session= await getServerSession();
  const userId= session?.user?.id
  return(
    <ChatRequestsComponent userId={userId!}/>
  )
}