import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock useToolSearch to avoid real API calls
vi.mock('@/hooks/use-tools', () => ({
  useToolSearch: vi.fn(() => ({ results: [], loading: false, error: null, method: 'none' })),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

import ToolSearchBar from '@/components/ToolSearchBar'
import { useToolSearch } from '@/hooks/use-tools'

const mockUseToolSearch = vi.mocked(useToolSearch)

describe('ToolSearchBar — uncontrolled (Hero mode)', () => {
  beforeEach(() => {
    mockUseToolSearch.mockReturnValue({ results: [], loading: false, error: null, method: 'none' })
  })

  it('renders the search input', () => {
    render(<ToolSearchBar />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows custom placeholder', () => {
    render(<ToolSearchBar placeholder="Try: build a RAG pipeline" />)
    expect(screen.getByPlaceholderText('Try: build a RAG pipeline')).toBeInTheDocument()
  })

  it('shows dropdown with results when focused and query > 1 char', async () => {
    const mockTool = { id: '1', name: 'LangChain', slug: 'langchain', category: 'Agents', pricing: 'free', description: '', long_description: null, url: '', logo_url: null, tags: [], is_open_source: true, featured: false, approved: true, created_at: '', updated_at: '' }
    mockUseToolSearch.mockReturnValue({ results: [mockTool], loading: false, error: null, method: 'semantic' })

    render(<ToolSearchBar />)
    const input = screen.getByRole('textbox')
    await userEvent.click(input)
    await userEvent.type(input, 'lang')

    await waitFor(() => {
      expect(screen.getByText('LangChain')).toBeInTheDocument()
    })
  })

  it('shows clear button when input has value', async () => {
    render(<ToolSearchBar />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test')
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('clears input when clear button is clicked', async () => {
    render(<ToolSearchBar />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'test')
    const clearBtn = screen.getByRole('button')
    await userEvent.click(clearBtn)
    expect(input).toHaveValue('')
  })
})

describe('ToolSearchBar — controlled (Tools page mode)', () => {
  beforeEach(() => {
    mockUseToolSearch.mockReturnValue({ results: [], loading: false, error: null, method: 'none' })
  })

  it('renders with controlled value', () => {
    render(<ToolSearchBar value="vector database" onChange={() => {}} noDropdown />)
    expect(screen.getByRole('textbox')).toHaveValue('vector database')
  })

  it('calls onChange when user types', async () => {
    const onChange = vi.fn()
    render(<ToolSearchBar value="" onChange={onChange} noDropdown />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'a')
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('does NOT show dropdown when noDropdown=true', async () => {
    const mockTool = { id: '1', name: 'LangChain', slug: 'langchain', category: 'Agents', pricing: 'free', description: '', long_description: null, url: '', logo_url: null, tags: [], is_open_source: true, featured: false, approved: true, created_at: '', updated_at: '' }
    mockUseToolSearch.mockReturnValue({ results: [mockTool], loading: false, error: null, method: 'semantic' })

    render(<ToolSearchBar value="lang" onChange={() => {}} noDropdown />)
    const input = screen.getByRole('textbox')
    await userEvent.click(input)

    // LangChain should NOT appear in a dropdown
    expect(screen.queryByText('LangChain')).not.toBeInTheDocument()
  })

  it('does NOT call useToolSearch when noDropdown=true', () => {
    render(<ToolSearchBar value="test query" onChange={() => {}} noDropdown />)
    // useToolSearch should be called with empty string (suppressed)
    expect(mockUseToolSearch).toHaveBeenCalledWith('', expect.anything())
  })

  it('calls onChange with empty string when clear button is clicked', async () => {
    const onChange = vi.fn()
    render(<ToolSearchBar value="something" onChange={onChange} noDropdown />)
    const clearBtn = screen.getByRole('button')
    await userEvent.click(clearBtn)
    expect(onChange).toHaveBeenCalledWith('')
  })
})
