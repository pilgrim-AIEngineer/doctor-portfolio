// Gallery grid with click-to-expand lightbox — client component
'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface Props {
  images: string[]
}

export default function GalleryLightbox({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const isOpen = activeIndex !== null

  const close = useCallback(() => setActiveIndex(null), [])
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  )
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  )

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close, prev, next])

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="relative aspect-square rounded-xl overflow-hidden shadow-sm group focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            aria-label={`View gallery image ${i + 1}`}
          >
            <Image
              src={src}
              alt={`Gallery image ${i + 1}`}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 flex items-center justify-center">
              <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {isOpen && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image ${activeIndex + 1} of ${images.length}`}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Full image */}
          <div
            className="relative w-[90vw] h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`Gallery image ${activeIndex + 1}`}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Counter */}
          <p className="absolute bottom-6 left-0 right-0 text-center text-white/60 text-sm tabular-nums">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  )
}
