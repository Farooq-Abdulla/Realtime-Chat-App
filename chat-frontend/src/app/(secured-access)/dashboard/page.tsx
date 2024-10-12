import FriendRequestForm from "@/components/friend-request-form";
import ListOfFriends from "@/components/list-of-friends";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import getServerSession from "../../../../lib/getServerSession";

export const metadata:Metadata={
    title:"Dashboard"
}

export default async function DashboardPage() {
    const session= await getServerSession();
    const userId= session?.user?.id

    if(!userId){
        redirect("/api/auth/signin?callbackUrl=/dashboard")
      }
    return (
        <div>
                <FriendRequestForm />
                <ListOfFriends userId={userId!}/>
            </div>
    );
};