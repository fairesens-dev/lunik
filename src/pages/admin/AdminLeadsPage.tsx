import { useState, useMemo } from "react";
import { Search, Mail, Phone, Check, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Lead {
  id: number; prenom: string; nom: string; email: string; telephone: string;
  width: number; projection: number; toileColor: string; armatureColor: string;
  options: string[]; codePostal: string; date: string; message: string; traite: boolean;
}

const MOCK_LEADS: Lead[] = [
  { id: 1, prenom: "Camille", nom: "Roux", email: "camille.roux@email.fr", telephone: "06 12 34 56 78", width: 400, projection: 300, toileColor: "Sauge", armatureColor: "Anthracite", options: ["Motorisation"], codePostal: "75015", date: "2024-01-23", message: "Intéressée par un devis.", traite: false },
  { id: 2, prenom: "Antoine", nom: "Lefevre", email: "a.lefevre@email.fr", telephone: "07 98 76 54 32", width: 350, projection: 250, toileColor: "Ivoire", armatureColor: "Blanc", options: [], codePostal: "69001", date: "2024-01-22", message: "", traite: false },
  { id: 3, prenom: "Julie", nom: "Martin", email: "julie.m@email.fr", telephone: "06 45 67 89 01", width: 300, projection: 200, toileColor: "Taupe", armatureColor: "Anthracite", options: ["LED"], codePostal: "33000", date: "2024-01-21", message: "Besoin d'infos sur la motorisation.", traite: false },
  { id: 4, prenom: "Thomas", nom: "Girard", email: "t.girard@email.fr", telephone: "06 23 45 67 89", width: 450, projection: 350, toileColor: "Sauge", armatureColor: "Anthracite", options: ["Motorisation", "LED"], codePostal: "13008", date: "2024-01-20", message: "", traite: true },
  { id: 5, prenom: "Emma", nom: "Dupont", email: "emma.d@email.fr", telephone: "07 11 22 33 44", width: 350, projection: 250, toileColor: "Sauge", armatureColor: "Blanc", options: [], codePostal: "31000", date: "2024-01-19", message: "Quels sont les délais ?", traite: false },
  { id: 6, prenom: "Hugo", nom: "Mercier", email: "h.mercier@email.fr", telephone: "06 55 66 77 88", width: 300, projection: 250, toileColor: "Ivoire", armatureColor: "Anthracite", options: ["Pack Connect"], codePostal: "44000", date: "2024-01-18", message: "", traite: true },
  { id: 7, prenom: "Léa", nom: "Fontaine", email: "lea.f@email.fr", telephone: "07 22 33 44 55", width: 400, projection: 300, toileColor: "Taupe", armatureColor: "Blanc", options: ["Motorisation"], codePostal: "67000", date: "2024-01-17", message: "Peut-on avoir un RDV ?", traite: true },
  { id: 8, prenom: "Maxime", nom: "Rousseau", email: "m.rousseau@email.fr", telephone: "06 99 88 77 66", width: 350, projection: 250, toileColor: "Sauge", armatureColor: "Anthracite", options: ["LED"], codePostal: "59000", date: "2024-01-16", message: "", traite: false },
  { id: 9, prenom: "Chloé", nom: "Lambert", email: "c.lambert@email.fr", telephone: "07 44 55 66 77", width: 300, projection: 200, toileColor: "Ivoire", armatureColor: "Blanc", options: [], codePostal: "21000", date: "2024-01-15", message: "Budget limité à 2000€.", traite: true },
  { id: 10, prenom: "Nicolas", nom: "Bonnet", email: "n.bonnet@email.fr", telephone: "06 33 22 11 00", width: 450, projection: 350, toileColor: "Taupe", armatureColor: "Anthracite", options: ["Motorisation", "Pack Connect"], codePostal: "34000", date: "2024-01-14", message: "", traite: false },
  { id: 11, prenom: "Laura", nom: "Faure", email: "l.faure@email.fr", telephone: "07 66 55 44 33", width: 350, projection: 250, toileColor: "Sauge", armatureColor: "Blanc", options: ["LED"], codePostal: "06000", date: "2024-01-13", message: "Merci de me recontacter.", traite: true },
  { id: 12, prenom: "Romain", nom: "Chevalier", email: "r.chevalier@email.fr", telephone: "06 77 88 99 00", width: 400, projection: 300, toileColor: "Ivoire", armatureColor: "Anthracite", options: [], codePostal: "38000", date: "2024-01-12", message: "", traite: true },
  { id: 13, prenom: "Sarah", nom: "Lemoine", email: "s.lemoine@email.fr", telephone: "07 88 77 66 55", width: 300, projection: 200, toileColor: "Taupe", armatureColor: "Blanc", options: ["Motorisation"], codePostal: "54000", date: "2024-01-11", message: "", traite: false },
  { id: 14, prenom: "Julien", nom: "Gauthier", email: "j.gauthier@email.fr", telephone: "06 11 22 33 44", width: 350, projection: 250, toileColor: "Sauge", armatureColor: "Anthracite", options: ["Motorisation", "LED"], codePostal: "35000", date: "2024-01-10", message: "Urgent, besoin pour mars.", traite: true },
  { id: 15, prenom: "Manon", nom: "Perrin", email: "m.perrin@email.fr", telephone: "07 99 88 77 66", width: 400, projection: 300, toileColor: "Ivoire", armatureColor: "Blanc", options: ["Pack Connect"], codePostal: "29000", date: "2024-01-09", message: "", traite: false },
];

const PER_PAGE = 10;

const AdminLeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [search, setSearch] = useState("");
  const [nonTraitesOnly, setNonTraitesOnly] = useState(false);
  const [period, setPeriod] = useState("Ce mois");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = leads;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(l => `${l.prenom} ${l.nom}`.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.telephone.includes(q));
    }
    if (nonTraitesOnly) result = result.filter(l => !l.traite);
    return result;
  }, [leads, search, nonTraitesOnly]);

  const totalThisMonth = leads.length;
  const nonTraites = leads.filter(l => !l.traite).length;
  const tauxTraitement = totalThisMonth > 0 ? Math.round(((totalThisMonth - nonTraites) / totalThisMonth) * 100) : 0;

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleTraite = (id: number) => setLeads(prev => prev.map(l => l.id === id ? { ...l, traite: !l.traite } : l));
  const deleteLead = (id: number) => setLeads(prev => prev.filter(l => l.id !== id));

  return (
    <div className="space-y-4 font-sans">
      <h1 className="text-2xl font-bold text-gray-900">Leads</h1>

      {/* Stat Banner */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-6 text-sm">
            <div><span className="font-bold text-gray-900">{totalThisMonth}</span> <span className="text-gray-500">leads ce mois</span></div>
            <div><span className="font-bold text-orange-600">{nonTraites}</span> <span className="text-gray-500">non traités</span></div>
            <div><span className="text-gray-500">Taux de traitement :</span> <Badge variant="secondary" className="ml-1">{tauxTraitement}%</Badge></div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Rechercher par nom, email, téléphone..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={nonTraitesOnly} onCheckedChange={(v) => { setNonTraitesOnly(v); setPage(1); }} />
              <span className="text-sm text-gray-600">Non traités uniquement</span>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["Ce mois", "3 mois", "6 mois", "Cette année"].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-gray-200">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Nom</TableHead>
                <TableHead className="text-xs">Email</TableHead>
                <TableHead className="text-xs">Téléphone</TableHead>
                <TableHead className="text-xs">Configuration</TableHead>
                <TableHead className="text-xs">CP</TableHead>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Traité</TableHead>
                <TableHead className="text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map(l => (
                <TableRow key={l.id} className={l.traite ? "opacity-50" : ""}>
                  <TableCell className="text-xs font-medium">{l.prenom} {l.nom}</TableCell>
                  <TableCell className="text-xs text-gray-500">{l.email}</TableCell>
                  <TableCell className="text-xs text-gray-500">{l.telephone}</TableCell>
                  <TableCell className="text-xs">{l.width}×{l.projection} cm · {l.toileColor}</TableCell>
                  <TableCell className="text-xs">{l.codePostal}</TableCell>
                  <TableCell className="text-xs text-gray-500">{new Date(l.date).toLocaleDateString("fr-FR")}</TableCell>
                  <TableCell><Checkbox checked={l.traite} onCheckedChange={() => toggleTraite(l.id)} /></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild><a href={`mailto:${l.email}`}><Mail className="w-3.5 h-3.5" /></a></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild><a href={`tel:${l.telephone.replace(/\s/g, "")}`}><Phone className="w-3.5 h-3.5" /></a></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleTraite(l.id)}><Check className="w-3.5 h-3.5" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-700" onClick={() => deleteLead(l.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-xs text-gray-500">{filtered.length} lead{filtered.length > 1 ? "s" : ""} · Page {page}/{totalPages}</p>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Préc.</Button>
                <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Suiv.</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeadsPage;
