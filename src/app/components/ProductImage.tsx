'use client'

import { useState } from 'react'

export function ProductImage({
  src,
  alt,
  className,
  fallbackEmoji = '🍬'
}: {
  src?: string | null
  alt: string
  className?: string
  fallbackEmoji?: string
}) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={className}>
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-rose-100 via-amber-100 to-white">
          <span className="text-2xl">{fallbackEmoji}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full rounded-2xl object-cover"
      />
    </div>
  )
}

