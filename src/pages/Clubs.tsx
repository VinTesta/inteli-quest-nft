import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BrainCircuit, Code, Disc, Music } from "lucide-react";
import { Progress } from "@radix-ui/react-progress";

type Rarity = "comum" | "rara" | "épica" | "lendária";

interface Club {
  id: number;
  name: string;
  description: string;
  members: number;
  founded: number;
  rarity: Rarity;
  icon: React.ElementType;
  bgColor: string;
  color: string;
}

const clubs: Club[] = [
  { id: 1, name: "Coletivo Feminino", description: "Empoderando mulheres na tecnologia.", members: 50, founded: 2022, rarity: "comum", icon: Users, bgColor: "bg-pink-200", color: "text-pink-600" },
  { id: 2, name: "Liga de IA", description: "Explorando o futuro da Inteligência Artificial.", members: 35, founded: 2023, rarity: "rara", icon: BrainCircuit, bgColor: "bg-blue-200", color: "text-blue-600" },
  { id: 3, name: "Inteli Blockchain", description: "Descentralizando o futuro, um bloco de cada vez.", members: 40, founded: 2022, rarity: "épica", icon: Code, bgColor: "bg-purple-200", color: "text-purple-600" },
  { id: 4, name: "Inteli Ultimate Frisbee", description: "O esporte que mais cresce no Inteli.", members: 25, founded: 2021, rarity: "comum", icon: Disc, bgColor: "bg-green-200", color: "text-green-600" },
  { id: 5, name: "Bateria", description: "O som que agita o Inteli.", members: 30, founded: 2021, rarity: "rara", icon: Music, bgColor: "bg-yellow-200", color: "text-yellow-600" },
  { id: 6, name: "Clube de Música", description: "Harmonizando a vida no Inteli.", members: 20, founded: 2023, rarity: "lendária", icon: Music, bgColor: "bg-red-200", color: "text-red-600" },
];

const collectedNFTs: number[] = [1, 4, 5];

const rarityColors: Record<Rarity, string> = {
  comum: "bg-muted text-foreground",
  rara: "bg-primary/20 text-primary",
  épica: "bg-accent/20 text-accent",
  lendária: "bg-secondary/20 text-secondary",
};

export function Clubs() {
  return (
    <div className="container mx-auto p-4 space-y-6">
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
                    </div>
                    <div className="flex flex-col gap-4 text-sm text-foreground/70 mt-3">
                      <div>
                        <div className="flex items-center justify-between text-sm">
                          <span className={`font-medium ${isCollected && "line-through text-emerald-700"}`}>Visitado</span>
                          <span className={`font-bold ${isCollected && 'text-green-400'}`}>{isCollected ? 1 : 0}/1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  )
}
