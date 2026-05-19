// Resizable two-panel layout with drag handle — used in the profile split-screen editor
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface ResizablePanelsProps {
  left: React.ReactNode
  right: React.ReactNode
  defaultRightPercent?: number
  storageKey?: string
  minRightPercent?: number
  maxRightPercent?: number
}

export default function ResizablePanels({
  left,
  right,
  defaultRightPercent = 42,
  storageKey = 'docfolio:preview-width',
  minRightPercent = 25,
  maxRightPercent = 65,
}: ResizablePanelsProps) {
  const [rightPercent, setRightPercent] = useState(defaultRightPercent)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(storageKey)
    if (stored) {
      const parsed = parseFloat(stored)
      if (!isNaN(parsed)) {
        setRightPercent(Math.min(maxRightPercent, Math.max(minRightPercent, parsed)))
      }
    }
  }, [storageKey, minRightPercent, maxRightPercent])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const newRight = ((rect.right - e.clientX) / rect.width) * 100
      setRightPercent(Math.min(maxRightPercent, Math.max(minRightPercent, newRight)))
    },
    [minRightPercent, maxRightPercent]
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setRightPercent((prev) => {
      localStorage.setItem(storageKey, String(prev))
      return prev
    })
  }, [storageKey])

  useEffect(() => {
    if (!isDragging) return
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={containerRef}
      className={`flex flex-row w-full h-full overflow-hidden${isDragging ? ' select-none cursor-col-resize' : ''}`}
    >
      <div className="flex-shrink-0 overflow-y-auto" style={{ width: `${100 - rightPercent}%` }}>
        {left}
      </div>

      <div
        className="w-1.5 flex-shrink-0 bg-gray-200 hover:bg-brand-400 active:bg-brand-500 cursor-col-resize transition-colors"
        onMouseDown={() => setIsDragging(true)}
      />

      <div className="flex-shrink-0 overflow-hidden" style={{ width: `${rightPercent}%` }}>
        {right}
      </div>
    </div>
  )
}
