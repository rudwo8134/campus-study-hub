import { type NextRequest, NextResponse } from "next/server";
import { getSessionRepository } from "@/lib/repository/session-repository";
import { queryOne, query } from "@/lib/db";
import { randomUUID } from "crypto";

// Predefined data for generation
const SUBJECTS = [
  "Mathematics",
  "Physics",
  "Computer Science",
  "Chemistry",
  "Biology",
  "Economics",
  "Psychology",
  "History",
  "Literature",
  "Engineering",
];

const TAGS = [
  "exam-prep",
  "homework",
  "group-project",
  "discussion",
  "quiet-study",
  "tutoring",
  "review",
];

const LOCATIONS = [
  {
    name: "Toronto",
    lat: 43.6532,
    lng: -79.3832,
    addresses: [
      "Toronto Reference Library",
      "Robarts Library",
      "Gerstein Science Information Centre",
      "Ryerson University Library",
      "Toronto Public Library - Fort York",
    ],
  },
  {
    name: "Mississauga",
    lat: 43.589,
    lng: -79.6441,
    addresses: [
      "Mississauga Central Library",
      "UTM Library",
      "Port Credit Library",
      "Sheridan College Hazel McCallion Campus",
      "Mississauga Valley Library",
    ],
  },
];

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get("count") || "10", 10);
    
    // 1. Ensure we have a host user
    let hostId: string = "1ee0edfe-ddc6-4aef-aa3e-3c5e0cd2088e";

    const sessionRepo = getSessionRepository();
    const createdSessions = [];

    for (let i = 0; i < count; i++) {
      // Randomly select location (Toronto or Mississauga)
      const locationBase = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      
      // Add small random variation to coordinates (approx 1-2km)
      const latVariation = (Math.random() - 0.5) * 0.02;
      const lngVariation = (Math.random() - 0.5) * 0.02;
      
      const address = locationBase.addresses[Math.floor(Math.random() * locationBase.addresses.length)];
      
      // Random date within next 30 days
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 30));
      
      // Random time between 8am and 8pm
      const startHour = 8 + Math.floor(Math.random() * 12);
      const startTime = `${startHour.toString().padStart(2, "0")}:00`;
      const endTime = `${(startHour + 2).toString().padStart(2, "0")}:00`;

      const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
      const numTags = 1 + Math.floor(Math.random() * 3);
      const selectedTags = [];
      for (let j = 0; j < numTags; j++) {
        selectedTags.push(TAGS[Math.floor(Math.random() * TAGS.length)]);
      }

      const session = await sessionRepo.create({
        hostId,
        subject,
        tags: [...new Set(selectedTags)], // Remove duplicates
        date,
        startTime,
        endTime,
        capacity: 2 + Math.floor(Math.random() * 8), // 2-10 people
        location: {
          address,
          latitude: locationBase.lat + latVariation,
          longitude: locationBase.lng + lngVariation,
        },
        description: `Study session for ${subject}. Everyone is welcome!`,
      });
      
      createdSessions.push(session);
    }

    return NextResponse.json({
      message: `Successfully created ${createdSessions.length} sessions`,
      sessions: createdSessions,
    });
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json(
      { error: "Failed to seed data" },
      { status: 500 }
    );
  }
}
