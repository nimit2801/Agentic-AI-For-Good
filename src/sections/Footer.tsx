import { useEffect, useRef } from 'react';
import { Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const footerLinks = [
  { label: 'Home', href: '/' },
  { label: 'Philosophy', href: '/philosophy' },
  { label: 'Our Story', href: '/story' },
  { label: 'Use Cases', href: '/stories' },
];

const socialLinks = [
  { icon: Linkedin, href: 'https://linkedin.com/company/agentic-ai-for-good', label: 'LinkedIn' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        footer,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: footer,
            start: 'top 90%',
            end: 'top 70%',
            scrub: true,
          },
        }
      );
    }, footer);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative w-full bg-[#E8E4DE] py-12 lg:py-16 z-50"
    >
      <div className="px-6 lg:px-[6vw]">
        <div className="flex flex-col items-center text-center">
          {/* Wordmark */}
          <h3 className="text-[#1A1A1A] font-semibold text-lg lg:text-xl mb-3">
            Agentic AI For Good
          </h3>

          {/* Mission */}
          <p className="text-[#6B6560] text-sm lg:text-base mb-6 lg:mb-8">
            Curating the real work behind agentic AI.
          </p>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 mb-6 lg:mb-8">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-[#1A1A1A]/70 hover:text-[#1A1A1A] text-sm transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#1A1A1A]/60 hover:text-[#D4754E] hover:shadow-md transition-all duration-200"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 lg:mt-12 pt-6 border-t border-[#1A1A1A]/8">
          <p className="text-center text-[#6B6560]/60 text-xs">
            © {new Date().getFullYear()} Agentic AI For Good. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
