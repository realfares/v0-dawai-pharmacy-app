"use server"

import { getCurrentUser } from "./auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function uploadPrescription(formData: FormData) {
  const user = await getCurrentUser()
  if (!user || user.role !== "Customer") {
    redirect("/login")
  }

  const file = formData.get("prescription") as File
  if (!file) {
    return { success: false, message: "No file provided" }
  }

  // In a real app, you would upload to cloud storage
  // For demo, we'll use a placeholder URL
  const imageUrl = `/placeholder.svg?height=400&width=600&query=prescription-document`

  const prescription = db.createPrescription({
    customerId: user.id,
    imageUrl,
  })

  return { success: true, message: "Prescription uploaded successfully", prescription }
}

export async function getCustomerPrescriptions() {
  const user = await getCurrentUser()
  if (!user || user.role !== "Customer") {
    redirect("/login")
  }

  return db.getPrescriptionsByCustomer(user.id)
}

export async function getCustomerOrders() {
  const user = await getCurrentUser()
  if (!user || user.role !== "Customer") {
    redirect("/login")
  }

  return db.getOrdersByCustomer(user.id)
}

export async function createOrder(formData: FormData) {
  const user = await getCurrentUser()
  if (!user || user.role !== "Customer") {
    redirect("/login")
  }

  const medicineId = formData.get("medicineId") as string
  const quantity = Number.parseInt(formData.get("quantity") as string)
  const deliveryAddress = formData.get("deliveryAddress") as string
  const paymentMethod = formData.get("paymentMethod") as string

  const medicine = db.getMedicineById(medicineId)
  if (!medicine) {
    return { success: false, message: "Medicine not found" }
  }

  if (medicine.stockQuantity < quantity) {
    return { success: false, message: "Insufficient stock" }
  }

  const order = db.createOrder({
    customerId: user.id,
    items: [
      {
        medicineId: medicine.id,
        medicineName: medicine.name,
        quantity,
        price: medicine.price,
      },
    ],
    totalAmount: medicine.price * quantity,
    deliveryAddress,
    paymentMethod,
  })

  // Update stock
  db.updateMedicine(medicineId, {
    stockQuantity: medicine.stockQuantity - quantity,
  })

  return { success: true, message: "Order placed successfully", order }
}
