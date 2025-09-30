import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Target, Users, Zap, Heart, Code, Palette, Trophy } from "lucide-react";

// Mock data for clubs/NFTs
const clubs = [
  {
    id: 1,
    name: "Tech Innovators",
    icon: Code,
    color: "text-primary",
    bgColor: "bg-primary/10",
    collected: false,
    description: "Desenvolvimento e inovação tecnológica",
  },
  {
    id: 2,
    name: "Design Thinking",
    icon: Palette,
    color: "text-accent",
    bgColor: "bg-accent/10",
    collected: false,
    description: "Criatividade e design centrado no usuário",
  },
  {
    id: 3,
    name: "Social Impact",
    icon: Heart,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    collected: false,
    description: "Impacto social e sustentabilidade",
  },
  {
    id: 4,
    name: "Leadership Squad",
    icon: Users,
    color: "text-muted",
    bgColor: "bg-muted/10",
    collected: false,
    description: "Liderança e gestão de equipes",
  },
  {
    id: 5,
    name: "Energy Hackers",
    icon: Zap,
    color: "text-primary",
    bgColor: "bg-primary/10",
    collected: false,
    description: "Energia sustentável e IoT",
  },
];

const Dashboard = () => {
  const [collectedNFTs, setCollectedNFTs] = useState<number[]>([]);

  const progress = (collectedNFTs.length / clubs.length) * 100;

  const handleCollect = (clubId: number) => {
    if (!collectedNFTs.includes(clubId)) {
      setCollectedNFTs([...collectedNFTs, clubId]);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="glass-strong rounded-3xl p-6 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Esquadrão de Impacto</h1>
            <p className="text-sm text-foreground/70 mt-1">
              Colete NFTs dos clubes para completar sua missão
            </p>
          </div>
          <div className="bg-primary/20 p-3 rounded-full">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progresso da Missão</span>
            <span className="font-bold">{collectedNFTs.length}/{clubs.length}</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </div>

      {/* Mission Status */}
      <div className="glass-panel rounded-2xl p-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">Missão Atual</h2>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          Visite os stands dos clubes estudantis e colete suas NFTs de Conhecimento.
          Cada clube representa uma habilidade essencial para transformar o mundo através da tecnologia!
        </p>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clubs.map((club, index) => {
          const isCollected = collectedNFTs.includes(club.id);
          const Icon = club.icon;

          return (
            <Card
              key={club.id}
              className="glass-panel border-0 transition-all hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${club.bgColor} p-3 rounded-xl`}>
                      <Icon className={`h-6 w-6 ${club.color}`} />
                    </div>
                    <CardTitle className="text-lg">{club.name}</CardTitle>
                  </div>
                  {isCollected && (
                    <Badge className="bg-secondary text-foreground">
                      Coletado
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground/70">{club.description}</p>
                <Button
                  onClick={() => handleCollect(club.id)}
                  disabled={isCollected}
                  className={`w-full rounded-full ${
                    isCollected
                      ? "bg-secondary/50"
                      : "bg-primary hover:bg-primary/90"
                  } text-foreground transition-all`}
                >
                  {isCollected ? "✓ NFT Coletado" : "Coletar NFT"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Message */}
      {collectedNFTs.length === clubs.length && (
        <div className="glass-strong rounded-3xl p-8 text-center space-y-4 animate-fade-in animate-glow">
          <div className="flex justify-center">
            <div className="bg-secondary/20 p-4 rounded-full">
              <Trophy className="h-12 w-12 text-secondary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Missão Completa!</h2>
          <p className="text-foreground/80">
            Parabéns, Agente! Você montou seu Esquadrão de Impacto completo.
            Agora você está pronto para transformar o mundo com tecnologia! 🚀
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
