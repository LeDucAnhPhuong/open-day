"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/api";

export function UserProfileDropdown() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getRoleBadgeVariant = (role: UserRole) => {
    return role === UserRole.ADMIN ? "destructive" : "secondary";
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-white/80 backdrop-blur-md"
        align="end"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.studentId}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuItem className="flex justify-between items-center">
          <span>Role</span>
          <Badge variant={getRoleBadgeVariant(user.role)}>
            {user?.role?.charAt(0)?.toUpperCase() + user.role.slice(1)}
          </Badge>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
