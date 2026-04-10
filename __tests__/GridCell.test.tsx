import { render, screen } from '@testing-library/react'
import GridCell from '@/components/GridCell'
import { projects } from '@/data/projects'

const project = projects[0] // position 1, Experimental Code

describe('GridCell', () => {
  it('renders the project category', () => {
    render(<GridCell project={project} />)
    expect(screen.getByText('Experimental Code')).toBeInTheDocument()
  })

  it('renders the project number', () => {
    render(<GridCell project={project} />)
    expect(screen.getByText('08')).toBeInTheDocument()
  })

  it('renders the year', () => {
    render(<GridCell project={project} />)
    expect(screen.getAllByText('2024').length).toBeGreaterThan(0)
  })

  it('renders a link to the project slug', () => {
    render(<GridCell project={project} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/work/experimental-code')
  })

  it('renders hover title and discipline', () => {
    render(<GridCell project={project} />)
    expect(screen.getByText('Generative visual system')).toBeInTheDocument()
    expect(screen.getByText('Experiment · 2024')).toBeInTheDocument()
  })
})
