import { type NextRequest, NextResponse } from "next/server";
import { getSessionRepository } from "@/lib/repository/session-repository";
import { getSessionMediator } from "@/lib/mediator/session-mediator";
import type { StudySession } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const sessionRepo = getSessionRepository();
    const sessions = await sessionRepo.findUpcoming();

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("[v0] Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      hostId,
      subject,
      tags,
      date,
      startTime,
      endTime,
      capacity,
      address,
      description,
    } = body;

    if (
      !hostId ||
      !subject ||
      !date ||
      !startTime ||
      !endTime ||
      !capacity ||
      !address
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: hostId, subject, date, startTime, endTime, capacity, address",
        },
        { status: 400 }
      );
    }

    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(hostId)) {
      return NextResponse.json(
        { error: "Invalid hostId format. Must be a valid UUID." },
        { status: 400 }
      );
    }

    if (typeof capacity !== "number" || capacity <= 0) {
      return NextResponse.json(
        { error: "Capacity must be a positive number" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";
    const geocodeResponse = await fetch(
      `${baseUrl}/api/geocode?address=${encodeURIComponent(address)}`
    );

    if (!geocodeResponse.ok) {
      return NextResponse.json(
        { error: "Failed to geocode address" },
        { status: 500 }
      );
    }

    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.found) {
      return NextResponse.json(
        { error: "Address not found. Please provide a valid address." },
        { status: 400 }
      );
    }

    const location = {
      address: geocodeData.formattedAddress,
      latitude: geocodeData.lat,
      longitude: geocodeData.lng,
      placeId: geocodeData.placeId,
    };

    const sessionRepo = getSessionRepository();
    const session = await sessionRepo.create({
      hostId,
      subject,
      tags: tags || [],
      date: new Date(date),
      startTime,
      endTime,
      capacity,
      location,
      description,
    } as Omit<StudySession, "id" | "createdAt" | "updatedAt">);

    const mediator = getSessionMediator();
    mediator.notifySessionCreated(session.id);

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("[v0] Error creating session:", error);

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "22P02"
    ) {
      return NextResponse.json(
        { error: "Invalid UUID format for hostId" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
