'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import useCheckReceivedMessages from "@/lib/hooks/useCheckReceivedMsgsCount"
import { useGetMessages } from "@/lib/hooks/useGetMessages"
import { useSendMessages } from "@/lib/hooks/useSendMessage"
import UpdateMessageStatus from "@/server-actions/update-msg-status"
import { Messages } from "@prisma/client"
import { IconCheck, IconChecks } from "@tabler/icons-react"
import { useQueryClient } from "@tanstack/react-query"
import { Menu, Plus, Search, Send, X } from "lucide-react"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSocket } from "../../../lib/global-socket-provider"
import { useGetFriends } from "../../../lib/hooks/useGetFriends"
import { Badge } from "./badge"

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
}

export default function ChatWindow({ userId, chatId }: { userId: string, chatId?: string }) {
  const queryClient = useQueryClient();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAtBottom, setIsAtBottom] = useState(false)
  // const [unreadMsgs, setUnreadMsgs]=  useState<Record<string,number>>({})
  // console.log(unreadMsgs);

  const sidebarRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const contactListRef = useRef<HTMLDivElement>(null)

  const { data: contacts, isLoading } = useGetFriends(userId)
  const { onlineUsers, socket } = useSocket();
  if (isLoading) <p>Loading ...</p>
  const { mutate } = useSendMessages(userId, selectedContact?.id!)
  const { data: messages, isFetching } = useGetMessages(userId, selectedContact?.id!);
  const {data:unreadMsgs}=useCheckReceivedMessages(userId)

  // console.log("online users from chat window", onlineUsers);


  //when i send a msg , 3 things happen. 
  // 1) store in the DB, while storing in DB check if the user is online
  // 2) emit to WSS 


  // 1)
  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && selectedContact) {
      mutate({ senderId: userId, receiverId: selectedContact.id, content: newMessage ,online: onlineUsers.has(selectedContact.id)})
      setNewMessage("")
    }
  }, [newMessage, selectedContact, mutate, userId, onlineUsers])

  

  // whenever i receive a msg , this means , the msg is stored in DB and WSS is emitting "recived-msg"
  // I have to emit to WSS that i've read the msg. so that there is an update in DB and UI

  useEffect(() => {
    const arr = messages?.filter((message) => message.senderId === selectedContact?.id).filter((message) => message.status !== 'read') || []
    if (isAtBottom && arr.length > 0) {
      socket?.emit("read-msg", arr, selectedContact?.id)
      // setUnreadMsgs((prevUnreadMsgs)=>{
      //   return {...prevUnreadMsgs, [selectedContact?.id!]:0}
      // })
      queryClient.setQueryData(['count',userId], (oldObj:Record<string, number>)=>{
        return {...oldObj, [selectedContact?.id!]:0}
      })
    }
  }, [isAtBottom, messages, queryClient, selectedContact?.id, selectedContact?.name, socket, userId])



  
  useEffect(() => {
    if (!socket) return;
    socket?.on("received-msg", (response: Messages) => {
      // queryClient.setQueryData(['messages', userId, selectedContact?.id], (oldMsgs: Messages[]) => {
      //   const newMsgs= oldMsgs ? [...oldMsgs, response] : []
      //   console.log(newMsgs)
      //   return newMsgs
      // })

      //who sent me how many msgs 
      queryClient.setQueryData(['count', userId], (oldObj:Record<string,number>)=>{
        const senderId=response.senderId;
        const currentCount= oldObj[senderId]|0
        return {...oldObj, [senderId]:currentCount+1}
      })

      // setUnreadMsgs((prevUnreadMsgs)=>{
      //   const senderId=response.senderId;
      //   const currentCount= prevUnreadMsgs[senderId]|0
      //   return {...prevUnreadMsgs, [senderId]:currentCount+1}
      // })
      queryClient.invalidateQueries({ queryKey: ["messages", userId, selectedContact?.id] })
    });


    socket?.on("read-msg", (response: Messages[]) => {
      response.forEach(async (message) => {
        await UpdateMessageStatus(message.id, "read")

      })
      // queryClient.invalidateQueries({ queryKey: ["messages", userId, selectedContact?.id] })
      queryClient.setQueryData(['messages', userId, selectedContact?.id], (oldMsgs: Messages[]) => {
        return oldMsgs.map(msg => {
          const foundMessage = response.find(res => res.id === msg.id);
          return foundMessage ? { ...msg, status: 'read' } : { ...msg };
        });
      });

    });


    return () => {
      socket.off("received-msg");
      socket.off("read-msg")
    }

  }, [queryClient, selectedContact?.id, socket, userId])




  {/* Mobile Sidebar */}
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])



  // scroll down to bottom , when opened a chat 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    setIsAtBottom(true)
  }, [messages, setIsAtBottom])

  


  const filteredContacts = useMemo(() => {
    return contacts?.filter(contact => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [contacts, searchQuery])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])


  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-gray-300 dark:border-gray-700 flex items-center bg-white dark:bg-gray-900">
        <Button
          size="icon"
          variant="ghost"
          className="mr-4 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </Button>
        <h2 className="font-semibold text-gray-800 dark:text-gray-200">
          {selectedContact ? selectedContact.name : "Chat"}
        </h2>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          ref={sidebarRef}
          className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            transition-transform duration-300 ease-in-out
            fixed md:relative z-40 w-64 h-[calc(100vh-4rem)]
            bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700
            md:translate-x-0 flex flex-col
          `}
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200">Chats</h2>
            <div className="flex items-center space-x-2">
              <Button size="icon" variant="ghost" className="hover:bg-gray-200 dark:hover:bg-gray-700">
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="md:hidden hover:bg-gray-200 dark:hover:bg-gray-700" onClick={toggleSidebar}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search contacts"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>
          <ScrollArea className="flex-grow">
            <div ref={contactListRef}>
              {filteredContacts?.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center space-x-4 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${selectedContact?.id === contact.id ? "bg-gray-200 dark:bg-gray-700" : ""}`}
                  onClick={() => {
                    setSelectedContact(contact)
                    setIsSidebarOpen(false)
                  }}
                >
                  <Avatar>
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback className="bg-gray-400 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                      {contact.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    {(unreadMsgs&& unreadMsgs[contact.id]>0) ? <Badge position="right-side" content={unreadMsgs[contact.id]}><p className="text-sm font-medium text-gray-800 dark:text-gray-200">{contact.name}</p></Badge>:<p className="text-sm font-medium text-gray-800 dark:text-gray-200">{contact.name}</p>}
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">Click to chat</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${onlineUsers.has(contact.id) ? "bg-green-500" : "bg-gray-500 dark:bg-gray-600"}`} />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedContact ? (
            <>
              <div className="hidden md:block p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
                <h2 className="font-semibold text-gray-800 dark:text-gray-200">{selectedContact.name}</h2>
              </div>
             <ScrollArea className="flex-1 p-4 bg-white dark:bg-gray-900" id="scroll-area">
              {messages?.filter((msg) => msg.senderId === selectedContact.id || msg.receiverId === selectedContact.id)?.sort((a, b) => new Date(a.createdAt)?.getTime() - new Date(b.createdAt)?.getTime())?.map((message) => (
                <div key={message.id} className={`flex  ${message.senderId === userId ? "justify-end" : "justify-start"} mb-4`}>
                  <div className={`max-w-[75%] rounded-lg p-3 ${message.senderId === userId
                    ? `bg-blue-600 text-white `
                    : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}>
                    <p className={`break-words whitespace-pre-wrap text-sm`}>{message.content}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs opacity-70">{new Date(message.createdAt).toLocaleTimeString()}</p>
                      {message.senderId === userId && (
                        <span className="ml-2">
                          {message.status === 'read' ? (
                            <IconChecks stroke={1} color="var(--black)" className="size-4 opacity-70" />
                          ) : message.status === 'delivered' ? (
                            <IconChecks stroke={1} className="size-4 opacity-70" />
                          ) : (
                            <IconCheck stroke={1} className="size-4 opacity-70" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 overflow-hidden"
                />
                <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900">
              Select a contact to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  )
}