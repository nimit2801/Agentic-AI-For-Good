import { Suspense } from 'react'
import Hero from '@/sections/Hero'
import Problem from '@/sections/Problem'
import WhatWeDo from '@/sections/WhatWeDo'
import FeaturedTools from '@/sections/FeaturedTools'
import Architecture from '@/sections/Architecture'
import JoinMovement from '@/sections/JoinMovement'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Problem />
      <WhatWeDo />
      <Suspense fallback={null}>
        <FeaturedTools />
      </Suspense>
      <Architecture />
      <JoinMovement />
    </>
  )
}
