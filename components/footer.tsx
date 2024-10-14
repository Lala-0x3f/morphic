import React from 'react'
import Link from 'next/link'
import { SiDiscord, SiGithub, SiX } from 'react-icons/si'
import { Button } from './ui/button'

const Footer: React.FC = () => {
  return (
    <footer className="w-full p-1 md:p-2 fixed bottom-0 right-0">
      <div className="grid md:grid-cols-2">
        <div className="text-xs text-muted-foreground/20 h-full flex items-center">
          <p>本项目基于 Morphic 二次开发</p>
        </div>

        <div className=" justify-end w-full hidden md:flex">
          <Button
            variant={'ghost'}
            size={'icon'}
            className="text-muted-foreground/50"
          >
            <Link href="https://discord.gg/zRxaseCuGq" target="_blank">
              <SiDiscord size={18} />
            </Link>
          </Button>
          <Button
            variant={'ghost'}
            size={'icon'}
            className="text-muted-foreground/50"
          >
            <Link href="https://x.com/morphic_ai" target="_blank">
              <SiX size={18} />
            </Link>
          </Button>
          <Button
            variant={'ghost'}
            size={'icon'}
            className="text-muted-foreground/50"
          >
            <Link href="https://git.new/morphic" target="_blank">
              <SiGithub size={18} />
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
