"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Pill, Upload, Package, ShoppingBag, MessageSquare, User, LogOut } from "lucide-react"
import { logout } from "@/app/actions/auth"

export function CustomerNav({ userName }: { userName: string }) {
  const pathname = usePathname()

  const navItems = [
    { href: "/customer", icon: Package, label: "Dashboard" },
    { href: "/customer/prescriptions", icon: Upload, label: "Prescriptions" },
    { href: "/customer/medicines", icon: Pill, label: "Medicines" },
    { href: "/customer/orders", icon: ShoppingBag, label: "Orders" },
    { href: "/customer/chat", icon: MessageSquare, label: "Chat" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/customer" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Pill className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Dawai</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button key={item.href} variant={isActive ? "secondary" : "ghost"} size="sm" asChild className="gap-2">
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{userName}</span>
          </div>
          <form action={logout}>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
