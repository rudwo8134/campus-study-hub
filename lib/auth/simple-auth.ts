// Simple authentication system for Campus Study Hub
// Uses email-based sessions (can be enhanced with proper auth later)

import type { User } from "../types"

// In-memory user store (replace with database)
const users = new Map<string, User & { password?: string }>()

export async function signIn(email: string, password: string): Promise<User> {
  // Simple email validation
  if (!email.endsWith(".edu")) {
    throw new Error("Must use a .edu email address")
  }

  const user = Array.from(users.values()).find((u) => u.email === email)

  if (!user) {
    throw new Error("Account not found. Please sign up first.")
  }

  if (user.password && user.password !== password) {
    throw new Error("Incorrect password. Please try again.")
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  }
}

export async function signUp(email: string, name: string, password: string): Promise<User> {
  if (!email.endsWith(".edu")) {
    throw new Error("Must use a .edu email address")
  }

  const existingUser = Array.from(users.values()).find((u) => u.email === email)
  if (existingUser) {
    throw new Error("Account already exists. Please sign in instead.")
  }

  const user = {
    id: crypto.randomUUID(),
    email,
    name,
    password,
    createdAt: new Date(),
  }
  users.set(user.id, user)

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
  }
}

export async function getCurrentUser(userId: string): Promise<User | null> {
  return users.get(userId) || null
}

export async function signOut(): Promise<void> {
  // Clear session (implement with cookies/sessions)
}
