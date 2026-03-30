import { db, type User } from "./db"

// Session management using simple in-memory storage
const sessions = new Map<string, { userId: string; expiresAt: Date }>()

export function login(email: string, password: string): { success: boolean; user?: User; sessionId?: string } {
  const user = db.findUserByEmail(email)

  if (!user || user.password !== password) {
    return { success: false }
  }

  // Create session
  const sessionId = `session_${Date.now()}_${Math.random()}`
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // 24 hour session

  sessions.set(sessionId, { userId: user.id, expiresAt })

  return { success: true, user, sessionId }
}

export function logout(sessionId: string): void {
  sessions.delete(sessionId)
}

export function validateSession(sessionId: string | null): User | null {
  if (!sessionId) return null

  const session = sessions.get(sessionId)
  if (!session) return null

  // Check if session expired
  if (session.expiresAt < new Date()) {
    sessions.delete(sessionId)
    return null
  }

  const user = db.findUserById(session.userId)
  return user || null
}

export function register(data: {
  email: string
  password: string
  name: string
  phone: string
  address: string
}): { success: boolean; message: string; user?: User } {
  // Check if email already exists
  if (db.findUserByEmail(data.email)) {
    return { success: false, message: "Email already exists" }
  }

  // Create new user
  const newUser = db.createUser(data)

  return { success: true, message: "Registration successful", user: newUser }
}
