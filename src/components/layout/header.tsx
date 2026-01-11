"use client"

import { UserButton } from "@clerk/nextjs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

interface HeaderProps {
  title?: string
  helpContent?: React.ReactNode
}

export function Header({ title, helpContent }: HeaderProps) {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <SidebarTrigger className="-ml-2" />
      <Separator orientation="vertical" className="h-6" />
      {title && (
        <h1 className="text-lg font-semibold">{title}</h1>
      )}
      <div className="ml-auto flex items-center gap-4">
        {helpContent}
        <UserButton
          afterSignOutUrl="/sign-in"
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </div>
    </header>
  )
}
