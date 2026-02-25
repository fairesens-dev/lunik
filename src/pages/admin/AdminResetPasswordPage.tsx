import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the hash fragment
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });

    // Also check the URL hash for type=recovery (Supabase redirects with hash params)
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => navigate("/admin/login"), 3000);
    }
  };

  if (!isRecovery && !success) {
    return (
      <div className="min-h-screen bg-[hsl(var(--muted))] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm text-center space-y-4">
          <p className="text-muted-foreground">Lien invalide ou expiré.</p>
          <Link to="/admin/login">
            <Button variant="outline">Retour à la connexion</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--muted))] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="bg-background rounded-lg shadow-sm border border-border p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-foreground">Nouveau mot de passe</h1>
            <p className="text-sm text-muted-foreground mt-1">Choisissez votre nouveau mot de passe</p>
          </div>

          <div className="border-t border-border mb-6" />

          {success ? (
            <div className="space-y-4 text-center">
              <CheckCircle className="h-10 w-10 text-green-600 mx-auto" />
              <p className="text-sm text-foreground font-medium">Mot de passe mis à jour avec succès !</p>
              <p className="text-xs text-muted-foreground">Redirection vers la page de connexion...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
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
                {password.length > 0 && password.length < 8 && (
                  <p className="text-xs text-destructive">Minimum 8 caractères</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Confirmer le mot de passe</Label>
                <Input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                {confirm.length > 0 && confirm !== password && (
                  <p className="text-xs text-destructive">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm px-3 py-2 rounded">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Mettre à jour le mot de passe
              </Button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-3 h-3" />
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminResetPasswordPage;
