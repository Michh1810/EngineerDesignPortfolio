'use client'

import { useState } from 'react'
import WorkList from '@/components/WorkList'
import Loader from '@/components/Loader'

export default function HomePage() {
  const [loaderDone, setLoaderDone] = useState(false)

  return (
    <main>
      {!loaderDone && <Loader onDone={() => setLoaderDone(true)} />}
      <WorkList loaderDone={loaderDone} />
    </main>
  )
}
