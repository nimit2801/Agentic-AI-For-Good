'use client'
import { useState, useEffect } from 'react'
import { Menu, X, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { GitHubStarsBadge } from '@/components/GitHubStars'

const navLinks = [
  { label: 'Tools', href: '/tools' },
  { label: 'MCP', href: '/mcp' },
  { label: 'Blog', href: '/stories' },
  { label: 'Research', href: '/agent-research' },
  { label: 'Community', href: '/community' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [announcementHeight, setAnnouncementHeight] = useState(40)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const el = document.querySelector('.announcement-bar')
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setAnnouncementHeight(entry.contentRect.height)
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '')
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || !isHome
            ? 'bg-[#F5F1EB]/90 backdrop-blur-md border-b border-[#1A1A1A]/5'
            : 'bg-transparent'
        }`}
        style={{ top: `${announcementHeight}px` }}
      >
        <div className="w-full px-6 lg:px-[6vw]">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/images/logos/Leaf%20Logo%20no%20bg.png"
                alt="Agentic AI For Good"
                width={36}
                height={36}
                className="w-8 h-8 lg:w-9 lg:h-9"
                priority
              />
              <span className="text-[#1A1A1A] font-semibold text-sm lg:text-base tracking-tight hidden sm:inline">
                Agentic AI For Good
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-3 xl:gap-5 overflow-x-auto scrollbar-none ml-auto">
              {navLinks.map((link) =>
                link.href.startsWith('/#') ? (
                  <button
                    key={link.label}
                    onClick={() => scrollToSection(link.href)}
                    className="text-[#1A1A1A]/70 hover:text-[#1A1A1A] text-sm font-medium transition-colors duration-200 whitespace-nowrap shrink-0"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-[#1A1A1A]/70 hover:text-[#1A1A1A] text-sm font-medium transition-colors duration-200 whitespace-nowrap shrink-0"
                  >
                    {link.label}
                  </Link>
                )
              )}
              <a
                href="https://github.com/nimit2801/Agentic-AI-For-Good"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[#1A1A1A]/70 hover:text-[#1A1A1A] text-sm font-medium transition-colors duration-200 whitespace-nowrap shrink-0"
              >
                <Star size={14} className="fill-[#D4754E] text-[#D4754E]" />
                <span>Star</span>
                <span className="text-[#1A1A1A]/40 text-xs tabular-nums">
                  <GitHubStarsBadge />
                </span>
              </a>
              <a
                href="https://github.com/nimit2801/Agentic-AI-For-Good-Website/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 whitespace-nowrap shrink-0">
                  + Tool
                </Button>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-[#1A1A1A] ml-auto"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 bg-[#F5F1EB] transition-transform duration-500 lg:hidden overflow-y-auto ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: `${announcementHeight}px` }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 pb-12">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href.startsWith('/#') ? '/' : link.href}
              onClick={(e) => {
                if (link.href.startsWith('/#')) {
                  e.preventDefault()
                  scrollToSection(link.href)
                }
                setIsMobileMenuOpen(false)
              }}
              className="text-[#1A1A1A] text-2xl font-semibold"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/nimit2801/Agentic-AI-For-Good"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 text-[#1A1A1A] text-xl font-semibold"
          >
            <Star size={20} className="fill-[#D4754E] text-[#D4754E]" />
            Star on GitHub
          </a>
          <a
            href="https://github.com/nimit2801/Agentic-AI-For-Good-Website/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Button className="bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-8 py-3 text-lg font-medium mt-4">
              Contribute a Tool
            </Button>
          </a>
        </div>
      </div>
    </>
  )
}
