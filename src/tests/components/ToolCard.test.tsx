import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: any) => <a href={href} {...props}>{children}</a>,
}))

import ToolCard from '@/components/ToolCard'
import type { Tool } from '@/lib/supabase'

const mockTool = (overrides: Partial<Tool> = {}): Tool => ({
  id: 'tool-1',
  name: 'LangChain',
  slug: 'langchain',
  description: 'Framework for building LLM apps',
  tagline: 'The standard library for LLM development',
  long_description: null,
  url: 'https://langchain.com',
  logo_url: null,
  category: 'Agents',
  tags: ['python', 'llm', 'agents'],
  pricing: 'free',
  is_open_source: true,
  featured: false,
  approved: true,
  github_stars: undefined,
  created_at: '2026-04-01T00:00:00Z',
  updated_at: '2026-04-01T00:00:00Z',
  ...overrides,
})

describe('ToolCard', () => {
  it('renders tool name and category', () => {
    render(<ToolCard tool={mockTool()} />)
    expect(screen.getByText('LangChain')).toBeInTheDocument()
    expect(screen.getByText('Agents')).toBeInTheDocument()
  })

  it('shows tagline when present', () => {
    render(<ToolCard tool={mockTool()} />)
    expect(screen.getByText('The standard library for LLM development')).toBeInTheDocument()
  })

  it('falls back to description when no tagline', () => {
    render(<ToolCard tool={mockTool({ tagline: undefined })} />)
    expect(screen.getByText('Framework for building LLM apps')).toBeInTheDocument()
  })

  it('shows pricing badge', () => {
    render(<ToolCard tool={mockTool({ pricing: 'freemium' })} />)
    expect(screen.getByText('freemium')).toBeInTheDocument()
  })

  it('shows open source badge', () => {
    render(<ToolCard tool={mockTool({ is_open_source: true })} />)
    expect(screen.getByText('Open Source')).toBeInTheDocument()
  })

  it('does not show open source badge when is_open_source is false', () => {
    render(<ToolCard tool={mockTool({ is_open_source: false })} />)
    expect(screen.queryByText('Open Source')).not.toBeInTheDocument()
  })

  it('shows first letter avatar when no logo_url', () => {
    render(<ToolCard tool={mockTool({ logo_url: null })} />)
    expect(screen.getByText('L')).toBeInTheDocument()
  })

  it('shows GitHub stars formatted when >= 1000', () => {
    render(<ToolCard tool={mockTool({ github_stars: 12500 })} />)
    expect(screen.getByText('12.5k')).toBeInTheDocument()
  })

  it('shows GitHub stars as-is when < 1000', () => {
    render(<ToolCard tool={mockTool({ github_stars: 842 })} />)
    expect(screen.getByText('842')).toBeInTheDocument()
  })

  it('does not show stars when github_stars is undefined', () => {
    render(<ToolCard tool={mockTool({ github_stars: undefined })} />)
    // Star icon text area should not contain a number
    expect(screen.queryByText(/k$/)).not.toBeInTheDocument()
  })

  it('shows up to 3 tags', () => {
    render(<ToolCard tool={mockTool({ tags: ['python', 'llm', 'agents', 'rag', 'extra'] })} />)
    expect(screen.getByText('python')).toBeInTheDocument()
    expect(screen.getByText('llm')).toBeInTheDocument()
    expect(screen.getByText('agents')).toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
    expect(screen.queryByText('rag')).not.toBeInTheDocument()
  })

  it('links to correct /tools/[slug] path', () => {
    render(<ToolCard tool={mockTool({ slug: 'langchain' })} />)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/tools/langchain')
  })
})
