'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useGetMessages } from "@/lib/hooks/useGetMessages"
import { useSendMessages } from "@/lib/hooks/useSendMessage"
import { Messages } from "@prisma/client"
import { useQueryClient } from "@tanstack/react-query"
import { Menu, Plus, Search, Send, X } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useSocket } from "../../../lib/global-socket-provider"
import { useGetFriends } from "../../../lib/hooks/useGetFriends"

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
}

export default function ChatWindow({ userId, chatId }: { userId: string , chatId?:string}) {
  const router= useRouter();
  const queryClient=useQueryClient();

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const sidebarRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const contactListRef = useRef<HTMLDivElement>(null)

  const { data: contacts, isLoading } = useGetFriends(userId)
  const { onlineUsers, socket } = useSocket();
  if (isLoading) <p>Loading ...</p>
  const {mutate}=useSendMessages(userId, selectedContact?.id!)
  const {data:messages, isFetching} = useGetMessages(userId, selectedContact?.id!);
  if(isFetching){
    console.log("Query is refetching...");
  }

  useEffect(()=>{
    if(!socket) return;
    socket?.on("received-msg", (response:Messages)=>{
      console.log("response i recived :" , response)
      // const updatedResponse={...response, createdAt: new Date(response.createdAt), updatedAt: new Date(response.updatedAt)}
      queryClient.setQueryData(['messages', userId, selectedContact?.id], (oldMsgs:Messages[])=>{
        return oldMsgs?[...oldMsgs, response]:[]
      })
    });
    return ()=>{
      socket.off("received-msg")
    }
  }, [queryClient, selectedContact?.id, socket, userId])
  // console.log(messages);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const filteredContacts = useMemo(() => {
    return contacts?.filter(contact =>contact.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [contacts, searchQuery])

  const handleSendMessage = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && selectedContact) {
      mutate({senderId:userId, receiverId:selectedContact.id, content:newMessage})
      setNewMessage("")
    }
  }, [newMessage, selectedContact, userId, mutate])

  // const handleAddContact = useCallback(() => {
  //   if (newContactName.trim()) {
  //     const newContact: Contact = { 
  //       id: contacts?.length + 1, 
  //       name: newContactName, 
  //       avatar: `/placeholder.svg?height=32&width=32&text=${newContactName.charAt(0)}`,
  //       status: "offline"
  //     }
  //     setContacts(prevContacts => [...prevContacts, newContact])
  //     setNewContactName("")
  //   }
  // }, [newContactName, contacts.length])

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev)
  }, [])

  return (
    <div className="flex h-full bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          transition-transform duration-300 ease-in-out
          fixed md:relative z-40 w-64 h-full
          bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700
          md:translate-x-0 flex flex-col
        `}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">Contacts</h2>
          <div className="flex items-center space-x-2">
            {/* <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="hover:bg-gray-200 dark:hover:bg-gray-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-60 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200">Add New Contact</h3>
                  <Input
                    placeholder="Contact name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  />
                  <Button onClick={()=>console.log("clicked")} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Add Contact
                  </Button>
                </div>
              </PopoverContent>
            </Popover> */}
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
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{contact.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">Click to chat</p>
                </div>
                <div className={`w-2 h-2 rounded-full ${onlineUsers.has(contact.id) ? "bg-green-500" : "bg-gray-500 dark:bg-gray-600"}`} />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
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

        {selectedContact ? (
          <>
            <div className="hidden md:block p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">{selectedContact.name}</h2>
            </div>
            <ScrollArea className="flex-grow p-4 bg-white dark:bg-gray-900">
              {messages?.filter((msg)=> msg.senderId===selectedContact.id || msg.receiverId===selectedContact.id)?.sort((a,b)=>new Date(a.createdAt)?.getTime()-new Date(b.createdAt)?.getTime())?.map((message) => (
                <div key={message.id} className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"} mb-4`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${message.senderId === userId
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}>
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">{new Date(message.createdAt).toLocaleTimeString()}</p>
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
      </div>``
    </div>
  )
}