'use client'

import { useState } from 'react'

function normalizeImageUrl(src?: string | null) {
  if (!src) return null
  const trimmed = src.trim()
  if (!trimmed) return null

  // Imgur album links (imgur.com/a/...) are not direct images and usually can't be embedded.
  // We'll leave them as-is so they fail gracefully to the fallback.
  try {
    const url = new URL(trimmed)
    const host = url.hostname.replace(/^www\./, '')

    // Convert Imgur "image page" links like https://imgur.com/abc123 to a direct image URL.
    // This won't work for albums, and the extension might not be jpg — but jpg is the most common.
    if (host === 'imgur.com') {
      const parts = url.pathname.split('/').filter(Boolean)
      if (parts.length === 1) {
        const id = parts[0]
        return `https://i.imgur.com/${id}.jpg`
      }
    }
  } catch {
    // Ignore URL parsing errors; treat it as a normal string.
  }

  return trimmed
}

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
  const normalizedSrc = normalizeImageUrl(src)

  if (!normalizedSrc || failed) {
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
        src={normalizedSrc}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full rounded-2xl object-cover"
      />
    </div>
  )
}

