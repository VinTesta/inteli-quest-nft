import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import EarthAnimation from "@/components/EarthAnimation";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/20 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Earth Animation */}
        <div className="flex justify-center animate-float">
          <EarthAnimation className="drop-shadow-2xl" />
        </div>

        {/* Welcome Text */}
        <div className="glass-strong rounded-3xl p-8 text-center space-y-6">
          <h1 className="text-3xl font-bold leading-tight">
            BEM-VINDO(A),<br />
            FUTURO(A) AGENTE<br />
            DE TRANSFORMAÇÃO!
          </h1>
          
          <p className="text-sm leading-relaxed text-foreground/80">
            O Inteli não é apenas uma faculdade.<br />
            É o ponto de partida de uma<br />
            revolução.
          </p>

          {/* CTA Button */}
          <Button
            onClick={() => navigate("/briefing")}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90 text-foreground font-semibold rounded-full transition-all hover:scale-105 hover:shadow-lg"
          >
            INICIAR
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
