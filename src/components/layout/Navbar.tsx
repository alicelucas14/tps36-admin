import Link from 'next/link';

export default function Navbar({ settings }: { settings: Record<string, string> }) {
  return (
    <nav className="fixed w-full top-0 z-50 bg-accent/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/Stars777-Logo.png" alt="Stars777" className="h-12 w-auto" />
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-secondary transition-colors">Home</Link>
            <Link href="/blogs" className="hover:text-secondary transition-colors">Blogs</Link>
            <Link href="/promotions" className="hover:text-secondary transition-colors">Promotions</Link>
            <Link href="/#about-us" className="hover:text-secondary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-secondary transition-colors">Contact</Link>
            <Link href="#" className="bg-secondary text-primary px-6 py-2.5 rounded-full font-bold hover:bg-yellow-400 transition transform hover:-translate-y-0.5 shadow-[0_0_15px_rgba(251,191,36,0.2)]">Download App</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
