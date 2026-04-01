import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../components/ui/Card'

describe('Card Component', () => {
  it('renders card with children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies correct variant classes', () => {
    render(<Card variant="elevated">Elevated Card</Card>)
    const card = screen.getByText('Elevated Card').parentElement
    
    expect(card).toHaveClass('bg-slate-900', 'border', 'border-slate-800', 'shadow-soft')
  })

  it('applies correct padding classes', () => {
    render(<Card padding="lg">Large padding card</Card>)
    const card = screen.getByText('Large padding card').parentElement
    
    expect(card).toHaveClass('p-8')
  })

  it('applies custom className', () => {
    render(<Card className="custom-class">Custom Card</Card>)
    const card = screen.getByText('Custom Card').parentElement
    
    expect(card).toHaveClass('custom-class')
  })

  it('is clickable when onClick is provided', () => {
    const handleClick = vi.fn()
    render(<Card onClick={handleClick}>Clickable Card</Card>)
    
    const card = screen.getByText('Clickable Card').parentElement
    expect(card).toHaveClass('cursor-pointer', 'hover:border-slate-700')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Card ref={ref}>Ref Card</Card>)
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  describe('Card Subcomponents', () => {
    it('renders CardHeader with children', () => {
      render(<CardHeader>Header content</CardHeader>)
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('renders CardTitle with correct styling', () => {
      render(<CardTitle>Card Title</CardTitle>)
      const title = screen.getByText('Card Title')
      
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-slate-100')
    })

    it('renders CardDescription with correct styling', () => {
      render(<CardDescription>Card description</CardDescription>)
      const description = screen.getByText('Card description')
      
      expect(description).toHaveClass('text-sm', 'text-slate-400', 'mt-1')
    })

    it('renders CardContent with children', () => {
      render(<CardContent>Content area</CardContent>)
      expect(screen.getByText('Content area')).toBeInTheDocument()
    })

    it('renders CardFooter with correct styling', () => {
      render(<CardFooter>Footer content</CardFooter>)
      const footer = screen.getByText('Footer content').parentElement
      
      expect(footer).toHaveClass('mt-4', 'pt-4', 'border-t', 'border-slate-800')
    })

    it('applies custom className to subcomponents', () => {
      render(<CardTitle className="custom-title">Custom Title</CardTitle>)
      const title = screen.getByText('Custom Title')
      
      expect(title).toHaveClass('custom-title')
    })
  })

  it('renders complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
          <CardDescription>This is a test card</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByText('Test Card')).toBeInTheDocument()
    expect(screen.getByText('This is a test card')).toBeInTheDocument()
    expect(screen.getByText('Card content goes here')).toBeInTheDocument()
    expect(screen.getByText('Action')).toBeInTheDocument()
  })

  it('renders gradient variant correctly', () => {
    render(<Card variant="gradient">Gradient Card</Card>)
    const card = screen.getByText('Gradient Card').parentElement
    
    expect(card).toHaveClass('bg-gradient-to-br', 'from-indigo-600', 'to-indigo-700', 'text-white')
  })

  it('renders ghost variant correctly', () => {
    render(<Card variant="ghost">Ghost Card</Card>)
    const card = screen.getByText('Ghost Card').parentElement
    
    expect(card).toHaveClass('bg-slate-800/50', 'border-transparent', 'hover:bg-slate-800')
  })
})
