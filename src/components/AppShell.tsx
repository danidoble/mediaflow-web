import React, { useState } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';
import {
  LayoutDashboard,
  ImageIcon,
  FileVideo,
  Gauge,
  Heart,
  Menu,
  ChevronRight,
  Wand2,
  Crop,
  RotateCcw,
  Scissors,
  Camera,
  List,
  LogOut,
  User,
  Layers,
  Images,
} from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    title: 'General',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Image',
    items: [
      { label: 'Convert to WebP', href: '/image/webp', icon: <Wand2 className="h-4 w-4" /> },
      { label: 'Convert to AVIF', href: '/image/avif', icon: <ImageIcon className="h-4 w-4" /> },
      { label: 'Convert to Format', href: '/image/format', icon: <Layers className="h-4 w-4" /> },
      { label: 'Resize Image', href: '/image/resize', icon: <Crop className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Batch Images',
    items: [
      { label: 'Batch WebP', href: '/image/batch/webp', icon: <Images className="h-4 w-4" /> },
      { label: 'Batch AVIF', href: '/image/batch/avif', icon: <Images className="h-4 w-4" /> },
      { label: 'Batch Format', href: '/image/batch/format', icon: <Images className="h-4 w-4" /> },
    ],
  },
  {
    title: 'Video',
    items: [
      { label: 'Convert Video', href: '/video/convert', icon: <FileVideo className="h-4 w-4" /> },
      { label: 'Rotate Video', href: '/video/rotate', icon: <RotateCcw className="h-4 w-4" /> },
      { label: 'Resize Video', href: '/video/resize', icon: <Gauge className="h-4 w-4" /> },
      { label: 'Trim Video', href: '/video/trim', icon: <Scissors className="h-4 w-4" /> },
      { label: 'Extract Thumbnail', href: '/video/thumbnail', icon: <Camera className="h-4 w-4" /> },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Jobs', href: '/jobs', icon: <List className="h-4 w-4" /> },
      { label: 'Health', href: '/health', icon: <Heart className="h-4 w-4" /> },
    ],
  },
];

function SidebarContent({ currentPath }: { currentPath: string }) {
  return (
    <nav className="flex flex-col gap-1 px-2 py-4">
      {NAV.map((group) => (
        <div key={group.title} className="mb-3">
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
            {group.title}
          </p>
          {group.items.map((item) => {
            const active = currentPath === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground',
                )}
              >
                {item.icon}
                {item.label}
                {active && (
                  <ChevronRight className="ml-auto h-3 w-3 text-sidebar-primary" />
                )}
              </a>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function Topbar() {
  const { user, logout } = useAuth();
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'MF';

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm">
      {/* Mobile: hamburger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0 bg-sidebar">
          <div className="flex h-14 items-center border-b px-5">
            <Logo />
          </div>
          <SidebarContent currentPath={window.location.pathname} />
        </SheetContent>
      </Sheet>

      <div className="hidden md:block" />

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Separator orientation="vertical" className="h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm">{user?.email}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem disabled className="gap-2">
              <User className="h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="gap-2 text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <a href="/dashboard" className="flex items-center gap-2 font-semibold text-foreground">
      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">
        MF
      </span>
      <span>MediaFlow</span>
    </a>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

function ShellInner({ children, title }: AppShellProps) {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r bg-sidebar">
        <div className="flex h-14 items-center border-b px-5">
          <Logo />
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarContent currentPath={currentPath} />
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6">
          {title && (
            <h1 className="mb-6 text-2xl font-bold tracking-tight">{title}</h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <AuthProvider>
      <ShellInner {...props} />
    </AuthProvider>
  );
}
