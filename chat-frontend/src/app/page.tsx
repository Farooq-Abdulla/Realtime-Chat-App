import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Cover } from "@/components/ui/cover";
import { ChevronRight } from "lucide-react";

export default async function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
  <div className="text-center">
    <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto relative z-20 py-1 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
      Experience <Cover>blazing-fast</Cover> <br/> real-time chat
    </h1>
    <p className="text-lg md:text-lg lg:text-xl font-semibold max-w-7xl mx-auto mt-2 mb-1 relative z-20 py-1 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">Log in to start connecting instantly!</p>
    
    <form
      action={async () => {
        "use server"
        await signIn("google",{redirectTo:"/dashboard"})
      }}
    >
      <Button type="submit"><ChevronRight className="h-4 w-4" />Login with Google</Button>
    </form>
  </div>
</div>

  );
}
