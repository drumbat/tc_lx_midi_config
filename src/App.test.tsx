import { render, screen } from '@testing-library/react'
import App from './App'

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />)
    // Verify the component actually renders by checking for the main heading
    expect(screen.getByRole('heading', { name: /hello world/i })).toBeInTheDocument()
  })

  it('displays the welcome message', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /hello world/i })).toBeInTheDocument()
  })

  it('verifies test setup file is loaded (jest-dom matchers available)', () => {
    render(<App />)
    const heading = screen.getByRole('heading', { name: /hello world/i })
    // This assertion uses jest-dom matcher from setup.ts, verifying setup file loads correctly
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/hello world/i)
  })
})
