import ChatRequestsComponent from "@/components/sent-received-requests";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import getServerSession from "../../../../lib/getServerSession";

export const metadata:Metadata={
  title:"Requests"
}

export default async function RequestsPage(){
  const session= await getServerSession();
  const userId= session?.user?.id
  if(!userId){
    redirect("/api/auth/signin?callbackUrl=/requests")
  }
  return(
    <ChatRequestsComponent userId={userId!}/>
  )
}