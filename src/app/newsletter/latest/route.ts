import { NextResponse } from 'next/server'
import { listIssues, SITE_URL } from '@/lib/newsletter'

export const revalidate = 600

export async function GET() {
  const [latest] = await listIssues()
  return NextResponse.redirect(`${SITE_URL}/newsletter${latest ? `/${latest.date}` : ''}`, 307)
}
