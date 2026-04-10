import { render } from '@testing-library/react'
import CustomCursor from '@/components/CustomCursor'

describe('CustomCursor', () => {
  it('renders dot and ring elements', () => {
    const { container } = render(<CustomCursor />)
    const children = container.querySelectorAll('div')
    expect(children).toHaveLength(2)
  })

  it('both elements have pointer-events-none class', () => {
    const { container } = render(<CustomCursor />)
    container.querySelectorAll('div').forEach(el => {
      expect(el.className).toContain('pointer-events-none')
    })
  })
})
