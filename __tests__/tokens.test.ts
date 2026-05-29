import config from '../tailwind.config'

describe('Tailwind design tokens', () => {
  it('should have correct base color', () => {
    expect((config.theme?.extend?.colors as Record<string, string>)?.base).toBe('#070707')
  })

  it('defines primary text color', () => {
    expect((config.theme?.extend?.colors as Record<string, string>)['text-primary']).toBe('#F0EDE8')
  })
})
