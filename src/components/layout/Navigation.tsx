"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserProfileDropdown, AuthModal } from "@/components/auth";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/api";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Challenges", href: "/challenges" },
  { name: "Events", href: "/events" },
];

const adminNavigation = [{ name: "Admin Panel", href: "/admin" }];

export function Navigation() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CB</span>
              </div>
              <span className="font-bold text-xl">FPT Battle</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  size="sm"
                >
                  {item.name}
                </Button>
              </Link>
            ))}

            {isAdmin && (
              <>
                <div className="w-px h-6 bg-border mx-2" />
                {adminNavigation.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={pathname === item.href ? "default" : "ghost"}
                      size="sm"
                      className="text-orange-600 hover:text-orange-700"
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="h-8 w-20 bg-muted animate-pulse rounded" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Welcome,
                  </span>
                  <span className="font-medium text-sm">{user.name}</span>
                  <Badge
                    variant={
                      user.role === UserRole.ADMIN ? "destructive" : "secondary"
                    }
                    className="text-xs"
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Badge>
                </div>
                <UserProfileDropdown />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <AuthModal
                  triggerText="Login"
                  triggerVariant="ghost"
                  defaultMode="login"
                />
                <AuthModal
                  triggerText="Register"
                  triggerVariant="default"
                  defaultMode="register"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t px-4 py-2">
        <div className="flex space-x-1 overflow-x-auto">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "default" : "ghost"}
                size="sm"
                className="whitespace-nowrap"
              >
                {item.name}
              </Button>
            </Link>
          ))}

          {isAdmin &&
            adminNavigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={pathname === item.href ? "default" : "ghost"}
                  size="sm"
                  className="whitespace-nowrap text-orange-600 hover:text-orange-700"
                >
                  {item.name}
                </Button>
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
}
