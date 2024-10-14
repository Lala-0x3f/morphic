import React from 'react'
import { ModeToggle } from './mode-toggle'
import { IconLogo } from './ui/icons'
import { cn } from '@/lib/utils'
import HistoryContainer from './history-container'
import {
  SignedOut,
  SignInButton,
  SignedIn,
  UserButton,
  OrganizationSwitcher
} from '@clerk/nextjs'
import { Button } from './ui/button'

export const Header: React.FC = async () => {
  return (
    <header className="fixed w-full p-1 md:p-2 flex justify-between items-center z-10 backdrop-blur md:backdrop-blur-none bg-background/80 md:bg-transparent">
      <div>
        <a href="/">
          <IconLogo className={cn('w-5 h-5')} />
          <span className="sr-only">Morphic</span>
        </a>
      </div>
      <div className="flex gap-0.5">
        <SignedOut>
          <Button asChild variant="ghost" className="rounded-3xl">
            <SignInButton />
          </Button>
        </SignedOut>
        <SignedIn>
          <Button variant="ghost" size="default" className="rounded-3xl">
            {/* <UserButton /> */}
            <OrganizationSwitcher />
          </Button>
        </SignedIn>
        <ModeToggle />
        <HistoryContainer location="header" />
      </div>
    </header>
  )
}

export default Header
