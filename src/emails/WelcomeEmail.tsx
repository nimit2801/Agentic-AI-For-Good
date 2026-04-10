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

interface WelcomeEmailProps {
  unsubscribeUrl: string
}

export default function WelcomeEmail({ unsubscribeUrl }: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>You&apos;re now part of Agentic AI For Good — your weekly AI tool digest starts here.</Preview>
      <Body style={body}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>AGENTIC AI FOR GOOD</Text>
          </Section>

          {/* Main content */}
          <Section style={content}>
            <Heading style={h1}>You&apos;re in.</Heading>

            <Text style={paragraph}>
              Thanks for subscribing. Every week you&apos;ll get a digest of newly added AI tools — curated, documented, and ready to use.
            </Text>

            <Text style={paragraph}>
              We cover LLMs, vector databases, RAG frameworks, agent orchestration, monitoring, and fine-tuning. No hype, no marketing fluff — just tools that actually work.
            </Text>

            {/* CTA */}
            <Section style={ctaSection}>
              <Link href="https://agenticaiforgood.com/tools" style={ctaButton}>
                Browse the catalog →
              </Link>
            </Section>

            <Text style={paragraph}>
              We also publish an MCP server that gives Claude direct access to the catalog. Install it with:
            </Text>

            <Section style={codeBlock}>
              <Text style={code}>npx -y agentic-ai-for-good-mcp</Text>
            </Section>

            <Text style={paragraph}>
              Full install guide at{' '}
              <Link href="https://agenticaiforgood.com/mcp" style={link}>
                agenticaiforgood.com/mcp
              </Link>
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Agentic AI For Good · Curated AI tools for builders
            </Text>
            <Text style={footerText}>
              <Link href={unsubscribeUrl} style={unsubscribeLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  )
}

// Styles — matches brand: beige bg, terracotta accent, Inter-like sans
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
  padding: '24px 40px',
}

const logoText = {
  color: '#F5F1EB',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.12em',
  margin: '0',
}

const content = {
  padding: '40px 40px 32px',
}

const h1 = {
  color: '#1A1A1A',
  fontSize: '28px',
  fontWeight: '800',
  letterSpacing: '-0.02em',
  margin: '0 0 24px',
}

const paragraph = {
  color: '#6B6560',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const ctaSection = {
  margin: '28px 0',
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

const codeBlock = {
  backgroundColor: '#1A1A1A',
  borderRadius: '8px',
  margin: '8px 0 16px',
  padding: '12px 16px',
}

const code = {
  color: '#E8E2D9',
  fontFamily: '"IBM Plex Mono", "Courier New", monospace',
  fontSize: '13px',
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
  padding: '24px 40px',
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
