// Gallery carousel with auto-slide and click-to-expand lightbox — client component
'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface Props {
  images: string[]
}

const SLIDE_INTERVAL = 3500

export default function GalleryLightbox({ images }: Props) {
  const [current, setCurrent] = useState(0)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isOpen = activeIndex !== null

  const startAutoSlide = useCallback(() => {
    if (images.length <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % images.length)
    }, SLIDE_INTERVAL)
  }, [images.length])

  const stopAutoSlide = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    startAutoSlide()
    return stopAutoSlide
  }, [startAutoSlide, stopAutoSlide])

  const go = useCallback(
    (dir: 1 | -1) => {
      stopAutoSlide()
      setCurrent((c) => (c + dir + images.length) % images.length)
      startAutoSlide()
    },
    [images.length, startAutoSlide, stopAutoSlide],
  )

  const close = useCallback(() => setActiveIndex(null), [])
  const lightboxPrev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  )
  const lightboxNext = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  )

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowLeft') lightboxPrev()
      else if (e.key === 'ArrowRight') lightboxNext()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, close, lightboxPrev, lightboxNext])

  if (images.length === 0) return null

  return (
    <>
      {/* Carousel */}
      <div className="relative overflow-hidden rounded-2xl shadow-md group">
        <div className="relative aspect-[16/9] w-full">
          {images.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <Image
                src={src}
                alt={`Gallery image ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover"
                priority={i === 0}
              />
            </div>
          ))}

          {/* Expand button */}
          <button
            type="button"
            onClick={() => setActiveIndex(current)}
            className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 hover:bg-black/20 transition-colors duration-300 cursor-zoom-in"
            aria-label="Expand image"
          >
            <ZoomIn className="w-9 h-9 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </button>
        </div>

        {/* Prev / Next */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { stopAutoSlide(); setCurrent(i); startAutoSlide() }}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50 hover:bg-white/75'}`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
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
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); lightboxPrev() }}
              className="absolute left-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
          )}

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

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); lightboxNext() }}
              className="absolute right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          )}

          <p className="absolute bottom-6 left-0 right-0 text-center text-white/60 text-sm tabular-nums">
            {activeIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  )
}
