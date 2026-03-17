import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Users, Search, ChevronLeft, ChevronRight, Download,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Contact = Tables<"contacts">;

const AdminContactsPage = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [perPage] = useState(25);
  const [page, setPage] = useState(0);

  useEffect(() => {
    (async () => {
      // Get distinct emails from orders
      const { data: orders } = await supabase
        .from("orders")
        .select("client_email");
      if (!orders) { setLoading(false); return; }
      const customerEmails = new Set(orders.map((o: any) => o.client_email?.toLowerCase()));

      // Get all contacts
      const { data: allContacts, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) { toast.error("Erreur chargement clients"); setLoading(false); return; }

      // Filter only those with matching order email
      const clients = (allContacts || []).filter(c =>
        customerEmails.has(c.email.toLowerCase())
      );
      setContacts(clients);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!search) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(c =>
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.phone || "").includes(q)
    );
  }, [contacts, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice(page * perPage, (page + 1) * perPage);

  const initials = (c: Contact) =>
    `${(c.first_name || "?")[0]}${(c.last_name || "?")[0]}`.toUpperCase();

  const exportCSV = () => {
    const header = "Prénom,Nom,Email,Téléphone\n";
    const csv = header + contacts.map(c =>
      [c.first_name, c.last_name, c.email, c.phone || ""].join(",")
    ).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "clients.csv";
    a.click();
    toast.success(`${contacts.length} clients exportés`);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card><CardContent className="pt-4">
          <p className="text-xs text-muted-foreground font-sans">Total clients</p>
          <p className="text-2xl font-bold font-sans">{contacts.length}</p>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2 font-sans">
            <Users className="w-5 h-5" /> Clients
          </CardTitle>
          <Button size="sm" variant="outline" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-1" /> Export CSV
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Rechercher nom, email, téléphone…" className="pl-9"
              value={search} onChange={e => { setSearch(e.target.value); setPage(0); }} />
          </div>

          {/* Table */}
          {loading ? (
            <p className="text-center text-muted-foreground py-8 font-sans">Chargement…</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-sans">Client</TableHead>
                  <TableHead className="font-sans">Email</TableHead>
                  <TableHead className="hidden md:table-cell font-sans">Téléphone</TableHead>
                  <TableHead className="hidden lg:table-cell font-sans">Créé le</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.map(c => (
                  <TableRow key={c.id} className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate(`/admin/contacts/${c.id}`)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-sans">{initials(c)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-sm font-sans">{c.first_name} {c.last_name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-sans">{c.email}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm font-sans">{c.phone || "—"}</TableCell>
                    <TableCell className="hidden lg:table-cell text-xs text-muted-foreground font-sans">
                      {format(new Date(c.created_at), "dd MMM yyyy", { locale: fr })}
                    </TableCell>
                  </TableRow>
                ))}
                {pageData.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground font-sans">Aucun client trouvé</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-muted-foreground font-sans">
                {filtered.length} résultat(s) — page {page + 1}/{totalPages}
              </p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminContactsPage;
