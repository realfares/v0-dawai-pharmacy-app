"use server"

import { getCurrentUser } from "./auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function getPendingPrescriptions() {
  const user = await getCurrentUser()
  if (!user || user.role !== "Pharmacist") {
    redirect("/login")
  }

  return db.getPendingPrescriptions()
}

export async function reviewPrescription(formData: FormData) {
  const user = await getCurrentUser()
  if (!user || user.role !== "Pharmacist") {
    redirect("/login")
  }

  const prescriptionId = formData.get("prescriptionId") as string
  const status = formData.get("status") as "Approved" | "Rejected"
  const notes = formData.get("notes") as string

  const prescription = db.updatePrescription(prescriptionId, {
    status,
    pharmacistId: user.id,
    pharmacistNotes: notes,
    reviewDate: new Date(),
  })

  return { success: true, message: "Prescription reviewed successfully", prescription }
}

export async function getAllOrdersForPharmacist() {
  const user = await getCurrentUser()
  if (!user || user.role !== "Pharmacist") {
    redirect("/login")
  }

  return db.getAllOrders()
}

export async function updateOrderStatusAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user || user.role !== "Pharmacist") {
    redirect("/login")
  }

  const orderId = formData.get("orderId") as string
  const status = formData.get("status") as "Pending" | "Processing" | "Completed" | "Cancelled"

  const order = db.updateOrderStatus(orderId, status)

  return { success: true, message: "Order status updated", order }
}
