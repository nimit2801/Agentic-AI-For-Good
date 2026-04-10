import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockFetch = vi.fn()
vi.stubGlobal('fetch', mockFetch)

import SubscribeWidget from '@/components/SubscribeWidget'

describe('SubscribeWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders email input and subscribe button', () => {
    render(<SubscribeWidget />)
    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows success state after successful subscribe', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Subscribed successfully' }),
    })

    render(<SubscribeWidget />)
    await userEvent.type(screen.getByPlaceholderText('your@email.com'), 'nimit@example.com')
    await userEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText(/you're in/i)).toBeInTheDocument()
    })
  })

  it('shows already-subscribed message on duplicate', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Already subscribed' }),
    })

    render(<SubscribeWidget />)
    await userEvent.type(screen.getByPlaceholderText('your@email.com'), 'existing@example.com')
    await userEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText(/already subscribed/i)).toBeInTheDocument()
    })
  })

  it('shows error message on API failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Internal server error' }),
    })

    render(<SubscribeWidget />)
    await userEvent.type(screen.getByPlaceholderText('your@email.com'), 'test@example.com')
    await userEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText(/internal server error/i)).toBeInTheDocument()
    })
  })

  it('sends correct source in request body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Subscribed successfully' }),
    })

    render(<SubscribeWidget source="mcp_page" />)
    await userEvent.type(screen.getByPlaceholderText('your@email.com'), 'dev@example.com')
    await userEvent.click(screen.getByRole('button'))

    await waitFor(() => {
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.source).toBe('mcp_page')
      expect(body.email).toBe('dev@example.com')
    })
  })

  it('does not submit with empty email', async () => {
    render(<SubscribeWidget />)
    await userEvent.click(screen.getByRole('button'))
    expect(mockFetch).not.toHaveBeenCalled()
  })
})
