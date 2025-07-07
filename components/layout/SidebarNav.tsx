
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  BookCopy,
  UsersRound,
  NotebookPen,
  ShoppingCart,
  History
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Visão Geral', icon: LayoutDashboard },
  { href: '/dashboard/orders', label: 'Novo Pedido', icon: ShoppingCart },
  { href: '/dashboard/annotations', label: 'Anotações', icon: NotebookPen },
  { href: '/dashboard/sales', label: 'Vendas', icon: History },
];

const managementItems: NavItem[] = [
  { href: '/dashboard/menu', label: 'Cardápio', icon: BookCopy },
  { href: '/dashboard/customers', label: 'Clientes', icon: UsersRound },
];

export function SidebarNav() {
  const pathname = usePathname();

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => (
      <Button
        key={item.href}
        asChild
        variant={pathname === item.href ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start text-sm',
          pathname === item.href 
            ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90' 
            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        )}
      >
        <Link href={item.href}>
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Link>
      </Button>
    ));
  }

  return (
    <nav className="flex flex-col gap-4 px-4 py-6">
      <div className="flex flex-col gap-1">
        {renderNavItems(navItems)}
      </div>
      <div>
        <p className="px-2 text-xs font-semibold text-sidebar-foreground/60 mb-2 mt-2">Gestão</p>
        <div className="flex flex-col gap-1">
          {renderNavItems(managementItems)}
        </div>
      </div>
    </nav>
  );
}
