'use client'

import { cn } from '@/lib/utils'
import { useState, useCallback, useEffect, useRef } from 'react'

const Mascots = ({ className }: { className?: string }) => {
  const [isBlinking, setIsBlinking] = useState(false)
  const eyesRef = useRef<HTMLDivElement>(null)
  const eyeContainerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mousePositionRef.current = { x: event.clientX, y: event.clientY }
      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(updateEyePosition)
      }
    }

    const updateEyePosition = () => {
      if (!eyesRef.current || !eyeContainerRef.current) return

      const eyesRect = eyesRef.current.getBoundingClientRect()
      const eyesCenterX = eyesRect.left + eyesRect.width / 2
      const eyesCenterY = eyesRect.top + eyesRect.height / 2

      const angle = Math.atan2(
        mousePositionRef.current.y - eyesCenterY,
        mousePositionRef.current.x - eyesCenterX
      )
      const distance = Math.min(
        8,
        Math.hypot(
          mousePositionRef.current.x - eyesCenterX,
          mousePositionRef.current.y - eyesCenterY
        ) / 50
      )

      const x = Math.cos(angle) * distance
      const y = Math.sin(angle) * distance

      eyeContainerRef.current.style.transform = `translate(${x}px, ${y}px)`

      rafRef.current = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 100)
    }, 4000)

    return () => clearInterval(blinkInterval)
  }, [])

  return (
    <div
      className={cn(
        'size-14 bg-current flex items-center justify-center rounded-full',
        className
      )}
    >
      <div className="relative size-0" id="eyes" ref={eyesRef}>
        <div
          ref={eyeContainerRef}
          className={cn(
            isBlinking
              ? '*:scale-y-0 *:duration-75 ease-linear *:scale-x-110'
              : '',
            'relative w-5 flex justify-between items-center duration-75 -left-2.5 *:inline -top-1'
          )}
          style={
            {
              // left: 'calc(50- 1.5rem)',
              // top: 'calc(50% - 0.5rem)',
              // overflow: 'hidden'
            }
          }
        >
          <div
            className={cn(
              'size-2 transition-all ease-in bg-background rounded-full'
            )}
          ></div>
          <div
            className={cn(
              'size-2 transition-all ease-in bg-background rounded-full'
            )}
          ></div>
        </div>
      </div>
    </div>
  )
}

export default Mascots
