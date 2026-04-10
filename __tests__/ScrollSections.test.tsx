import { render, screen } from '@testing-library/react'
import ScrollSections from '@/components/ScrollSections'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    context: jest.fn((fn) => { fn(); return { revert: jest.fn() } }),
    from: jest.fn(),
  },
  ScrollTrigger: {},
}))

describe('ScrollSections', () => {
  it('renders About section heading', () => {
    render(<ScrollSections />)
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders Skills section heading', () => {
    render(<ScrollSections />)
    expect(screen.getByText('Skills')).toBeInTheDocument()
  })

  it('renders Front-End Development skill', () => {
    render(<ScrollSections />)
    expect(screen.getByText('Front-End Development')).toBeInTheDocument()
  })

  it('renders Product Design skill', () => {
    render(<ScrollSections />)
    expect(screen.getByText('Product Design')).toBeInTheDocument()
  })

  it('renders Contact section', () => {
    render(<ScrollSections />)
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })
})
