import { projects } from '@/data/projects'

describe('projects data', () => {
  it('has 8 projects', () => {
    expect(projects).toHaveLength(8)
  })

  it('contains no position 5 (center is reserved for hero)', () => {
    expect(projects.every(p => p.position !== 5)).toBe(true)
  })

  it('covers all positions 1-9 except 5', () => {
    const positions = projects.map(p => p.position).sort((a, b) => a - b)
    expect(positions).toEqual([1, 2, 3, 4, 6, 7, 8, 9])
  })

  it('each project has required fields', () => {
    projects.forEach(p => {
      expect(p.id).toBeTruthy()
      expect(p.slug).toBeTruthy()
      expect(p.number).toMatch(/^\d{2}$/)
      expect(p.category).toBeTruthy()
      expect(p.title).toBeTruthy()
      expect(p.discipline).toBeTruthy()
      expect(p.year).toMatch(/^\d{4}$/)
    })
  })
})
