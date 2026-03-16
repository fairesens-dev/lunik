import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ImageIcon, Upload, Loader2 } from "lucide-react";

const BUCKET = "Website";
const SUPABASE_URL = "https://gejgtkgqyzdfbsbxujgl.supabase.co";

function getPublicUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(path).replace(/%2F/g, "/")}`;
}

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helper?: string;
}

interface BucketFile {
  name: string;
  folder: string;
  fullPath: string;
  url: string;
}

const ImagePicker = ({ value, onChange, label, helper }: ImagePickerProps) => {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<BucketFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState("");
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const loadFiles = async () => {
    setLoading(true);
    const allFiles: BucketFile[] = [];

    const listFolder = async (folder: string) => {
      const { data } = await supabase.storage.from(BUCKET).list(folder, { limit: 500 });
      if (!data) return;
      for (const f of data) {
        if (f.name === '.emptyFolderPlaceholder') continue;
        if (f.id) {
          const fullPath = folder ? `${folder}/${f.name}` : f.name;
          allFiles.push({ name: f.name, folder, fullPath, url: getPublicUrl(fullPath) });
        } else {
          const subFolder = folder ? `${folder}/${f.name}` : f.name;
          await listFolder(subFolder);
        }
      }
    };

    await listFolder("");
    setFiles(allFiles);
    setLoading(false);
  };

  useEffect(() => {
    if (open) loadFiles();
  }, [open]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const safeName = file.name
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/_+/g, "_");
    const path = safeName;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
    if (!error) {
      const url = getPublicUrl(path);
      onChange(url);
      await loadFiles();
      setOpen(false);
    }
    setUploading(false);
  };

  const folders = [...new Set(files.map(f => f.folder))].sort((a, b) => {
    if (a === "TOP PHOTOS") return -1;
    if (b === "TOP PHOTOS") return 1;
    return a.localeCompare(b);
  });

  const filtered = files.filter(f => {
    if (activeFolder !== null && f.folder !== activeFolder) return false;
    if (filter && !f.name.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {label && <Label className="text-sm font-medium mb-1.5 block">{label}</Label>}
      <div className="flex gap-2 items-start">
        {value ? (
          <div className="relative w-20 h-14 shrink-0 rounded border overflow-hidden">
            <img src={value} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-14 shrink-0 rounded border border-dashed flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 space-y-1">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                <ImageIcon className="w-3.5 h-3.5" />
                {value ? "Changer l'image" : "Choisir une image"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Galerie — Bucket Website</DialogTitle>
              </DialogHeader>

              <div className="flex items-center gap-2 mb-3">
                <Input
                  placeholder="Rechercher..."
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="flex-1 h-8 text-sm"
                />
                <label className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span className="gap-1.5">
                      {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                      Upload
                    </span>
                  </Button>
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              </div>

              {/* Folder tabs */}
              <div className="flex gap-1 mb-3 flex-wrap">
                <Button
                  variant={activeFolder === null ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setActiveFolder(null)}
                >
                  Tout ({files.length})
                </Button>
                {folders.map(folder => {
                  const count = files.filter(f => f.folder === folder).length;
                  const label = folder || "Racine";
                  return (
                    <Button
                      key={folder}
                      variant={activeFolder === folder ? "default" : "outline"}
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => setActiveFolder(folder)}
                    >
                      {label === "TOP PHOTOS" ? "⭐ TOP PHOTOS" : label} ({count})
                    </Button>
                  );
                })}
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 overflow-y-auto max-h-[55vh] pr-1">
                  {filtered.map(f => (
                    <button
                      key={f.fullPath}
                      onClick={() => { onChange(f.url); setOpen(false); }}
                      className={`relative aspect-square rounded overflow-hidden border-2 hover:border-primary transition-colors ${value === f.url ? "border-primary ring-2 ring-primary/30" : "border-transparent"}`}
                    >
                      <img
                        src={f.url}
                        alt={f.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {f.folder === "TOP PHOTOS" && (
                        <span className="absolute top-0.5 left-0.5 text-[8px] bg-primary text-primary-foreground px-1 rounded">⭐</span>
                      )}
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="col-span-full text-center text-sm text-muted-foreground py-8">Aucune image trouvée</p>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
          {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
        </div>
      </div>
    </div>
  );
};

export default ImagePicker;
