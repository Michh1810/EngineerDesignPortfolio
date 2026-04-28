import React from 'react'
import { render, screen } from '@testing-library/react'
import Loader from '@/components/Loader'

jest.mock('gsap', () => ({
  gsap: {
    timeline: jest.fn(() => ({
      to: jest.fn().mockReturnThis(),
      kill: jest.fn(),
    })),
    set: jest.fn(),
    to: jest.fn(),
  },
}))

beforeAll(() => {
  Object.defineProperty(SVGElement.prototype, 'getTotalLength', {
    value: () => 600,
    configurable: true,
  })
})

describe('Loader', () => {
  it('renders the loader overlay', () => {
    render(<Loader onDone={jest.fn()} />)
    expect(screen.getByTestId('loader')).toBeInTheDocument()
  })

  it('renders the SVG element', () => {
    const { container } = render(<Loader onDone={jest.fn()} />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders the M path', () => {
    const { container } = render(<Loader onDone={jest.fn()} />)
    expect(container.querySelector('path')).toBeInTheDocument()
  })

  it('renders the glow ellipse', () => {
    const { container } = render(<Loader onDone={jest.fn()} />)
    expect(container.querySelector('ellipse')).toBeInTheDocument()
  })

  it('accepts onDone prop without throwing', () => {
    const onDone = jest.fn()
    expect(() => render(<Loader onDone={onDone} />)).not.toThrow()
  })
})
