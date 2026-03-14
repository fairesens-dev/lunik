import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, MessageSquare, Settings2,
  FileEdit, BarChart3, Wrench, LogOut, Bell, ExternalLink,
  Menu, X, ChevronRight, ShoppingCart, Tag, Users, Mail, Layers, Target,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import logoLunik from "@/assets/logo-lunik.svg";

const navGroups = [
  {
    label: "PRINCIPAL",
    items: [
      { to: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
      { to: "/admin/commandes", icon: Package, label: "Commandes" },
      { to: "/admin/paniers-abandonnes", icon: ShoppingCart, label: "Paniers abandonnés" },
      { to: "/admin/leads", icon: MessageSquare, label: "Leads", badge: 3 },
      { to: "/admin/contacts", icon: Users, label: "Contacts" },
    ],
  },
  {
    label: "BOUTIQUE",
    items: [
      { to: "/admin/configurateur", icon: Settings2, label: "Configurateur" },
      { to: "/admin/contenu", icon: FileEdit, label: "Contenu" },
      { to: "/admin/modals", icon: Layers, label: "Modals" },
    ],
  },
  {
    label: "ANALYSE",
    items: [
      { to: "/admin/marketing", icon: BarChart3, label: "Marketing" },
      { to: "/admin/tracking", icon: Tag, label: "Tracking" },
      { to: "/admin/campaigns", icon: Mail, label: "Campagnes" },
      { to: "/admin/scoring", icon: Target, label: "Scoring" },
    ],
  },
  {
    label: "COMPTE",
    items: [
      { to: "/admin/parametres", icon: Wrench, label: "Paramètres" },
    ],
  },
];

const routeTitles: Record<string, string> = {
  "/admin/dashboard": "Tableau de bord",
  "/admin/commandes": "Commandes",
  "/admin/paniers-abandonnes": "Paniers abandonnés",
  "/admin/leads": "Leads",
  "/admin/configurateur": "Configurateur",
  "/admin/contenu": "Contenu",
  "/admin/marketing": "Marketing",
  "/admin/tracking": "Tracking",
  "/admin/contacts": "Contacts",
  "/admin/campaigns": "Campagnes",
  "/admin/scoring": "Scoring",
  "/admin/modals": "Modals",
  "/admin/parametres": "Paramètres",
};

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const pageTitle = location.pathname.match(/^\/admin\/commandes\/.+/)
    ? "Détail commande"
    : routeTitles[location.pathname] || "Admin";

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-5 py-6 flex items-center gap-3">
        <img src={logoLunik} alt="LuniK" className="h-10 brightness-0 invert" />
        <span className="text-[10px] bg-white/10 text-white/50 px-2 py-0.5 rounded-md font-sans uppercase tracking-wider">Admin</span>
      </div>
      <div className="border-t border-white/[0.06] mx-5" />

      <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2.5 text-[10px] font-semibold text-white/30 tracking-[0.15em] font-sans">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-sans transition-all duration-200 ${
                      isActive
                        ? "bg-white/[0.12] text-white font-medium"
                        : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
                    }`
                  }
                >
                  <item.icon className="w-[18px] h-[18px] shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-accent text-accent-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-sans text-white/50 hover:bg-white/[0.06] hover:text-white/80 w-full transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>

      <div className="border-t border-white/[0.06] mx-5" />
      <div className="px-5 py-4 flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-white/[0.08] text-white/70 text-xs font-sans">AD</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-[13px] text-white font-medium truncate font-sans">{admin?.name}</p>
          <p className="text-[11px] text-white/40 truncate font-sans">{admin?.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-muted/40 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-[260px] bg-[#1a1a2e] flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[260px] bg-[#1a1a2e] flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-5 right-4 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Topbar */}
      <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-background shadow-sm flex items-center justify-between px-4 lg:px-8 z-30">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2 text-sm font-sans">
            <span className="text-muted-foreground">Admin</span>
            <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
            <span className="font-medium text-foreground">{pageTitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
          </Button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-sans"
          >
            Voir le site <ExternalLink className="w-3 h-3" />
          </a>
          <Avatar className="h-8 w-8 ml-2">
            <AvatarFallback className="bg-secondary text-foreground text-xs font-sans">AD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-[260px] mt-16 p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
