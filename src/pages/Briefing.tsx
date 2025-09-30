import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ear, Earth, Sparkles } from "lucide-react";

const Briefing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-20 w-32 h-32 rounded-full bg-secondary/20 blur-3xl animate-float" />
      <div className="absolute bottom-32 left-20 w-40 h-40 rounded-full bg-muted/20 blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Mission Text Panel */}
        <div className="glass-strong rounded-3xl p-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="bg-primary/20 p-3 rounded-full animate-glow">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold leading-tight">
            Você foi selecionado(a)<br />
            como um(a) Agente-Inteli<br />
            em treinamento!
          </h1>
          
          <p className="text-sm leading-relaxed text-foreground/80">
            Para começar, você precisa<br />
            montar o seu Esquadrão de<br />
            Impacto. Cada clube<br />
            estudantil possui uma NFT de<br />
            Conhecimento vital para o<br />
            progresso.
          </p>
        </div>

        {/* Earth Animation */}
        <div className="flex justify-center animate-float">
          <Earth />
        </div>

        {/* CTA Button */}
        <div className="glass-strong rounded-3xl p-6">
          <Button
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="w-full bg-secondary hover:bg-secondary/90 text-foreground font-semibold rounded-full transition-all hover:scale-105 hover:shadow-lg"
          >
            COMEÇAR MISSÃO
            <Sparkles className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Briefing;
