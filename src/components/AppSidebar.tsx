import { 
  Home, Target, CreditCard, Layers, RefreshCw, Calendar, BarChart3, Building, 
  Grid3X3, TrendingUp, BarChart, Users, FileText, Tags, Tag, Search, Edit, ChevronDown, Pin
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type MenuItemType = {
  title: string;
  url: string;
  icon: any;
  hasPin?: boolean;
  comingSoon?: boolean;
};

const financeiroItems: MenuItemType[] = [
  { title: "Radar", url: "/financeiro/radar", icon: Target },
  { title: "Lançamentos", url: "/financeiro/lancamentos", icon: CreditCard },
];

const relatoriosItems: MenuItemType[] = [
  { title: "Demonstrativo", url: "/demonstrativo", icon: TrendingUp },
  { title: "Fluxo de caixa", url: "/reports", icon: BarChart, comingSoon: true },
];

const cadastrosItems: MenuItemType[] = [
  { title: "Contatos", url: "/contatos", icon: Users, comingSoon: true },
  { title: "Contas", url: "/contas", icon: FileText, comingSoon: true },
  { title: "Categorias", url: "/categorias", icon: Tags },
  { title: "Tags", url: "/tags", icon: Tag, comingSoon: true },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;
  
  const [financeiroOpen, setFinanceiroOpen] = useState(true);
  const [relatoriosOpen, setRelatoriosOpen] = useState(true);
  const [cadastrosOpen, setCadastrosOpen] = useState(true);

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Workspace Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-muted flex-shrink-0">
                <span className="text-sm font-medium text-foreground">T</span>
              </div>
              {!collapsed && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-sidebar-foreground">Teste</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
            </div>
            {!collapsed && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto py-2">
          {/* Início */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className={`h-9 mx-2 rounded ${
                    isActive("/dashboard") 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}>
                    <a href="/dashboard" className="flex items-center gap-3">
                      <Home className="h-4 w-4" />
                      {!collapsed && <span className="text-sm">Visão Geral</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Financeiro Section */}
          {!collapsed && (
            <Collapsible open={financeiroOpen} onOpenChange={setFinanceiroOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-4 py-2 text-muted-foreground hover:text-sidebar-foreground text-sm font-medium">
                  <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${financeiroOpen ? 'rotate-0' : '-rotate-90'}`} />
                  Financeiro
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {financeiroItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.url);
                        
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild className={`h-9 mx-2 rounded ${
                              active 
                                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                            }`}>
                              <a href={item.url} className="flex items-center gap-3 justify-between">
                                <div className="flex items-center gap-3">
                                  <Icon className="h-4 w-4" />
                                  <span className="text-sm">{item.title}</span>
                                </div>
                                {item.hasPin && <Pin className="h-3 w-3 text-muted-foreground" />}
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Relatórios Section */}
          {!collapsed && (
            <Collapsible open={relatoriosOpen} onOpenChange={setRelatoriosOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-4 py-2 text-muted-foreground hover:text-sidebar-foreground text-sm font-medium">
                  <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${relatoriosOpen ? 'rotate-0' : '-rotate-90'}`} />
                  Relatórios
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {relatoriosItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.url);
                        
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild className={`h-9 mx-2 rounded ${
                              active 
                                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                            }`}>
                              <a href={item.url} className="flex items-center gap-3 justify-between">
                                <div className="flex items-center gap-3">
                                  <Icon className="h-4 w-4" />
                                  <span className="text-sm">{item.title}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {item.comingSoon && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                      Em Breve
                                    </Badge>
                                  )}
                                  {item.hasPin && <Pin className="h-3 w-3 text-muted-foreground" />}
                                </div>
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Cadastros Section */}
          {!collapsed && (
            <Collapsible open={cadastrosOpen} onOpenChange={setCadastrosOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start px-4 py-2 text-muted-foreground hover:text-sidebar-foreground text-sm font-medium">
                  <ChevronDown className={`h-4 w-4 mr-2 transition-transform ${cadastrosOpen ? 'rotate-0' : '-rotate-90'}`} />
                  Cadastros
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {cadastrosItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.url);
                        
                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild className={`h-9 mx-2 rounded ${
                              active 
                                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                            }`}>
                              <a href={item.url} className="flex items-center gap-3 justify-between">
                                <div className="flex items-center gap-3">
                                  <Icon className="h-4 w-4" />
                                  <span className="text-sm">{item.title}</span>
                                </div>
                                {item.comingSoon && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    Em Breve
                                  </Badge>
                                )}
                              </a>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>

        {/* User info at bottom */}
        {!collapsed && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-muted text-foreground text-xs">
                  <Users className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Gabriel Chamas</p>
                <p className="text-xs text-muted-foreground truncate">chamas.gabriel@gmail.com</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}