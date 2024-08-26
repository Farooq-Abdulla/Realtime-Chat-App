import ChatWindow from "@/components/ui/chat-window";
import SidebarDemo from "@/components/ui/sidebar-demo";
import { cn } from "@/lib/utils";

export default function Dashboard() {
    return (
        <div
            className={cn(
                "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1  mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "h-screen"
            )}
        >
            <SidebarDemo />
            <div className="flex flex-1">
                <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                    {/* <div className="flex gap-2">
                        {[...new Array(4)].map((i, id) => (
                            <div
                                key={"first-array" + id}
                                className="h-20 w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
                            ></div>
                        ))}
                    </div>
                    <div className="flex gap-2 flex-1">
                        {[...new Array(2)].map((i, id) => (
                            <div
                                key={"second-array" + id}
                                className="h-full w-full rounded-lg  bg-gray-100 dark:bg-neutral-800 animate-pulse"
                            ></div>
                        ))}
                    </div> */}
                    <ChatWindow/>
                </div>
            </div>
        </div>
    );
};