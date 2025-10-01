import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, BrainCircuit, Code, Disc, Music } from "lucide-react";

type Rarity = "comum" | "rara" | "épica" | "lendária";

interface Club {
  id: number;
  name: string;
  rarity: Rarity;
  icon: React.ElementType;
  bgColor: string;
  color: string;
}

const clubs: Club[] = [
  { id: 1, name: "Coletivo Feminino", rarity: "comum", icon: Users, bgColor: "bg-pink-200", color: "text-pink-600" },
  { id: 2, name: "Liga de IA", rarity: "rara", icon: BrainCircuit, bgColor: "bg-blue-200", color: "text-blue-600" },
  { id: 3, name: "Inteli Blockchain", rarity: "épica", icon: Code, bgColor: "bg-purple-200", color: "text-purple-600" },
  { id: 4, name: "Inteli Ultimate Frisbee", rarity: "comum", icon: Disc, bgColor: "bg-green-200", color: "text-green-600" },
  { id: 5, name: "Bateria", rarity: "rara", icon: Music, bgColor: "bg-yellow-200", color: "text-yellow-600" },
  { id: 6, name: "Clube de Música", rarity: "lendária", icon: Music, bgColor: "bg-red-200", color: "text-red-600" },
];

const collectedNFTs: number[] = [1, 4, 5];

const rarityColors: Record<Rarity, string> = {
  comum: "bg-muted text-foreground",
  rara: "bg-primary/20 text-primary",
  épica: "bg-accent/20 text-accent",
  lendária: "bg-secondary/20 text-secondary",
};

const getRarityCount = (rarity: Rarity) => {
  return clubs.filter(c => c.rarity === rarity && collectedNFTs.includes(c.id)).length;
};

export function Collection() {
  return (
    <div className="container mx-auto p-4 space-y-6">
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
    </div>
  )
}
