
import SidebarDemo from "@/components/ui/sidebar-demo";
import getServerSession from "@/lib/getServerSession";



export default async function SecuredAccessLayout({children}: {children: React.ReactNode;}) {
  const session=await getServerSession()
  const userId=session?.user?.id
  // const count= await CheckNumberOfReceivedRequests(userId!);
  
    // const {data:count}= useCheckNumberOfReceivedRequests(userId!)
    // console.log('from layout page ', count); 
    // const {socket}=useSocket();
    // const queryClient=useQueryClient();
    // useEffect(()=>{
    //     if(!socket) return;
    //     socket?.on('friendRequest', (count:number)=>{
    //       console.log("in friendRequest effect and the count is ", count);
    //       queryClient.invalidateQueries({queryKey:["receivedRequestsCount", userId]})
    //     })

    //     return ()=>{
    //         socket.off('friendRequest')
    //     }
    // },[queryClient, socket, userId, count])
  return (
    <SidebarDemo>{children}</SidebarDemo>

  );
}
