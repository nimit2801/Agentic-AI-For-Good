import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Philosophy', href: '/philosophy' },
  { label: 'Story', href: '/story' },
  { label: 'Stories', href: '/stories' },
  { label: 'Architecture', href: '/#architecture' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('/#')) {
      const id = href.replace('/#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen">
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || !isHome
            ? 'bg-[#F5F1EB]/90 backdrop-blur-md border-b border-[#1A1A1A]/5'
            : 'bg-transparent'
        }`}
      >
        <div className="w-full px-6 lg:px-[6vw]">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              to="/"
              className="text-[#1A1A1A] font-semibold text-sm lg:text-base tracking-tight"
            >
              Agentic AI For Good
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href.startsWith('/#') ? '/' : link.href}
                  onClick={(e) => {
                    if (link.href.startsWith('/#')) {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }
                  }}
                  className="text-[#1A1A1A]/70 hover:text-[#1A1A1A] text-sm font-medium transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/story">
                <Button className="bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-5 py-2 text-sm font-medium transition-all duration-200">
                  Submit a Use Case
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-[#1A1A1A]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#F5F1EB] transition-transform duration-500 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href.startsWith('/#') ? '/' : link.href}
              onClick={(e) => {
                if (link.href.startsWith('/#')) {
                  e.preventDefault();
                  scrollToSection(link.href);
                }
                setIsMobileMenuOpen(false);
              }}
              className="text-[#1A1A1A] text-2xl font-semibold"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/story" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="bg-[#D4754E] hover:bg-[#C0653E] text-white rounded-full px-8 py-3 text-lg font-medium mt-4">
              Submit a Use Case
            </Button>
          </Link>
        </div>
      </div>

      {/* Main content */}
      <main className="relative">{children}</main>
    </div>
  );
}
