import config from '../tailwind.config'

describe('Tailwind design tokens', () => {
  it('defines base background color', () => {
    expect((config.theme?.extend?.colors as Record<string, string>)?.base).toBe('#080808')
  })

  it('defines primary text color', () => {
    expect((config.theme?.extend?.colors as Record<string, string>)['text-primary']).toBe('#F0EDE8')
  })
})
