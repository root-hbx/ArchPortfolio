'use client'

import { useDesktopStore } from '@/store/desktopStore'

export default function Wallpaper() {
  const wallpaper = useDesktopStore((s) => s.wallpaper)

  return (
    <div className="fixed inset-0 z-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={wallpaper}
        alt=""
        className="w-full h-full object-cover"
      />
    </div>
  )
}
