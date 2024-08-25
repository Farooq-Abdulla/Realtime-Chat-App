import SidebarDemo from "@/components/ui/sidebar-demo";
import { cn } from "@/lib/utils";

export default function Dashboard() {
    return (
        <div
            className={cn(
                "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-7xl mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
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

                </div>
            </div>
        </div>
    );
};


// "use client"

// import { CornerDownLeft, Mic, Paperclip } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"

// export default function ChatWindow() {
//   return (
//     <form
//       className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
//     >
//       <Label htmlFor="message" className="sr-only">
//         Message
//       </Label>
//       <Textarea
//         id="message"
//         placeholder="Type your message here..."
//         className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
//       />
//       <div className="flex items-center p-3 pt-0">
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button variant="ghost" size="icon">
//               <Paperclip className="size-4" />
//               <span className="sr-only">Attach file</span>
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent side="top">Attach File</TooltipContent>
//         </Tooltip>
//         <Tooltip>
//           <TooltipTrigger asChild>
//             <Button variant="ghost" size="icon">
//               <Mic className="size-4" />
//               <span className="sr-only">Use Microphone</span>
//             </Button>
//           </TooltipTrigger>
//           <TooltipContent side="top">Use Microphone</TooltipContent>
//         </Tooltip>
//         <Button type="submit" size="sm" className="ml-auto gap-1.5">
//           Send Message
//           <CornerDownLeft className="size-3.5" />
//         </Button>
//       </div>
//     </form>
//   )
// }
