'use client';


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X } from "lucide-react";
import { useState } from "react";

export default function ChatRequestsComponent() {
  const [incomingRequests, setIncomingRequests] = useState([
    { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "Bob Smith", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "Charlie Brown", avatar: "/placeholder.svg?height=40&width=40" },

  ])

  const [outgoingRequests, setOutgoingRequests] = useState([
    { id: 4, name: "Diana Prince", avatar: "/placeholder.svg?height=40&width=40", status: "Pending" },
    { id: 5, name: "Ethan Hunt", avatar: "/placeholder.svg?height=40&width=40", status: "Pending" },
  ])

  const handleAccept = (id: number) => {
    setIncomingRequests(incomingRequests.filter(request => request.id !== id))
    // Add logic to handle accepted request
  }

  const handleReject = (id: number) => {
    setIncomingRequests(incomingRequests.filter(request => request.id !== id))
    // Add logic to handle rejected request
  }

  const handleCancelOutgoing = (id: number) => {
    setOutgoingRequests(outgoingRequests.filter(request => request.id !== id))
    // Add logic to handle cancelling outgoing request
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
              {incomingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between shadow-md py-4 border-b last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={request.avatar} alt={request.name} />
                      <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{request.name}</span>
                  </div>
                  <div className="space-x-2">
                    <Button size="sm" onClick={() => handleAccept(request.id)}>
                      <Check className="mr-2 h-4 w-4" /> Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(request.id)}>
                      <X className="mr-2 h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="outgoing">
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              {outgoingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between shadow-md py-4 border-b last:border-b-0">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={request.avatar} alt={request.name} />
                      <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{request.name}</span>
                  </div>
                  <div className="space-x-2">
                    <span className="text-sm text-muted-foreground mr-2">{request.status}</span>
                    <Button size="sm" variant="outline" onClick={() => handleCancelOutgoing(request.id)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}