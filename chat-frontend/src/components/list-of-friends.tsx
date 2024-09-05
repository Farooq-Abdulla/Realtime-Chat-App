'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserMinus } from "lucide-react";
import { useState } from "react";

export default function ListOfFriends() {
  const [friends, setFriends] = useState([
    { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg?height=64&width=64", status: "online" },
    { id: 2, name: "Bob Smith", avatar: "/placeholder.svg?height=64&width=64", status: "offline" },
    { id: 3, name: "Charlie Brown", avatar: "/placeholder.svg?height=64&width=64", status: "online" },
    { id: 4, name: "Diana Prince", avatar: "/placeholder.svg?height=64&width=64", status: "offline" },
    { id: 5, name: "Ethan Hunt", avatar: "/placeholder.svg?height=64&width=64", status: "online" },
  ])

  const handleUnfriend = (id: number) => {
    setFriends(friends.filter(friend => friend.id !== id))
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-10 bg-transparent text-foreground rounded-lg drop-shadow-md hover:drop-shadow-xl  overflow-hidden no-visible-scrollbar">
      <div className="p-6 bg-inherit">
        <h2 className="text-2xl font-bold mb-4">My Friends</h2>
        <p className="text-muted-foreground">You have {friends.length} friends</p>
      </div>
      <ScrollArea className="h-[300px] no-visible-scrollbar">
        <ul className="divide-y divide-border">
          {friends.map((friend) => (
            <li key={friend.id} className="p-4 hover:bg-accent transition duration-150 ease-in-out">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={friend.avatar} alt={friend.name} />
                    <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {friend.status === "online" ? (
                        <span className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span> Online
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 mr-1"></span> Offline
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleUnfriend(friend.id)}
                  className="text-destructive-foreground hover:bg-destructive/90"
                >
                  <UserMinus className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  )
}