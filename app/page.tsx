import Nav from '@/components/Nav'
import Loader from '@/components/Loader'
import ScrollSections from '@/components/ScrollSections'

export default function HomePage() {
  return (
    <main>
      <Nav />
      <Loader />
      <ScrollSections />
    </main>
  )
}
