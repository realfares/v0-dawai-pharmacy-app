"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { sendMessage, getConversation } from "@/app/actions/chat"
import { Send, User } from "lucide-react"
import type { User as UserType, ChatMessage } from "@/lib/db"

interface ChatInterfaceProps {
  currentUser: UserType
  otherUsers: UserType[]
}

export function ChatInterface({ currentUser, otherUsers }: ChatInterfaceProps) {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (selectedUser) {
      loadMessages()
    }
  }, [selectedUser])

  const loadMessages = async () => {
    if (!selectedUser) return
    const conversation = await getConversation(selectedUser.id)
    setMessages(conversation)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser || isLoading) return

    setIsLoading(true)
    const formData = new FormData()
    formData.append("receiverId", selectedUser.id)
    formData.append("message", newMessage)

    const result = await sendMessage(formData)
    if (result.success) {
      setNewMessage("")
      await loadMessages()
    }
    setIsLoading(false)
  }

  // Auto-refresh messages every 3 seconds
  useEffect(() => {
    if (!selectedUser) return

    const interval = setInterval(() => {
      loadMessages()
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedUser])

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
      {/* Users List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">{currentUser.role === "Customer" ? "Pharmacists" : "Customers"}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {otherUsers.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                No {currentUser.role === "Customer" ? "pharmacists" : "customers"} available
              </div>
            ) : (
              otherUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors ${
                    selectedUser?.id === user.id ? "bg-muted" : ""
                  }`}
                >
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left flex-1">
                    <p className="font-medium text-foreground text-sm">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2 flex flex-col">
        {selectedUser ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {selectedUser.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedUser.fullName}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedUser.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isCurrentUser = msg.senderId === currentUser.id
                  return (
                    <div key={msg.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="border-t p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button type="submit" disabled={isLoading || !newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Select a {currentUser.role === "Customer" ? "pharmacist" : "customer"} to start chatting
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
