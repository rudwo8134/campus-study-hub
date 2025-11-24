import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, MapPin, Users, Calendar } from "lucide-react";
import { cookies } from "next/headers";
import { LogoutButton } from "@/components/logout-button";

export default async function HomePage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const isLoggedIn = !!userId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 relative overflow-hidden">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-primary/10 blur-3xl animate-float" />
        <div
          className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-accent/15 blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>


      <header className="border-b border-border/40 backdrop-blur-sm sticky top-0 z-50 bg-background/80 animate-in fade-in slide-in-from-top duration-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-primary animate-in fade-in slide-in-from-left duration-700">
              Campus Study Hub
            </h1>
            <nav className="flex gap-2 animate-in fade-in slide-in-from-right duration-700">
              {isLoggedIn ? (
                <>
                  <Link href="/discover">
                    <Button
                      variant="ghost"
                      className="hover:bg-primary/10 transition-all"
                    >
                      Discover
                    </Button>
                  </Link>
                  <Link href="/my-sessions">
                    <Button
                      variant="ghost"
                      className="hover:bg-primary/10 transition-all"
                    >
                      My Sessions
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button
                      variant="ghost"
                      className="hover:bg-primary/10 transition-all"
                    >
                      Profile
                    </Button>
                  </Link>
                  <Link href="/create">
                    <Button className="bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl">
                      Create Session
                    </Button>
                  </Link>
                  <LogoutButton />
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="hover:bg-primary/10 transition-all"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-primary hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>


      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-in fade-in slide-in-from-bottom duration-700">
          <h2 className="text-4xl font-bold mb-4 text-balance bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Find Your Study Group
          </h2>
          <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
            Connect with peers, create study sessions, and discover groups by
            subject and location. Make studying more effective and
            collaborative.
          </p>
          <div className="flex gap-4 justify-center mt-8 animate-in fade-in duration-1000 delay-300">
            {isLoggedIn ? (
              <>
                <Link href="/discover">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    Browse Sessions
                  </Button>
                </Link>
                <Link href="/create">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/10 transition-all hover:-translate-y-1"
                  >
                    Host a Session
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/10 transition-all hover:-translate-y-1"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="animate-in fade-in slide-in-from-left duration-500 hover:shadow-lg transition-all hover:-translate-y-1 border-primary/20 hover:border-primary/40">
            <CardHeader>
              <BookOpen
                className="h-8 w-8 mb-2 text-primary animate-bounce"
                style={{ animationDuration: "2s" }}
              />
              <CardTitle>By Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find study groups for your specific courses and topics
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in slide-in-from-left duration-700 delay-100 hover:shadow-lg transition-all hover:-translate-y-1 border-primary/20 hover:border-primary/40">
            <CardHeader>
              <MapPin
                className="h-8 w-8 mb-2 text-primary animate-bounce"
                style={{ animationDuration: "2s", animationDelay: "0.2s" }}
              />
              <CardTitle>Nearby</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Discover sessions close to you with map and list views
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in slide-in-from-right duration-700 delay-100 hover:shadow-lg transition-all hover:-translate-y-1 border-primary/20 hover:border-primary/40">
            <CardHeader>
              <Users
                className="h-8 w-8 mb-2 text-primary animate-bounce"
                style={{ animationDuration: "2s", animationDelay: "0.4s" }}
              />
              <CardTitle>Join Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Request to join sessions and get approved by hosts
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in slide-in-from-right duration-500 hover:shadow-lg transition-all hover:-translate-y-1 border-primary/20 hover:border-primary/40">
            <CardHeader>
              <Calendar
                className="h-8 w-8 mb-2 text-primary animate-bounce"
                style={{ animationDuration: "2s", animationDelay: "0.6s" }}
              />
              <CardTitle>Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Plan ahead with date and time filters for your availability
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
