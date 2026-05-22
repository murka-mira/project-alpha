'use client'

import dynamic from 'next/dynamic'

const Game = dynamic(() => import('./Game'), { ssr: false })

export default function JanitorPage() {
  return (
    <div className="fixed inset-0 z-50">
      <Game />
    </div>
  )
}
