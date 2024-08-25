
import { signOut } from "../../lib/auth"
 
export default function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button type="submit">SignOut</button>
    </form>
  )
} 