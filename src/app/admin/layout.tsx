'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logout } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If we are on the login page, don't show the sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/admin', icon: 'house', label: 'Dashboard' },
    { href: '/admin/blogs', icon: 'pen-nib', label: 'Blogs' },
    { href: '/admin/categories', icon: 'layer-group', label: 'Categories' },
    { href: '/admin/reviews', icon: 'star', label: 'Reviews' },
    { href: '/admin/faq', icon: 'circle-question', label: 'FAQs' },
    { href: '/admin/promotions', icon: 'bullhorn', label: 'Promotions' },
    { href: '/admin/contacts', icon: 'envelope', label: 'Messages' },
    { href: '/admin/settings', icon: 'gear', label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f4f7fe]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0d1522] text-white flex-shrink-0 flex flex-col fixed inset-y-0 shadow-2xl z-50">
        <div className="p-8">
          <Link href="/admin">
            <img src="/images/Stars777-Logo.png" alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>
        
        <nav className="flex-grow px-4 space-y-2 mt-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-8 ml-2 block">Management</p>
          
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <i className={`fa-solid fa-${item.icon} w-5`}></i>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => logout()}
            className="flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-400 hover:bg-red-400/10 transition-all w-full"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-5"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow ml-72 p-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    </div>
  );
}
