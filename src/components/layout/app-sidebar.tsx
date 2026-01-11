"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  Calendar,
  CheckSquare,
  FileText,
  Home,
  Settings,
  GraduationCap,
  Atom,
  Calculator,
  Languages,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Schedule",
    url: "/schedule",
    icon: Calendar,
  },
  {
    title: "Todos",
    url: "/todos",
    icon: CheckSquare,
  },
  {
    title: "Practice Notes",
    url: "/practice",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

const subjectItems = [
  {
    title: "Physics",
    url: "/subjects/physics",
    icon: Atom,
    color: "text-blue-500",
  },
  {
    title: "Mathematics",
    url: "/subjects/maths",
    icon: Calculator,
    color: "text-emerald-500",
  },
  {
    title: "Russian",
    url: "/subjects/russian",
    icon: Languages,
    color: "text-red-500",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">TiggyLearn</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Subjects</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/subjects"}
                >
                  <Link href="/subjects">
                    <BookOpen className="h-4 w-4" />
                    <span>All Subjects</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {subjectItems.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={pathname.startsWith(item.url)}
                      >
                        <Link href={item.url}>
                          <item.icon className={`h-4 w-4 ${item.color}`} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <p className="text-xs text-muted-foreground text-center">
          A-Level Revision 2026
        </p>
      </SidebarFooter>
    </Sidebar>
  )
}
