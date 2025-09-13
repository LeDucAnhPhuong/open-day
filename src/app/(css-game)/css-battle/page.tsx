"use client";

import Link from "next/link";
import { Navigation } from "@/components/layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";

export default function CSSBattlePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            CSS Battle Arena
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Compete in real-time CSS challenges and prove your styling skills
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/challenges">
              <Button size="lg">View Challenges</Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" size="lg">
                Join Events
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎯 Real-time Battles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Compete against other developers in live CSS challenges with
                real-time scoring and rankings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💬 Live Chat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect with other participants during battles through
                integrated chat functionality.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Progressive Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Challenges adapt based on performance with Easy, Medium, and
                Hard difficulty levels.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⚡ Socket.IO Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Real-time updates and seamless multiplayer experience powered by
                WebSockets.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 Elimination System
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                HP-based elimination system keeps battles competitive and
                exciting.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎮 Event Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Create and join events with simple 6-character codes for easy
                access.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Built with Modern Technologies</CardTitle>
            <CardDescription>
              This CSS Battle platform demonstrates full-stack development with
              real-time features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Next.js 15</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">Tailwind CSS</Badge>
              <Badge variant="secondary">shadcn/ui</Badge>
              <Badge variant="secondary">Socket.IO</Badge>
              <Badge variant="secondary">NestJS</Badge>
              <Badge variant="secondary">MongoDB</Badge>
              <Badge variant="secondary">JWT Auth</Badge>
              <Badge variant="secondary">React Hook Form</Badge>
              <Badge variant="secondary">Zod</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        {!isAuthenticated && (
          <Card className="text-center">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-2">Ready to Battle?</h3>
              <p className="text-muted-foreground mb-4">
                Join the CSS Battle community and test your skills against other
                developers
              </p>
              <div className="flex justify-center gap-2">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {isAuthenticated && (
          <Card className="text-center">
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-2">
                Welcome back, {user?.name}!
              </h3>
              <p className="text-muted-foreground mb-4">
                Ready to jump into some CSS challenges?
              </p>
              <div className="flex justify-center gap-2">
                <Link href="/challenges">
                  <Button>Browse Challenges</Button>
                </Link>
                <Link href="/events">
                  <Button variant="outline">Join Event</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
