import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Button from '../../components/ui/Button'

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct variant classes', () => {
    render(<Button variant="danger">Danger Button</Button>)
    const button = screen.getByText('Danger Button')
    
    expect(button).toHaveClass('bg-rose-600', 'hover:bg-rose-700', 'text-white')
  })

  it('applies correct size classes', () => {
    render(<Button size="lg">Large Button</Button>)
    const button = screen.getByText('Large Button')
    
    expect(button).toHaveClass('px-6', 'py-3', 'text-base')
  })

  it('shows loading state', () => {
    render(<Button loading>Loading Button</Button>)
    const button = screen.getByText('Loading Button')
    
    expect(button).toBeDisabled()
    expect(button.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByText('Disabled Button')
    
    expect(button).toBeDisabled()
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Button ref={ref}>Ref Button</Button>)
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('has correct type attribute', () => {
    render(<Button type="submit">Submit Button</Button>)
    const button = screen.getByText('Submit Button')
    
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    const button = screen.getByText('Custom Button')
    
    expect(button).toHaveClass('custom-class')
  })

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>)
    
    fireEvent.click(screen.getByText('Disabled Button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders with default props', () => {
    render(<Button>Default Button</Button>)
    const button = screen.getByText('Default Button')
    
    expect(button).toHaveClass('bg-indigo-600', 'hover:bg-indigo-700', 'px-4', 'py-2', 'text-sm')
  })
})
