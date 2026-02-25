import { useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Package, MessageSquare, Settings2,
  FileEdit, BarChart3, Wrench, LogOut, Bell, ExternalLink,
  Menu, X, ChevronRight, ShoppingCart,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navGroups = [
  {
    label: "PRINCIPAL",
    items: [
      { to: "/admin/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
      { to: "/admin/commandes", icon: Package, label: "Commandes" },
      { to: "/admin/paniers-abandonnes", icon: ShoppingCart, label: "Paniers abandonnés" },
      { to: "/admin/leads", icon: MessageSquare, label: "Leads", badge: 3 },
    ],
  },
  {
    label: "BOUTIQUE",
    items: [
      { to: "/admin/configurateur", icon: Settings2, label: "Configurateur" },
      { to: "/admin/contenu", icon: FileEdit, label: "Contenu" },
    ],
  },
  {
    label: "ANALYSE",
    items: [
      { to: "/admin/marketing", icon: BarChart3, label: "Marketing" },
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
      <div className="px-5 py-5">
        <span className="text-lg font-bold text-white tracking-tight font-sans">[BRAND]</span>
        <span className="ml-2 text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded font-sans">Admin</span>
      </div>
      <div className="border-t border-gray-800 mx-4" />

      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[11px] font-semibold text-gray-500 tracking-widest font-sans">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-sans transition-colors ${
                      isActive
                        ? "bg-gray-700 text-white border-l-[3px] border-[#4A5E3A]"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white border-l-[3px] border-transparent"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
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
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-sans text-gray-400 hover:bg-gray-800 hover:text-white w-full border-l-[3px] border-transparent transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </nav>

      <div className="border-t border-gray-800 mx-4" />
      <div className="px-5 py-4 flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-gray-700 text-gray-300 text-xs font-sans">AD</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-sm text-white font-medium truncate font-sans">{admin?.name}</p>
          <p className="text-xs text-gray-500 truncate font-sans">{admin?.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-60 bg-gray-900 flex-col z-40">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-60 bg-gray-900 flex flex-col">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Topbar */}
      <header className="fixed top-0 left-0 lg:left-60 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-30">
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
            <span className="text-gray-400">Admin</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="font-medium text-gray-900">{pageTitle}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 font-sans"
          >
            Voir le site <ExternalLink className="w-3 h-3" />
          </a>
          <Avatar className="h-8 w-8 ml-2">
            <AvatarFallback className="bg-gray-200 text-gray-600 text-xs font-sans">AD</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="lg:ml-60 mt-16 p-4 lg:p-8 min-h-[calc(100vh-4rem)]">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
