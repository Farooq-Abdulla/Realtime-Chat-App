'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Send } from "lucide-react"
import React, { useState } from "react"

export default function AdaptiveThemeChatComponent() {
  const [selectedContact, setSelectedContact] = useState<any>(null)
  const [messages, setMessages] = useState<any>([])
  const [newMessage, setNewMessage] = useState("")
  const [contacts, setContacts] = useState([
    { id: 1, name: "Alice Johnson", avatar: "/placeholder.svg?height=32&width=32", status: "online" },
    { id: 2, name: "Bob Smith", avatar: "/placeholder.svg?height=32&width=32", status: "offline" },
    { id: 3, name: "Charlie Brown", avatar: "/placeholder.svg?height=32&width=32", status: "online" },
  ])
  const [newContactName, setNewContactName] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && selectedContact) {
      setMessages([...messages, { id: messages.length + 1, sender: "You", content: newMessage, timestamp: new Date() }])
      setNewMessage("")
    }
  }

  const handleAddContact = () => {
    if (newContactName.trim()) {
      setContacts([...contacts, { 
        id: contacts.length + 1, 
        name: newContactName, 
        avatar: `/placeholder.svg?height=32&width=32&text=${newContactName.charAt(0)}`,
        status: "offline"
      }])
      setNewContactName("")
    }
  }

  return (
    <div className="flex h-[600px] bg-white dark:bg-gray-900 text-gray-800 mt-12 dark:text-gray-100 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700">
        <div className="p-4 flex justify-between items-center">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">Contacts</h2>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost" className="hover:bg-gray-200 dark:hover:bg-gray-700">
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add contact</span>
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
                <Button onClick={handleAddContact} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Add Contact
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <ScrollArea className="h-[calc(600px-64px)]">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`flex items-center space-x-4 p-4 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${
                selectedContact?.id === contact.id ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
              onClick={() => setSelectedContact(contact)}
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
              <div className={`w-2 h-2 rounded-full ${contact.status === "online" ? "bg-green-500" : "bg-gray-500 dark:bg-gray-600"}`} />
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-gray-300 dark:border-gray-700">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200">{selectedContact.name}</h2>
            </div>
            <ScrollArea className="flex-1 p-4">
              {messages.map((message:any) => (
                <div key={message.id} className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"} mb-4`}>
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender === "You" 
                      ? "bg-blue-600 text-white" 
                      : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}>
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">{message.timestamp.toLocaleTimeString()}</p>
                  </div>
                </div>
              ))}
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-300 dark:border-gray-700 flex items-center space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <Button type="submit" size="icon" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600 dark:text-gray-400">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  )
}
