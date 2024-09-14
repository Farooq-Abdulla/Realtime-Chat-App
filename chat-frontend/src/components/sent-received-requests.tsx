'use client';


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GetAllReceivedRequests from "@/server-actions/get-received-requests";
import GetAllSentRequests from "@/server-actions/get-sent-requests";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAcceptFriendRequest } from "../../lib/hooks/useAcceptFriendRequest";
import { useRejectFriendRequest } from "../../lib/hooks/useRejectFriendRequest";

export default function ChatRequestsComponent({ userId }: { userId: string }) {
  const router = useRouter();

  const { data: incomingRequests, isLoading: incomingLoading } = useQuery({
    queryKey: ["incomingRequests"],
    queryFn: () => GetAllReceivedRequests(userId!),
    enabled: !!userId,
  });
  const { data: outgoingRequests, isLoading: outgoingLoading } = useQuery({
    queryKey: ["outgoingRequests"],
    queryFn: () => GetAllSentRequests(userId!),
    enabled: !!userId,
  });

  const { mutate: acceptFriendRequest, isPending:AcceptReqLoading} = useAcceptFriendRequest(userId);
  const { mutate: rejectFriendRequest, isPending:RejectReqLoading } = useRejectFriendRequest(userId);

  const handleAccept = (id: string) => {
    acceptFriendRequest(id);
  }

  const handleReject = (id: string) => {
    rejectFriendRequest(id)
  }

  const handleCancelOutgoing = (id: string) => {
    rejectFriendRequest(id);
  }

  return (
    <Card className="w-full max-w-2xl mx-auto dark:bg-inherit">
      <CardHeader>
        <CardTitle>Chat Requests</CardTitle>
        <CardDescription>Manage your chat requests</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="incoming">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="incoming">Incoming Requests</TabsTrigger>
            <TabsTrigger value="outgoing">Outgoing Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="incoming">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {incomingLoading ? (
                <p>Loading incoming requests...</p>
              ) : incomingRequests?.length === 0 ? (
                <div>
                  <p>No incoming requests found.</p>
                </div>
              ) : (
                incomingRequests?.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between shadow-md py-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={request.avatar!} alt={request.name!} />
                        <AvatarFallback>{request?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{request.name}</span>
                    </div>
                    <div className="space-x-2">
                      <Button size="sm" onClick={() => handleAccept(request.id)}>
                        <Check className="mr-2 h-4 w-4" /> Accept {AcceptReqLoading &&<Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(request.id)}>
                        <X className="mr-2 h-4 w-4" /> Reject {RejectReqLoading&&<Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="outgoing">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {outgoingLoading ? (
                <p>Loading outgoing requests...</p>
              ) : outgoingRequests?.length === 0 ? (
                <div className="flex justify-center items-center gap-3">
                  <p>No outgoing requests found.</p>
                  <Button onClick={() => router.push("/dashboard")}><UserPlus className="h-4 w-4 mr-2" />Send one </Button>
                </div>
              ) : (
                outgoingRequests?.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between shadow-md py-4 border-b last:border-b-0"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={request.avatar} alt={request.name!} />
                        <AvatarFallback>{request?.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{request.name}</span>
                    </div>
                    <div className="space-x-2">
                      <span className="text-sm text-muted-foreground mr-2">{request.status}</span>
                      <Button size="sm" variant="outline" onClick={() => handleCancelOutgoing(request.id)}>
                        Cancel {RejectReqLoading&&<Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}