import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Input, { Textarea } from '../../components/ui/Input'

describe('Input Component', () => {
  it('renders input with label', () => {
    render(<Input label="Test Input" placeholder="Enter text" />)
    
    expect(screen.getByText('Test Input')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test value' } })
    
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('shows required indicator when required is true', () => {
    render(<Input label="Required Field" required />)
    
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('*')).toHaveClass('text-rose-400')
  })

  it('displays error message when error prop is provided', () => {
    render(<Input label="Error Input" error="This field is required" />)
    
    expect(screen.getByText('This field is required')).toBeInTheDocument()
    expect(screen.getByText('This field is required')).toHaveClass('text-rose-400')
  })

  it('displays helper text when helper prop is provided', () => {
    render(<Input label="Helper Input" helper="Enter your email address" />)
    
    expect(screen.getByText('Enter your email address')).toBeInTheDocument()
    expect(screen.getByText('Enter your email address')).toHaveClass('text-slate-400')
  })

  it('shows password toggle when type is password and showPasswordToggle is true', () => {
    render(<Input type="password" showPasswordToggle />)
    
    const input = screen.getByLabelText(/password/i) || screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('toggles password visibility when toggle button is clicked', () => {
    render(<Input type="password" showPasswordToggle />)
    
    const toggleButton = screen.getByRole('button')
    const input = screen.getByLabelText(/password/i) || screen.getByRole('textbox')
    
    expect(input).toHaveAttribute('type', 'password')
    
    fireEvent.click(toggleButton)
    expect(input).toHaveAttribute('type', 'text')
  })

  it('applies disabled state correctly', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
  })

  it('applies custom className', () => {
    render(<Input className="custom-input" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-input')
  })

  it('handles focus states', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    
    fireEvent.focus(input)
    expect(input).toHaveClass('border-indigo-500', 'focus:ring-indigo-500')
    
    fireEvent.blur(input)
    expect(input).not.toHaveClass('border-indigo-500', 'focus:ring-indigo-500')
  })

  it('shows error icon when error is present', () => {
    render(<Input error="Error message" />)
    
    const errorIcon = document.querySelector('.text-rose-400')
    expect(errorIcon).toBeInTheDocument()
  })

  it('forwards ref correctly', () => {
    const ref = { current: null }
    render(<Input ref={ref} />)
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('applies correct default type', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'text')
  })

  it('generates proper IDs for accessibility', () => {
    render(<Input id="test-input" error="Error message" helper="Helper text" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'test-input')
    expect(input).toHaveAttribute('aria-describedby', 'test-input-error')
  })

  describe('Textarea Component', () => {
    it('renders textarea with correct attributes', () => {
      render(<Textarea rows={5} placeholder="Enter long text" />)
      
      const textarea = screen.getByPlaceholderText('Enter long text')
      expect(textarea).toHaveAttribute('rows', '5')
      expect(textarea).toHaveClass('resize-none', 'min-h-[100px]')
    })

    it('inherits all Input props', () => {
      render(
        <Textarea 
          label="Textarea Label" 
          error="Textarea error" 
          helper="Enter detailed description"
        />
      )
      
      expect(screen.getByText('Textarea Label')).toBeInTheDocument()
      expect(screen.getByText('Textarea error')).toBeInTheDocument()
      expect(screen.getByText('Enter detailed description')).toBeInTheDocument()
    })

    it('calls onChange when text is entered', () => {
      const handleChange = vi.fn()
      render(<Textarea onChange={handleChange} />)
      
      const textarea = screen.getByRole('textbox')
      fireEvent.change(textarea, { target: { value: 'long text content' } })
      
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  })

  it('handles different input types', () => {
    render(<Input type="email" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('shows helper text instead of error when both are provided', () => {
    render(<Input error="Error message" helper="Helper text" />)
    
    expect(screen.getByText('Error message')).toBeInTheDocument()
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
  })
})
