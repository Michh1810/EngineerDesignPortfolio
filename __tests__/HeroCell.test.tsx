import { render, screen } from '@testing-library/react'
import HeroCell from '@/components/HeroCell'

const noop = () => {}

describe('HeroCell', () => {
  it('renders the video element', () => {
    const { container } = render(<HeroCell onVideoEnd={noop} phase="video" />)
    expect(container.querySelector('video')).toBeInTheDocument()
  })

  it('video is muted and autoplay', () => {
    const { container } = render(<HeroCell onVideoEnd={noop} phase="video" />)
    const video = container.querySelector('video')!
    expect(video.hasAttribute('autoplay') || video.muted).toBeTruthy()
  })

  it('renders the hero name', () => {
    const { container } = render(<HeroCell onVideoEnd={noop} phase="hero" />)
    const h1 = container.querySelector('h1')
    expect(h1?.textContent).toContain('Michael')
    expect(h1?.textContent).toContain('Truong')
  })

  it('renders the role', () => {
    render(<HeroCell onVideoEnd={noop} phase="hero" />)
    expect(screen.getByText(/Design Engineer/i)).toBeInTheDocument()
  })

  it('video box is 66% in video phase', () => {
    const { container } = render(<HeroCell onVideoEnd={noop} phase="video" />)
    const videoBox = container.querySelector('[data-testid="video-box"]') as HTMLElement
    expect(videoBox.style.width).toBe('66%')
    expect(videoBox.style.height).toBe('66%')
  })

  it('video box is 100% in hero phase', () => {
    const { container } = render(<HeroCell onVideoEnd={noop} phase="hero" />)
    const videoBox = container.querySelector('[data-testid="video-box"]') as HTMLElement
    expect(videoBox.style.width).toBe('100%')
    expect(videoBox.style.height).toBe('100%')
  })
})
