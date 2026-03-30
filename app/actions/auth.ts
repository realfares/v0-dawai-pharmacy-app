"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { login as authLogin, logout as authLogout, register as authRegister, validateSession } from "@/lib/auth"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const result = authLogin(email, password)

  if (result.success && result.sessionId) {
    const cookieStore = await cookies()
    cookieStore.set("sessionId", result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    redirect("/")
  }

  return { success: false, message: "Invalid credentials" }
}

export async function logout() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value

  if (sessionId) {
    authLogout(sessionId)
    cookieStore.delete("sessionId")
  }

  redirect("/login")
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const address = formData.get("address") as string

  const result = authRegister({
    email,
    password,
    name,
    phone,
    address,
  })

  if (result.success) {
    // Auto-login after registration
    const loginResult = authLogin(email, password)
    if (loginResult.success && loginResult.sessionId) {
      const cookieStore = await cookies()
      cookieStore.set("sessionId", loginResult.sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
      })
      redirect("/")
    }
  }

  return result
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value || null
  return validateSession(sessionId)
}
