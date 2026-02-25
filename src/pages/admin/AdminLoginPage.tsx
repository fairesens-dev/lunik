import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setError(result.error || "Erreur inconnue");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);
    if (result.success) {
      setResetSent(true);
    } else {
      setError(result.error || "Erreur inconnue");
    }
  };

  if (resetMode) {
    return (
      <div className="min-h-screen bg-[hsl(var(--muted))] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm">
          <div className="bg-background rounded-lg shadow-sm border border-border p-8">
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold text-foreground">Réinitialiser le mot de passe</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {resetSent ? "Email envoyé !" : "Entrez votre email pour recevoir un lien de réinitialisation"}
              </p>
            </div>

            <div className="border-t border-border mb-6" />

            {resetSent ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded font-sans">
                  Un email de réinitialisation a été envoyé à <strong>{email}</strong>. Vérifiez votre boîte de réception.
                </div>
                <Button variant="outline" className="w-full" onClick={() => { setResetMode(false); setResetSent(false); }}>
                  Retour à la connexion
                </Button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm text-muted-foreground font-sans">Adresse email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@monstore.fr"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-3 py-2 rounded font-sans">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Envoyer le lien
                </Button>

                <button
                  type="button"
                  onClick={() => { setResetMode(false); setError(""); }}
                  className="w-full text-sm text-muted-foreground hover:text-foreground text-center"
                >
                  Retour à la connexion
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--muted))] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="bg-background rounded-lg shadow-sm border border-border p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-foreground">[BRAND] Admin</h1>
            <p className="text-sm text-muted-foreground mt-1">Espace de gestion</p>
          </div>

          <div className="border-t border-border mb-6" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-muted-foreground font-sans">Adresse email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@monstore.fr"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm text-muted-foreground font-sans">Mot de passe</Label>
                <button
                  type="button"
                  onClick={() => { setResetMode(true); setError(""); }}
                  className="text-xs text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-3 py-2 rounded font-sans">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Connexion
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground font-sans"
          >
            <ArrowLeft className="w-3 h-3" />
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
