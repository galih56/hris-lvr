import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.png';

import { 
  Home,  
  Users2Icon,
  Settings 
} from "lucide-react"
import { paths } from "@/apps/hris-dashboard/paths";

const navigationItems = [
  {
    title: "Home",
    url: paths.home.getHref(),
    icon: Home,
  },
  {
    title: "Employee",
    url: paths.app.employees.getHref(),
    icon: Users2Icon,
  },
  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings,
  // },
]

const Logo = () => {
  return (
    <Link className="flex items-center text-white py-6" to={paths.home.getHref()}>
      <img className="h-14 w-auto" src={logo} alt="Workflow" />
    </Link>
  );
};
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Logo/>
      </SidebarHeader>
      <SidebarContent>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
  