import { Cover } from "@/components/ui/cover";

export default async function Home() {
  // const session= await auth();
  // if(!session) return <div>Not authenticated</div>
  return (
    <div className="flex justify-center content-center">
    <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
      Experience <Cover>blazing-fast</Cover> <br/> real-time chat
    </h1>
  </div>
  );
}
