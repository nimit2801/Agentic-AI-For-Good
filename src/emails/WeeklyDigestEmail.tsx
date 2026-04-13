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
  Row,
  Column,
} from '@react-email/components'

interface DigestTool {
  name: string
  slug: string
  tagline?: string | null
  description: string
  category: string
  pricing: string
  is_open_source: boolean
}

interface WeeklyDigestEmailProps {
  tools: DigestTool[]
  weekOf: string // e.g. "April 14, 2026"
  unsubscribeUrl: string
}

export default function WeeklyDigestEmail({
  tools,
  weekOf,
  unsubscribeUrl,
}: WeeklyDigestEmailProps) {
  const preview =
    tools.length === 0
      ? 'No new tools this week — check back soon.'
      : `${tools.length} new AI tool${tools.length > 1 ? 's' : ''} added this week: ${tools.map((t) => t.name).join(', ')}`

  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Row>
              <Column>
                <Text style={logoText}>AGENTIC AI FOR GOOD</Text>
              </Column>
              <Column align="right">
                <Text style={weekLabel}>Week of {weekOf}</Text>
              </Column>
            </Row>
          </Section>

          {/* Title */}
          <Section style={content}>
            <Heading style={h1}>
              {tools.length === 0
                ? 'Quiet week in the catalog'
                : `${tools.length} new tool${tools.length > 1 ? 's' : ''} this week`}
            </Heading>

            {tools.length === 0 ? (
              <Text style={paragraph}>
                No new tools were added this week. The catalog is still live at{' '}
                <Link href="https://agenticaiforgood.com/tools" style={link}>
                  agenticaiforgood.com/tools
                </Link>
                .
              </Text>
            ) : (
              <>
                <Text style={paragraph}>
                  Here&apos;s what landed in the catalog this week. Each one has been reviewed and
                  documented with real use cases.
                </Text>

                {/* Tool cards */}
                {tools.map((tool) => (
                  <Section key={tool.slug} style={toolCard}>
                    <Row style={{ marginBottom: '4px' }}>
                      <Column>
                        <Link
                          href={`https://agenticaiforgood.com/tools/${tool.slug}`}
                          style={toolName}
                        >
                          {tool.name}
                        </Link>
                      </Column>
                      <Column align="right">
                        <Text style={toolMeta}>
                          {tool.category} · {tool.pricing}
                          {tool.is_open_source ? ' · open source' : ''}
                        </Text>
                      </Column>
                    </Row>
                    <Text style={toolDescription}>
                      {tool.tagline ?? tool.description}
                    </Text>
                    <Link
                      href={`https://agenticaiforgood.com/tools/${tool.slug}`}
                      style={toolLink}
                    >
                      View details →
                    </Link>
                  </Section>
                ))}

                <Section style={ctaSection}>
                  <Link href="https://agenticaiforgood.com/tools" style={ctaButton}>
                    Browse full catalog
                  </Link>
                </Section>
              </>
            )}

            {/* MCP nudge */}
            <Section style={mcpBox}>
              <Text style={mcpText}>
                <strong>Tip:</strong> Install the MCP server to search the catalog from inside
                Claude:{' '}
                <Link href="https://agenticaiforgood.com/mcp" style={link}>
                  agenticaiforgood.com/mcp
                </Link>
              </Text>
            </Section>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              Agentic AI For Good · Weekly AI tool digest
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Unsubscribe
              </Link>
              {' · '}
              <Link href="https://agenticaiforgood.com" style={unsubscribeLink}>
                Visit site
              </Link>
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
  maxWidth: '580px',
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
  margin: '0',
}

const weekLabel = {
  color: '#6B6560',
  fontSize: '11px',
  letterSpacing: '0.06em',
  margin: '0',
}

const content = {
  padding: '40px 40px 24px',
}

const h1 = {
  color: '#1A1A1A',
  fontSize: '26px',
  fontWeight: '800',
  letterSpacing: '-0.02em',
  margin: '0 0 20px',
}

const paragraph = {
  color: '#6B6560',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 24px',
}

const toolCard = {
  backgroundColor: '#F5F1EB',
  borderRadius: '10px',
  marginBottom: '12px',
  padding: '16px 20px',
}

const toolName = {
  color: '#1A1A1A',
  fontSize: '15px',
  fontWeight: '700',
  textDecoration: 'none',
}

const toolMeta = {
  color: '#6B6560',
  fontSize: '11px',
  letterSpacing: '0.06em',
  margin: '0',
  textTransform: 'uppercase' as const,
}

const toolDescription = {
  color: '#6B6560',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '6px 0 8px',
}

const toolLink = {
  color: '#D4754E',
  fontSize: '13px',
  fontWeight: '600',
  textDecoration: 'none',
}

const ctaSection = {
  margin: '28px 0 8px',
}

const ctaButton = {
  backgroundColor: '#D4754E',
  borderRadius: '100px',
  color: '#FFFFFF',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 24px',
  textDecoration: 'none',
}

const mcpBox = {
  backgroundColor: '#F5F1EB',
  borderRadius: '8px',
  marginTop: '24px',
  padding: '14px 16px',
}

const mcpText = {
  color: '#6B6560',
  fontSize: '13px',
  lineHeight: '1.5',
  margin: '0',
}

const link = {
  color: '#D4754E',
  textDecoration: 'underline',
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
