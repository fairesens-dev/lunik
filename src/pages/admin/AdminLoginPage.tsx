import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = login(email, password);
    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setError(result.error || "Erreur inconnue");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900">[BRAND] Admin</h1>
            <p className="text-sm text-gray-500 mt-1">Espace de gestion</p>
          </div>

          <div className="border-t border-gray-200 mb-6" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-700 font-sans">Adresse email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@monstore.fr"
                required
                className="font-sans"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm text-gray-700 font-sans">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded font-sans">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-gray-900 text-white hover:bg-gray-700 font-sans"
            >
              Connexion
            </Button>
          </form>
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 font-sans"
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
