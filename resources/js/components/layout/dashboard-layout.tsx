import { PropsWithChildren, ReactNode } from "react";

import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {Separator} from "@/components/ui/separator";

import { AppSidebar } from "./sidebar";
import UserProfileDropdown from "./user-profile-dropdown"; 
import { NavigationItem } from "@/types/ui";
import Breadcrumbs from "./breadcrumbs/breadcrumbs";

export default function DashboardLayout({
    navigations,
    children
}: PropsWithChildren<{
    header?: ReactNode;
    navigations : Array<NavigationItem>
}>) {
    return (
        <SidebarProvider>
            <AppSidebar navigationItems={navigations}/>
            <SidebarInset>
                <header className="sticky top-0 bg-background flex h-16 shrink-0 items-center gap-2 justify-between p-4 border-b md:border-none md:rounded-xl">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumbs/>
                    </div>
                    <div>
                        <UserProfileDropdown />
                        {/* <AppearanceDropdown /> */}
                    </div>
                </header>

                <main className="p-4 md:pt-0">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}