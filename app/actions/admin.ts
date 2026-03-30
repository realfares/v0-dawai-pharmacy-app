"use server"

import { getCurrentUser } from "./auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import type { UserRole } from "@/lib/db"

export async function getAllUsers() {
  const user = await getCurrentUser()
  if (!user || user.role !== "Admin") {
    redirect("/login")
  }

  return db.users
}

export async function createUser(formData: FormData) {
  const user = await getCurrentUser()
  if (!user || user.role !== "Admin") {
    redirect("/login")
  }

  const username = formData.get("username") as string
  const password = formData.get("password") as string
  const email = formData.get("email") as string
  const fullName = formData.get("fullName") as string
  const role = formData.get("role") as UserRole
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  // Check if username exists
  if (db.findUserByUsername(username)) {
    return { success: false, message: "Username already exists" }
  }

  const newUser = db.createUser({
    username,
    password,
    email,
    fullName,
    role,
    phone,
    address,
  })

  return { success: true, message: "User created successfully", user: newUser }
}

export async function getAllMedicines() {
  const user = await getCurrentUser()
  if (!user || user.role !== "Admin") {
    redirect("/login")
  }

  return db.getAllMedicines()
}

export async function createMedicine(formData: FormData) {
  const user = await getCurrentUser()
  if (!user || user.role !== "Admin") {
    redirect("/login")
  }

  const name = formData.get("name") as string
  const category = formData.get("category") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const stockQuantity = Number.parseInt(formData.get("stockQuantity") as string)
  const description = formData.get("description") as string
  const manufacturer = formData.get("manufacturer") as string

  const medicine = db.createMedicine({
    name,
    category,
    price,
    stockQuantity,
    description,
    manufacturer,
  })

  return { success: true, message: "Medicine added successfully", medicine }
}

export async function updateMedicine(formData: FormData) {
  const user = await getCurrentUser()
  if (!user || user.role !== "Admin") {
    redirect("/login")
  }

  const id = formData.get("medicineId") as string
  const stockQuantity = Number.parseInt(formData.get("stockQuantity") as string)
  const price = Number.parseFloat(formData.get("price") as string)

  const medicine = db.updateMedicine(id, {
    stockQuantity,
    price,
  })

  return { success: true, message: "Medicine updated successfully", medicine }
}

export async function getAllOrdersForAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== "Admin") {
    redirect("/login")
  }

  return db.getAllOrders()
}

export async function getAllPrescriptionsForAdmin() {
  const user = await getCurrentUser()
  if (!user || user.role !== "Admin") {
    redirect("/login")
  }

  return db.prescriptions
}
