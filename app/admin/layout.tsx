"use client"

import React from "react"

import type { ReactNode } from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()

  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split("/").filter(Boolean)
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ")
    return { href, label }
  })

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbItem>
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    <>
                      <BreadcrumbItem>
                        <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </>
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
