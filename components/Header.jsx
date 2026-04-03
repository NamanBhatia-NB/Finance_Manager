"use client";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { LayoutDashboard, Menu, Moon, PenBox, PlayCircle, Shield, Sun, UserCircle2, X, Eye } from 'lucide-react'
import Role from './Role'
import { useRole } from './RoleContext'
import { useTheme } from 'next-themes'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'

const Header = () => {
  const { isAdmin, isDemoMode, toggleDemo } = useRole();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className='fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border'>
      <nav className='container mx-auto px-4 py-3 flex items-center justify-between'>

        {/* Logo */}
        <Link href='/' onClick={closeMobile}>
          <div className='flex items-center gap-3'>
            <Image src="/logo.png" alt='Logo' width={200} height={200} className='h-12 w-auto object-contain rounded-full' />
            <span className='hidden md:block font-bold text-xl gradient-title'>Finance Manager</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className='hidden md:flex items-center gap-3'>
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                <LayoutDashboard size={16} className="mr-1" />Dashboard
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/transaction/create">
                <Button size="sm">
                  <PenBox size={16} className="mr-1" />Add Transaction
                </Button>
              </Link>
            )}
            <Role />
          </SignedIn>

          <SignedOut>
            {isDemoMode ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    <LayoutDashboard size={16} className="mr-1" />Dashboard
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/transaction/new">
                    <Button size="sm">
                      <PenBox size={16} className="mr-1" />Add Transaction
                    </Button>
                  </Link>
                )}
                <Role />
              </>
            ) : (
              <>
                <SignInButton forceRedirectUrl='/dashboard'>
                  <Button variant="outline" size="sm">Login</Button>
                </SignInButton>
                <SignUpButton forceRedirectUrl='/dashboard'>
                  <Button size="sm">Sign Up</Button>
                </SignUpButton>
              </>
            )}

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    onClick={toggleDemo}
                    className={`gap-1 transition-all ${isDemoMode
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "border border-blue-500 text-blue-600 dark:text-blue-400 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/30"
                    }`}
                  >
                    <PlayCircle size={14} />
                    {isDemoMode ? "Demo ON" : "Live Demo"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isDemoMode ? "Click to exit demo mode" : "Click to try demo mode"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </SignedOut>

          {/* Dark mode */}
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle dark mode">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
          </SignedIn>
          <SignedOut>
            {isDemoMode && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center">
                <UserCircle2 className="h-5 w-5 text-white" />
              </div>
            )}
          </SignedOut>
        </div>

        {/* Mobile right side: dark mode + hamburger */}
        <div className='flex md:hidden items-center gap-2'>
          <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle dark mode">
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <SignedIn>
            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
          </SignedIn>
          <SignedOut>
            {isDemoMode && (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-teal-400 flex items-center justify-center">
                <UserCircle2 className="h-5 w-5 text-white" />
              </div>
            )}
          </SignedOut>
          <Button variant="outline" size="icon" onClick={() => setMobileOpen((o) => !o)} aria-label="Toggle menu">
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </nav>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className='md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-3'>
          <SignedIn>
            <Link href="/dashboard" onClick={closeMobile}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <LayoutDashboard size={16} />Dashboard
              </Button>
            </Link>
            {isAdmin && (
              <Link href="/transaction/create" onClick={closeMobile}>
                <Button className="w-full justify-start gap-2">
                  <PenBox size={16} />Add Transaction
                </Button>
              </Link>
            )}
            <div className="flex items-center justify-between rounded-lg border px-3 py-2">
              <span className="text-sm font-medium">Role</span>
              <Role />
            </div>
          </SignedIn>

          <SignedOut>
            {isDemoMode ? (
              <>
                <Link href="/dashboard" onClick={closeMobile}>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <LayoutDashboard size={16} />Dashboard
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/transaction/new" onClick={closeMobile}>
                    <Button className="w-full justify-start gap-2">
                      <PenBox size={16} />Add Transaction
                    </Button>
                  </Link>
                )}
                <div className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <span className="text-sm font-medium">Role</span>
                  <Role />
                </div>
              </>
            ) : (
              <div className="flex gap-2">
                <SignInButton forceRedirectUrl='/dashboard'>
                  <Button variant="outline" className="flex-1" onClick={closeMobile}>Login</Button>
                </SignInButton>
                <SignUpButton forceRedirectUrl='/dashboard'>
                  <Button className="flex-1" onClick={closeMobile}>Sign Up</Button>
                </SignUpButton>
              </div>
            )}

            <Button
              onClick={() => { toggleDemo(); closeMobile(); }}
              className={`w-full justify-start gap-2 transition-all ${isDemoMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "border border-blue-500 text-blue-600 bg-transparent hover:bg-blue-50 dark:hover:bg-blue-950/30"
              }`}
            >
              <PlayCircle size={15} />
              {isDemoMode ? "Demo ON — Click to exit" : "Try Live Demo"}
            </Button>
          </SignedOut>
        </div>
      )}
    </div>
  );
};

export default Header;
