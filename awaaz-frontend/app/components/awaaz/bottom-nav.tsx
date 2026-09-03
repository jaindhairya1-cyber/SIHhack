"use client"

import Link from "next/link"
import { Home, Mic, ListChecks, User } from "lucide-react"

type NavKey = "home" | "chat" | "tracking" | "profile"

const items: { key: NavKey; label: string; icon: typeof Home; href: string }[] = [
  { key: "home", label: "Home", icon: Home, href: "/" },
  { key: "chat", label: "Awaaz", icon: Mic, href: "/awaaz/chat" },
  { key: "tracking", label: "Track", icon: ListChecks, href: "/awaaz/tracking" },
  { key: "profile", label: "Profile", icon: User, href: "/profile" },
]

export function BottomNav({ active }: { active: NavKey }) {
  return (
    <nav
      aria-label="Primary"
      className="sticky bottom-0 z-20 mt-auto border-t border-awaaz-line bg-awaaz-surface/95 backdrop-blur"
    >
      <ul className="mx-auto flex max-w-sm items-center justify-around px-2 py-2">
        {items.map(({ key, label, icon: Icon, href }) => {
          const isActive = key === active
          return (
            <li key={key}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center gap-1 rounded-2xl px-3 py-1.5 transition-colors"
              >
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
                    isActive ? "bg-awaaz-yellow text-awaaz-yellow-foreground" : "text-awaaz-muted",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </span>
                <span
                  className={[
                    "text-[11px] font-medium",
                    isActive ? "text-awaaz-ink" : "text-awaaz-muted",
                  ].join(" ")}
                >
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
