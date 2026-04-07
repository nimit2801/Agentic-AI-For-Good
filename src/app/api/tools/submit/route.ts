import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const submissionSchema = z.object({
  tool_name: z.string().min(1).max(100),
  tool_url: z.string().url(),
  description: z.string().max(1000).optional(),
  category: z.string().max(50).optional(),
  submitter_email: z.string().email().optional(),
  submitter_name: z.string().max(100).optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input
    const result = submissionSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: result.error.format() },
        { status: 400 }
      )
    }

    const data = result.data
    const supabase = createServerSupabaseClient()

    // Insert into tool_submissions table
    const { data: submission, error } = await supabase
      .from('tool_submissions')
      .insert({
        tool_name: data.tool_name,
        tool_url: data.tool_url,
        description: data.description || null,
        submitter_email: data.submitter_email || null,
        submitter_name: data.submitter_name || null,
        status: 'pending',
      })
      .select('id')
      .single()

    if (error) {
      console.error('Submission error:', error)
      return NextResponse.json(
        { error: 'Failed to submit tool. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      submission: { id: submission.id },
    })
  } catch (error) {
    console.error('Submit API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
