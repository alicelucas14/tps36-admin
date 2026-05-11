import Link from 'next/link';

export default function Footer({ settings }: { settings: Record<string, string> }) {
  return (
    <footer className="bg-[#0f172a] text-slate-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          <div className="md:col-span-3">
            <Link href="/" className="flex items-center gap-3">
              <img src="/images/Stars777-Logo.png" alt="Stars777" className="h-14 w-auto" />
            </Link>
          </div>
          <div className="md:col-span-9 grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="text-white font-semibold mb-6">Support</h4>
              <ul className="space-y-4 font-medium">
                <li><Link href="/contact" className="hover:text-white transition">Submit ticket</Link></li>
                <li><Link href="/faq" className="hover:text-white transition">Documentation</Link></li>
                <li><Link href="/blogs" className="hover:text-white transition">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Company</h4>
              <ul className="space-y-4 font-medium">
                <li><Link href="/#about-us" className="hover:text-white transition">About</Link></li>
                <li><Link href="/blogs" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Jobs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-4 font-medium">
                <li><Link href="#" className="hover:text-white transition">Terms of service</Link></li>
                <li><Link href="#" className="hover:text-white transition">Privacy policy</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm font-medium">
            <span>Stars777 © 2026. All rights reserved.</span>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {/* Social links implementation */}
            {settings.social_facebook && <a href={settings.social_facebook} target="_blank" className="text-[#1877F2] hover:scale-110 transition"><i className="fa-brands fa-facebook-f text-xl"></i></a>}
            {settings.social_telegram && <a href={settings.social_telegram} target="_blank" className="text-[#229ED9] hover:scale-110 transition"><i className="fa-brands fa-telegram text-xl"></i></a>}
            {/* Add more social icons as needed */}
          </div>
        </div>
      </div>
    </footer>
  );
}
