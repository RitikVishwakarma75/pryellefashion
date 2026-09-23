'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  FolderTree,
  Sparkles,
  ShoppingBag,
  Users,
  Warehouse,
  Percent,
  Compass,
  Scissors,
  Mail,
  BarChart3,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Image as ImageIcon,
  Star,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  // If on login page, don't show the admin shell sidebar
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage) {
      fetch('/api/auth/me')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            setUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [isLoginPage]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navGroups = [
    {
      label: 'Core Management',
      items: [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard },
        { label: 'All Products', href: '/admin/products', icon: Package },
        { label: 'Add Product', href: '/admin/products/new', icon: PlusCircle },
        { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
        { label: 'Categories', href: '/admin/categories', icon: FolderTree },
        { label: 'Collections', href: '/admin/collections', icon: Sparkles },
      ],
    },
    {
      label: 'Operations',
      items: [
        { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { label: 'Inventory', href: '/admin/inventory', icon: Warehouse },
        { label: 'Customers', href: '/admin/customers', icon: Users },
        { label: 'Reviews', href: '/admin/reviews', icon: Star },
        { label: 'Discounts', href: '/admin/discounts', icon: Percent },
      ],
    },
    {
      label: 'Editorial & Curation',
      items: [
        { label: 'Mood Engine', href: '/admin/moods', icon: Compass },
        { label: 'Hairstyles & Styling', href: '/admin/styling', icon: Scissors },
        { label: 'Newsletter', href: '/admin/newsletter', icon: Mail },
        { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F0E0D] text-[#ECE7DF] flex flex-col md:flex-row antialiased selection:bg-[#C5A059] selection:text-black">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#161513] border-b border-white/10 sticky top-0 z-40">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="editorial-serif text-xl font-normal tracking-[0.16em] uppercase text-white">
            PRAYELE
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-medium">
            Console
          </span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white/5 text-stone-300"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Luxury Admin Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#141311] border-r border-white/10 p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Wordmark */}
          <div className="pb-6 mb-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/admin" className="block">
              <span className="editorial-serif text-2xl font-light tracking-[0.16em] uppercase text-white block">
                PRAYELE
              </span>
              <span className="caps-subtitle text-[8.5px] tracking-[0.3em] text-[#C5A059] block mt-0.5">
                HAUTE HAIRWEAR • ADMIN
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 text-stone-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-6 overflow-y-auto max-h-[calc(100vh-260px)] pr-1 no-scrollbar">
            {navGroups.map((group) => (
              <div key={group.label}>
                <span className="caps-subtitle text-[9px] tracking-widest text-stone-500 uppercase font-semibold block mb-2 px-3">
                  {group.label}
                </span>
                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium tracking-wide transition-all ${
                            isActive
                              ? 'bg-[#C5A059] text-black font-semibold shadow-md'
                              : 'text-stone-400 hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* User Card & Storefront Link */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Storefront</span>
            </span>
            <span className="text-[10px] text-[#C5A059]">↗</span>
          </Link>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || 'Prayele Admin'}
              </p>
              <p className="text-[10px] text-stone-400 truncate">
                {user?.email || 'admin@prayele.com'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-white/10 text-stone-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
