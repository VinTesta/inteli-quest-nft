import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Users, Zap, Heart, Code, Palette, Trophy, Wallet, Sparkles, Home } from "lucide-react";

type Rarity = "comum" | "rara" | "épica" | "lendária";

interface Club {
  id: number;
  name: string;
  icon: typeof Code;
  color: string;
  bgColor: string;
  collected: boolean;
  description: string;
  rarity: Rarity;
  members: number;
  founded: string;
}

// Mock data for clubs/NFTs
const clubs: Club[] = [
  {
    id: 1,
    name: "Tech Innovators",
    icon: Code,
    color: "text-primary",
    bgColor: "bg-primary/10",
    collected: false,
    description: "Desenvolvimento e inovação tecnológica",
    rarity: "comum",
    members: 45,
    founded: "2020",
  },
  {
    id: 2,
    name: "Design Thinking",
    icon: Palette,
    color: "text-accent",
    bgColor: "bg-accent/10",
    collected: false,
    description: "Criatividade e design centrado no usuário",
    rarity: "rara",
    members: 32,
    founded: "2021",
  },
  {
    id: 3,
    name: "Social Impact",
    icon: Heart,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    collected: false,
    description: "Impacto social e sustentabilidade",
    rarity: "épica",
    members: 28,
    founded: "2019",
  },
  {
    id: 4,
    name: "Leadership Squad",
    icon: Users,
    color: "text-muted",
    bgColor: "bg-muted/10",
    collected: false,
    description: "Liderança e gestão de equipes",
    rarity: "comum",
    members: 38,
    founded: "2020",
  },
  {
    id: 5,
    name: "Energy Hackers",
    icon: Zap,
    color: "text-primary",
    bgColor: "bg-primary/10",
    collected: false,
    description: "Energia sustentável e IoT",
    rarity: "lendária",
    members: 25,
    founded: "2022",
  },
];

const rarityColors: Record<Rarity, string> = {
  comum: "bg-muted text-foreground",
  rara: "bg-primary/20 text-primary",
  épica: "bg-accent/20 text-accent",
  lendária: "bg-secondary/20 text-secondary",
};

