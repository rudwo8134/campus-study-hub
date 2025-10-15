import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MapPin, Users, Calendar } from "lucide-react"
import { cookies } from "next/headers"

export default async function HomePage() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("userId")?.value
  const isLoggedIn = !!userId

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Campus Study Hub</h1>
            <nav className="flex gap-2">
              {isLoggedIn ? (
                <>
                  <Link href="/discover">
                    <Button variant="ghost">Discover</Button>
                  </Link>
                  <Link href="/my-sessions">
                    <Button variant="ghost">My Sessions</Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="ghost">Profile</Button>
                  </Link>
                  <Link href="/create">
                    <Button>Create Session</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/signup">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-balance">Find Your Study Group</h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Connect with peers, create study sessions, and discover groups by subject and location. Make studying more
            effective and collaborative.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            {isLoggedIn ? (
              <>
                <Link href="/discover">
                  <Button size="lg">Browse Sessions</Button>
                </Link>
                <Link href="/create">
                  <Button size="lg" variant="outline">
                    Host a Session
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>By Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Find study groups for your specific courses and topics</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Nearby</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Discover sessions close to you with map and list views</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Join Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Request to join sessions and get approved by hosts</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Plan ahead with date and time filters for your availability</CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
