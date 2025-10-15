"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import type { SessionFilters as Filters } from "@/lib/types"
import type { RankingType } from "@/lib/ranking/ranking-factory"

interface SessionFiltersProps {
  onFilterChange: (filters: Filters, rankingType?: RankingType) => void
}

export function SessionFilters({ onFilterChange }: SessionFiltersProps) {
  const [subject, setSubject] = useState("")
  const [date, setDate] = useState("")
  const [maxDistance, setMaxDistance] = useState("10")
  const [rankingType, setRankingType] = useState<RankingType>("relevance")
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleApplyFilters = () => {
    const filters: Filters = {}

    if (subject) filters.subject = subject
    if (date) filters.date = new Date(date)
    if (maxDistance) filters.maxDistance = Number.parseFloat(maxDistance)

    onFilterChange(filters, rankingType)
  }

  const handleReset = () => {
    setSubject("")
    setDate("")
    setMaxDistance("10")
    setRankingType("relevance")
    onFilterChange({}, "relevance")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowAdvanced(!showAdvanced)}>
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            {showAdvanced ? "Hide" : "Show"} Advanced
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {/* Subject Search */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="subject-filter">Subject</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="subject-filter"
              placeholder="Search by subject..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Date Filter */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="date-filter">Date</Label>
          <Input id="date-filter" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {showAdvanced && (
          <>
            {/* Distance Filter */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="distance-filter">Max Distance (km)</Label>
              <Input
                id="distance-filter"
                type="number"
                min="1"
                max="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="ranking-filter">Sort By</Label>
              <Select value={rankingType} onValueChange={(value) => setRankingType(value as RankingType)}>
                <SelectTrigger id="ranking-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="time">Soonest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
