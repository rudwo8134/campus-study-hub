"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { LocationInput } from "./location-input"
import type { GeocodingResult } from "@/lib/geocoding/geocoding-provider"

interface CreateSessionFormProps {
  onSuccess?: () => void
}

export function CreateSessionForm({ onSuccess }: CreateSessionFormProps) {
  const [subject, setSubject] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [capacity, setCapacity] = useState("6")
  const [address, setAddress] = useState("")
  const [geocodedLocation, setGeocodedLocation] = useState<GeocodingResult | null>(null)
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleLocationChange = (newAddress: string, location?: GeocodingResult) => {
    setAddress(newAddress)
    if (location) {
      setGeocodedLocation(location)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      // Mock user ID (replace with actual auth)
      const userId = "mock-user-id"

      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostId: userId,
          subject,
          tags,
          date,
          startTime,
          endTime,
          capacity: Number.parseInt(capacity),
          address,
          description,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create session")
      }

      // Reset form
      setSubject("")
      setTags([])
      setDate("")
      setStartTime("")
      setEndTime("")
      setCapacity("6")
      setAddress("")
      setGeocodedLocation(null)
      setDescription("")

      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-balance">Create Study Session</CardTitle>
        <CardDescription>Host a study group and invite peers to join</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Subject */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="e.g., Calculus II, Organic Chemistry"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tags (e.g., math, midterm)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag()
                  }
                }}
              />
              <Button type="button" onClick={addTag} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
            </div>
          </div>

          {/* Capacity */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="50"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">Maximum number of participants</p>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="address">Meeting Location</Label>
            <LocationInput
              value={address}
              onChange={handleLocationChange}
              placeholder="e.g., Main Library, Study Room 301"
            />
            <p className="text-sm text-muted-foreground">Enter a specific location on campus</p>
            {geocodedLocation && (
              <p className="text-xs text-muted-foreground">
                Coordinates: {geocodedLocation.latitude.toFixed(4)}, {geocodedLocation.longitude.toFixed(4)}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What will you be studying? Any materials needed?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating..." : "Create Study Session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
