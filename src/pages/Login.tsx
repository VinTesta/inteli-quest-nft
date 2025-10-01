import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";

export function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState("email");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateCode = async () => {
    if (!email) {
      toast({ title: "Erro", description: "Por favor, insira seu email." });
      return;
    }
    setIsLoading(true);
    try {
      const response = await api("/account/generate-login-code", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        toast({ title: "Sucesso", description: "Código enviado para seu email." });
        setStep("code");
      } else {
        toast({ title: "Erro", description: "Falha ao gerar código. Tente novamente." });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro de rede." });
    }
    setIsLoading(false);
  };

  const handleLogin = async () => {
    if (!code) {
      toast({ title: "Erro", description: "Por favor, insira o código." });
      return;
    }
    setIsLoading(true);
    try {
      const response = await api("/account/login", {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("jwt", token);
        toast({ title: "Sucesso", description: "Login realizado com sucesso!" });
        navigate("/dashboard");
      } else {
        toast({ title: "Erro", description: "Código inválido. Tente novamente." });
      }
    } catch (error) {
      toast({ title: "Erro", description: "Ocorreu um erro de rede." });
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md glass-panel">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "email" ? (
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <Button onClick={handleGenerateCode} disabled={isLoading} className="w-full">
                {isLoading ? "Enviando..." : "Enviar Código"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isLoading}
              />
              <Button onClick={handleLogin} disabled={isLoading} className="w-full">
                {isLoading ? "Verificando..." : "Login"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
