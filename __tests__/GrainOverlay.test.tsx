import { render } from '@testing-library/react'
import GrainOverlay from '@/components/GrainOverlay'

describe('GrainOverlay', () => {
  it('renders a fixed overlay element', () => {
    const { container } = render(<GrainOverlay />)
    const el = container.firstChild as HTMLElement
    expect(el).toBeInTheDocument()
    expect(el.tagName).toBe('DIV')
  })

  it('has pointer-events none', () => {
    const { container } = render(<GrainOverlay />)
    const el = container.firstChild as HTMLElement
    expect(el.style.pointerEvents).toBe('none')
  })
})