const Dashboard = () => {
  const [collectedNFTs, setCollectedNFTs] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("missoes");

  const progress = (collectedNFTs.length / clubs.length) * 100;

  const handleCollect = (clubId: number) => {
    if (!collectedNFTs.includes(clubId)) {
      setCollectedNFTs([...collectedNFTs, clubId]);
    }
  };

  const getRarityCount = (rarity: Rarity) => {
    return clubs.filter(c => c.rarity === rarity && collectedNFTs.includes(c.id)).length;
  };

  const completedMissions = Math.floor(collectedNFTs.length / 2);

  return (
    <div className="min-h-screen pb-20">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Header */}
        <div className="glass-strong rounded-b-3xl p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Agente Inteli</h1>
              <p className="text-sm text-foreground/70 mt-1">
                Missão: Mudar o mundo com tecnologia
              </p>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-6">
          {/* Missões Tab */}
          <TabsContent value="missoes" className="mt-0 space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Missão Atual</h2>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                Visite os stands dos clubes estudantis e colete suas NFTs de Conhecimento.
                Cada clube representa uma habilidade essencial para transformar o mundo!
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progresso</span>
                  <span className="font-bold">{collectedNFTs.length}/{clubs.length}</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clubs.map((club, index) => {
                const isCollected = collectedNFTs.includes(club.id);
                const Icon = club.icon;

                return (
                  <Card
                    key={club.id}
                    className="glass-panel border-0 transition-all hover:scale-105 animate-fade-in"
                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
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
                          <Badge className="bg-secondary text-foreground">✓</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-foreground/70">{club.description}</p>
                      <Button
                        onClick={() => handleCollect(club.id)}
                        disabled={isCollected}
                        className="w-full rounded-full"
                        variant={isCollected ? "secondary" : "default"}
                      >
                        {isCollected ? "✓ NFT Coletado" : "Coletar NFT"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {collectedNFTs.length === clubs.length && (
              <div className="glass-strong rounded-3xl p-8 text-center space-y-4 animate-fade-in animate-glow">
                <div className="flex justify-center">
                  <div className="bg-secondary/20 p-4 rounded-full">
                    <Trophy className="h-12 w-12 text-secondary" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold">Missão Completa!</h2>
                <p className="text-foreground/80">
                  Parabéns! Você completou sua missão e está pronto para mudar o mundo! 🚀
                </p>
              </div>
            )}
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="mt-0 space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Coleção de NFTs
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(rarityColors).map(([rarity, color]) => (
                  <div key={rarity} className="glass-panel rounded-xl p-4 text-center">
                    <div className={`${color} rounded-lg p-2 mb-2 font-bold capitalize`}>
                      {rarity}
                    </div>
                    <div className="text-2xl font-bold">
                      {getRarityCount(rarity as Rarity)}/{clubs.filter(c => c.rarity === rarity).length}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {clubs.map((club) => {
                const isCollected = collectedNFTs.includes(club.id);
                const Icon = club.icon;

                return (
                  <Card
                    key={club.id}
                    className={`glass-panel border-0 transition-all ${isCollected ? 'hover:scale-105' : 'opacity-60'}`}
                  >
                    <CardContent className="p-6 text-center space-y-3">
                      <div className={`${club.bgColor} p-4 rounded-xl mx-auto w-fit`}>
                        {isCollected ? (
                          <Icon className={`h-8 w-8 ${club.color}`} />
                        ) : (
                          <div className="h-8 w-8 flex items-center justify-center text-2xl">?</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold">{isCollected ? club.name : "???"}</p>
                        <Badge className={`${rarityColors[club.rarity]} mt-2`}>
                          {isCollected ? club.rarity : "???"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Clubes Tab */}
          <TabsContent value="clubes" className="mt-0 space-y-6">
            <div className="glass-panel rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-2">Clubes do Inteli</h2>
              <p className="text-sm text-foreground/70">
                Conheça os clubes estudantis e suas especialidades
              </p>
            </div>

            <div className="space-y-4">
              {clubs.map((club, index) => {
                const Icon = club.icon;
                const isCollected = collectedNFTs.includes(club.id);

                return (
                  <Card
                    key={club.id}
                    className="glass-panel border-0 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`${club.bgColor} p-4 rounded-xl`}>
                          <Icon className={`h-8 w-8 ${club.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-bold text-lg">{club.name}</h3>
                              <p className="text-sm text-foreground/70">{club.description}</p>
                            </div>
                            {isCollected && (
                              <Badge className="bg-secondary text-foreground">NFT Coletado</Badge>
                            )}
                          </div>
                          <div className="flex gap-4 text-sm text-foreground/70 mt-3">
                            <span>👥 {club.members} membros</span>
                            <span>📅 Fundado em {club.founded}</span>
                            <Badge className={rarityColors[club.rarity]}>{club.rarity}</Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Perfil Tab */}
          <TabsContent value="perfil" className="mt-0 space-y-6">
            <div className="glass-panel rounded-2xl p-6 text-center">
              <div className="bg-primary/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Agente #{Math.floor(Math.random() * 9999)}</h2>
              <p className="text-sm text-foreground/70 mt-1">Missão: Transformar o Mundo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass-panel border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Wallet className="h-6 w-6 text-primary" />
                    <h3 className="font-bold">Carteira Digital</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">NFTs Coletados</span>
                      <span className="font-bold">{collectedNFTs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Total de NFTs</span>
                      <span className="font-bold">{clubs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Taxa de Conclusão</span>
                      <span className="font-bold">{Math.round(progress)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-0">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="h-6 w-6 text-primary" />
                    <h3 className="font-bold">Estatísticas</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Missões Completas</span>
                      <span className="font-bold">{completedMissions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Clubes Visitados</span>
                      <span className="font-bold">{collectedNFTs.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/70">Pontos de Impacto</span>
                      <span className="font-bold">{collectedNFTs.length * 100}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass-panel border-0">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Raridade da Coleção</h3>
                <div className="space-y-3">
                  {Object.entries(rarityColors).map(([rarity, color]) => {
                    const count = getRarityCount(rarity as Rarity);
                    const total = clubs.filter(c => c.rarity === rarity).length;
                    const percent = (count / total) * 100;
                    
                    return (
                      <div key={rarity}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize font-medium">{rarity}</span>
                          <span className="font-bold">{count}/{total}</span>
                        </div>
                        <Progress value={percent} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border/50">
          <TabsList className="w-full h-16 bg-transparent grid grid-cols-4 rounded-none p-0">
            <TabsTrigger
              value="missoes"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 rounded-none"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Missões</span>
            </TabsTrigger>
            <TabsTrigger
              value="nfts"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 rounded-none"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-xs">NFTs</span>
            </TabsTrigger>
            <TabsTrigger
              value="clubes"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 rounded-none"
            >
              <Users className="h-5 w-5" />
              <span className="text-xs">Clubes</span>
            </TabsTrigger>
            <TabsTrigger
              value="perfil"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 rounded-none"
            >
              <Wallet className="h-5 w-5" />
              <span className="text-xs">Perfil</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};

export default Dashboard;
