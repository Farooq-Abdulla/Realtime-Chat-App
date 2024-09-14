import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";
import { Cover } from "@/components/ui/cover";
import { ChevronRight } from "lucide-react";
import { redirect } from "next/navigation";
import getServerSession from "../../lib/getServerSession";

export default async function Home() {
  const session= await getServerSession()
  const user= session?.user
  if(user){
    redirect('/dashboard')
  }
  return (
    <div className="h-screen w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
  <div className="text-center">
    <h1 className="text-4xl sm:text-7xl font-bold relative z-20 bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-8">
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
