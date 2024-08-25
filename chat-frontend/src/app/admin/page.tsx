import { auth } from "@/auth";
import SignOut from "@/components/sign-out";

export default async function Admin(){
    const session= await auth();
  if(!session) return <div>Not authenticated</div>
    return(
        <>
        <div>Admin</div>
            <div><SignOut/>
        </div>
        </>
    )
}