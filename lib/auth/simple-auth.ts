// Simple authentication system for Campus Study Hub
// Uses PostgreSQL with bcrypt for password hashing

import bcrypt from "bcryptjs";
import { query, queryOne } from "../db";
import type { User } from "../types";

export async function signIn(email: string, password: string): Promise<User> {
  // Simple email validation
  if (!email.endsWith(".edu")) {
    throw new Error("Must use a .edu email address");
  }

  const user = await queryOne<any>("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (!user) {
    throw new Error("Account not found. Please sign up first.");
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    throw new Error("Incorrect password. Please try again.");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: new Date(user.created_at),
  };
}

export async function signUp(
  email: string,
  name: string,
  password: string
): Promise<User> {
  if (!email.endsWith(".edu")) {
    throw new Error("Must use a .edu email address");
  }

  const existingUser = await queryOne<any>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser) {
    throw new Error("Account already exists. Please sign in instead.");
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await queryOne<any>(
    `INSERT INTO users (email, name, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, email, name, created_at`,
    [email, name, passwordHash]
  );

  if (!user) {
    throw new Error("Failed to create user");
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: new Date(user.created_at),
  };
}

export async function getCurrentUser(userId: string): Promise<User | null> {
  const user = await queryOne<any>(
    "SELECT id, email, name, created_at FROM users WHERE id = $1",
    [userId]
  );

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: new Date(user.created_at),
  };
}

export async function signOut(): Promise<void> {
  // Clear session (implement with cookies/sessions)
}
