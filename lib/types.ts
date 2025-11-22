// Core domain types for Campus Study Hub

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
  placeId?: string;
}

export interface StudySession {
  id: string;
  hostId: string;
  host?: User;
  subject: string;
  tags: string[];
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  location: Location;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  participants?: SessionParticipant[];
}

export interface SessionParticipant {
  id: string;
  sessionId: string;
  userId: string;
  user?: User;
  status: "pending" | "approved" | "rejected";
  requestedAt: Date;
  respondedAt?: Date;
}

export interface SessionFilters {
  subject?: string;
  tags?: string[];
  date?: Date;
  maxDistance?: number;
  userLocation?: { latitude: number; longitude: number };
}

export interface SessionSearchResult extends StudySession {
  distance?: number;
  relevanceScore?: number;
  participationStatus?: "pending" | "approved" | "rejected" | null;
}
