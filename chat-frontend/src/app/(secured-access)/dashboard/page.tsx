import FriendRequestForm from "@/components/friend-request-form";
import ListOfFriends from "@/components/list-of-friends";

export default async function Dashboard() {

    return (
        <div>
                <FriendRequestForm />
                <ListOfFriends/>
            </div>
    );
};