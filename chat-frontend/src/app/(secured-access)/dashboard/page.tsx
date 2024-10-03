import FriendRequestForm from "@/components/friend-request-form";
import ListOfFriends from "@/components/list-of-friends";
import getServerSession from "../../../../lib/getServerSession";

export default async function DashboardPage() {
    const session= await getServerSession();
    const userId= session?.user?.id

    return (
        <div>
                <FriendRequestForm />
                <ListOfFriends userId={userId!}/>
            </div>
    );
};