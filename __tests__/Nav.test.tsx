import { render, screen } from '@testing-library/react'
import Nav from '@/components/Nav'

describe('Nav', () => {
  it('renders the name Michael Truong', () => {
    render(<Nav />)
    expect(screen.getByText('Michael Truong')).toBeInTheDocument()
  })

  it('renders LinkedIn link', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })

  it('renders GitHub link', () => {
    render(<Nav />)
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
  })

  it('has h-12 class for 48px height', () => {
    const { container } = render(<Nav />)
    const nav = container.querySelector('nav')
    expect(nav?.className).toContain('h-12')
  })
})
