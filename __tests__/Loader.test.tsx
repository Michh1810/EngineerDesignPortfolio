import { render, screen } from '@testing-library/react'
import Loader from '@/components/Loader'

jest.mock('@/lib/gsap', () => ({
  gsap: {
    timeline: jest.fn(() => ({
      to: jest.fn().mockReturnThis(),
      kill: jest.fn(),
    })),
  },
  ScrollTrigger: {},
}))

describe('Loader', () => {
  it('renders project category cards', () => {
    render(<Loader />)
    expect(screen.getByText('Product Design')).toBeInTheDocument()
    expect(screen.getByText('Motion Work')).toBeInTheDocument()
    expect(screen.getByText('Brand Design')).toBeInTheDocument()
  })

  it('renders the center hero cell', () => {
    render(<Loader />)
    expect(screen.getByText(/intro/i)).toBeInTheDocument()
  })

  it('renders a 3x3 grid container', () => {
    const { container } = render(<Loader />)
    const grid = container.querySelector('[data-testid="grid"]')
    expect(grid).toBeInTheDocument()
  })
})
