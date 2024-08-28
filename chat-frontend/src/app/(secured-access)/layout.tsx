import SidebarDemo from "@/components/ui/sidebar-demo";
import CheckNumberOfReceivedRequests from "@/server-actions/check-numberof-received-requests";
import getServerSession from "../../../lib/getServerSession";



export default async function securedAccessLayout({children}: Readonly<{children: React.ReactNode;}>) {
    const session= await getServerSession();
    const userId= session?.user?.id
    const count= await CheckNumberOfReceivedRequests(userId!)
  return (
    <SidebarDemo requests={count}>{children}</SidebarDemo>

  );
}
