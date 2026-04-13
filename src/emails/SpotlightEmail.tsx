import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface SpotlightTool {
  name: string
  slug: string
  tagline?: string | null
  description: string
  category: string
  pricing: string
  is_open_source: boolean
  github_url?: string | null
  website_url?: string | null
  url?: string | null
  install_command?: string | null
  use_cases?: string[] | null
  github_stars?: number | null
}

interface SpotlightEmailProps {
  tool: SpotlightTool
  unsubscribeUrl: string
}

function formatStars(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

export default function SpotlightEmail({ tool, unsubscribeUrl }: SpotlightEmailProps) {
  const websiteUrl = tool.url ?? tool.website_url
  const toolUrl = `https://agenticaiforgood.com/tools/${tool.slug}`

  return (
    <Html lang="en">
      <Head />
      <Preview>Tool spotlight: {tool.name} — {tool.tagline ?? tool.description.slice(0, 80)}</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>AGENTIC AI FOR GOOD</Text>
            <Text style={spotlightLabel}>TOOL SPOTLIGHT</Text>
          </Section>

          {/* Hero */}
          <Section style={hero}>
            <Text style={categoryLabel}>{tool.category.toUpperCase()}</Text>
            <Heading style={h1}>{tool.name}</Heading>
            <Text style={tagline}>{tool.tagline ?? tool.description}</Text>

            {/* Meta row */}
            <Text style={metaRow}>
              {tool.pricing}
              {tool.is_open_source ? '  ·  open source' : ''}
              {tool.github_stars != null ? `  ·  ★ ${formatStars(tool.github_stars)}` : ''}
            </Text>
          </Section>

          <Section style={content}>
            {/* Description */}
            {tool.tagline && (
              <Text style={paragraph}>{tool.description}</Text>
            )}

            {/* Install command */}
            {tool.install_command && (
              <>
                <Text style={sectionLabel}>INSTALL</Text>
                <Section style={codeBlock}>
                  <Text style={code}>{tool.install_command}</Text>
                </Section>
              </>
            )}

            {/* Use cases */}
            {tool.use_cases && tool.use_cases.length > 0 && (
              <>
                <Text style={sectionLabel}>WHAT YOU CAN BUILD</Text>
                {tool.use_cases.slice(0, 4).map((uc, i) => (
                  <Text key={i} style={useCase}>→ {uc}</Text>
                ))}
              </>
            )}

            {/* CTAs */}
            <Section style={ctaRow}>
              <Link href={toolUrl} style={ctaButton}>
                Full details
              </Link>
              {websiteUrl && (
                <Link href={websiteUrl} style={ctaSecondary}>
                  Visit website →
                </Link>
              )}
              {tool.github_url && (
                <Link href={tool.github_url} style={ctaSecondary}>
                  GitHub →
                </Link>
              )}
            </Section>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              Agentic AI For Good · Tool Spotlight — every Friday
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={unsubscribeLink}>Unsubscribe</Link>
              {' · '}
              <Link href="https://agenticaiforgood.com/tools" style={unsubscribeLink}>Browse catalog</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

const body = {
  backgroundColor: '#F5F1EB',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  margin: '0',
  padding: '40px 0',
}

const container = {
  backgroundColor: '#FFFFFF',
  borderRadius: '16px',
  margin: '0 auto',
  maxWidth: '560px',
  overflow: 'hidden',
}

const header = {
  backgroundColor: '#1A1A1A',
  padding: '20px 40px',
}

const logoText = {
  color: '#F5F1EB',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.12em',
  margin: '0 0 4px',
}

const spotlightLabel = {
  color: '#D4754E',
  fontSize: '10px',
  fontWeight: '600',
  letterSpacing: '0.14em',
  margin: '0',
}

const hero = {
  backgroundColor: '#F5F1EB',
  padding: '36px 40px 28px',
}

const categoryLabel = {
  color: '#D4754E',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.12em',
  margin: '0 0 8px',
}

const h1 = {
  color: '#1A1A1A',
  fontSize: '32px',
  fontWeight: '800',
  letterSpacing: '-0.02em',
  margin: '0 0 12px',
}

const tagline = {
  color: '#1A1A1A',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 16px',
}

const metaRow = {
  color: '#6B6560',
  fontSize: '12px',
  letterSpacing: '0.04em',
  margin: '0',
}

const content = {
  padding: '32px 40px 24px',
}

const paragraph = {
  color: '#6B6560',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const sectionLabel = {
  color: '#1A1A1A',
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.12em',
  margin: '0 0 8px',
}

const codeBlock = {
  backgroundColor: '#1A1A1A',
  borderRadius: '8px',
  margin: '0 0 24px',
  padding: '12px 16px',
}

const code = {
  color: '#E8E2D9',
  fontFamily: '"IBM Plex Mono", "Courier New", monospace',
  fontSize: '13px',
  margin: '0',
}

const useCase = {
  color: '#6B6560',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 8px',
}

const ctaRow = {
  margin: '28px 0 0',
}

const ctaButton = {
  backgroundColor: '#D4754E',
  borderRadius: '100px',
  color: '#FFFFFF',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  marginRight: '12px',
  padding: '12px 24px',
  textDecoration: 'none',
}

const ctaSecondary = {
  color: '#D4754E',
  fontSize: '14px',
  fontWeight: '600',
  marginRight: '12px',
  textDecoration: 'none',
}

const divider = {
  borderColor: '#E8E2D9',
  margin: '0',
}

const footer = {
  padding: '20px 40px',
}

const footerText = {
  color: '#6B6560',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 4px',
}

const unsubscribeLink = {
  color: '#6B6560',
  textDecoration: 'underline',
}
