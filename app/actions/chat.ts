"use server"

import { getCurrentUser } from "./auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function sendMessage(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const receiverId = formData.get("receiverId") as string
  const message = formData.get("message") as string

  if (!message.trim()) {
    return { success: false, message: "Message cannot be empty" }
  }

  const newMessage = db.createMessage({
    senderId: user.id,
    receiverId,
    message: message.trim(),
  })

  return { success: true, message: "Message sent", data: newMessage }
}

export async function getConversation(otherUserId: string) {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const messages = db.getConversation(user.id, otherUserId)

  // Mark messages as read
  db.markMessagesAsRead(user.id, otherUserId)

  return messages
}

export async function getPharmacists() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  return db.users.filter((u) => u.role === "Pharmacist")
}

export async function getCustomers() {
  const user = await getCurrentUser()
  if (!user || user.role !== "Pharmacist") {
    redirect("/login")
  }

  return db.users.filter((u) => u.role === "Customer")
}

export async function getUnreadCount(otherUserId: string) {
  const user = await getCurrentUser()
  if (!user) {
    return 0
  }

  return db.chatMessages.filter((m) => m.senderId === otherUserId && m.receiverId === user.id && !m.isRead).length
}
