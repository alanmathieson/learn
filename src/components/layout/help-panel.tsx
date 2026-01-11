"use client"

import { HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface HelpPanelProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function HelpPanel({ title, description, children }: HelpPanelProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Help</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[640px] overflow-y-auto">
        <div className="pl-4">
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            {description && (
              <SheetDescription>{description}</SheetDescription>
            )}
          </SheetHeader>
          <div className="mt-6 space-y-6">
            {children}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface HelpSectionProps {
  title: string
  children: React.ReactNode
}

export function HelpSection({ title, children }: HelpSectionProps) {
  return (
    <div>
      <h3 className="font-semibold text-sm mb-2">{title}</h3>
      <div className="text-sm text-muted-foreground space-y-2">
        {children}
      </div>
    </div>
  )
}

interface StatusBadgeProps {
  color: string
  label: string
  description: string
}

export function StatusBadge({ color, label, description }: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-3">
      <span className={`inline-block w-3 h-3 rounded-full ${color}`} />
      <div>
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground"> - {description}</span>
      </div>
    </div>
  )
}
