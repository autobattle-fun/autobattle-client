'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Radio, Gamepad2, User, Clock, Settings } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  
  const links = [
    { href: '/', icon: Radio, label: 'Home' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/games', icon: Gamepad2, label: 'Games' },
    { href: '/history', icon: Clock, label: 'History' },
  ];

  return (
    <aside className="w-20 h-screen bg-background flex flex-col items-center py-6 shrink-0 z-20">
      {/* Logo Placeholder */}
      <Link href="/" className="mb-10 flex flex-col items-center gap-2">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Box className="w-6 h-6 text-white" />
        </div>
      </Link>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-4 w-full px-3">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link 
              key={link.href} 
              href={link.href}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-colors ${
                isActive 
                  ? 'text-primary' 
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="mt-auto w-full px-3">
        <Link 
          href="/settings"
          className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-colors ${
            pathname === '/settings'
              ? 'text-primary' 
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
