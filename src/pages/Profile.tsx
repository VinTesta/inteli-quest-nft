import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAccountData } from "@/lib/api";
import { Target, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

type Rarity = "comum" | "rara" | "épica" | "lendária";

interface Club {
  id: number;
  name: string;
  rarity: Rarity;
}

interface NFT {
  id: number;
  clubId: number;
}

const clubs: Club[] = [
  { id: 1, name: "Coletivo Feminino", rarity: "comum" },
  { id: 2, name: "Liga de IA", rarity: "rara" },
  { id: 3, name: "Inteli Blockchain", rarity: "épica" },
  { id: 4, name: "Inteli Ultimate Frisbee", rarity: "comum" },
  { id: 5, name: "Bateria", rarity: "rara" },
  { id: 6, name: "Clube de Música", rarity: "lendária" },
];

const collectedNFTs: NFT[] = [
  { id: 1, clubId: 1 },
  { id: 2, clubId: 4 },
  { id: 3, clubId: 5 },
];

const completedMissions = 1;

const progress = (collectedNFTs.length / clubs.length) * 100;

const rarityColors: Record<Rarity, string> = {
  comum: "bg-gray-400",
  rara: "bg-blue-400",
  épica: "bg-purple-500",
  lendária: "bg-yellow-500",
};

const getRarityCount = (rarity: Rarity) => {
  return collectedNFTs.filter(nft => {
    const club = clubs.find(c => c.id === nft.clubId);
    return club?.rarity === rarity;
  }).length;
};

export function Profile() {
  const [email, setEmail] = useState("");
  const [publicKey, setPublicKey] = useState("");

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const data = await getAccountData();
        const userData = data.find((item: any) => item.SortKey === "METADATA");
        const walletData = data.find((item: any) => item.SortKey === "WALLET");

        if (userData) {
          setEmail(userData.email);
        }
        if (walletData) {
          setPublicKey(walletData.publicKey);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchAccountData();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="glass-panel rounded-2xl p-6 text-center">
        <div className="bg-primary/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Users className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-sm font-bold">{email}</h2>
        <p className="text-xs text-foreground/70 mt-1">
          {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-6)}` : ""}
        </p>
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
                <span className="font-bold">{collectedNFTs.length}/20</span>
              </div>
              <div className="flex justify-between flex-col">
                <div className="flex justify-between mb-1">
                  <span className="text-foreground/70">Taxa de Conclusão</span>
                  <span className="font-bold">{Math.round(progress)}%</span>
                </div>
                <Progress value={23} className="h-2" />
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
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-0">
        <CardContent className="p-6">
          <h3 className="font-bold mb-4">Raridade da Coleção</h3>
          <div className="space-y-3">
            {Object.entries(rarityColors).map(([rarity, _]) => {
              const count = getRarityCount(rarity as Rarity);
              const total = clubs.filter(c => c.rarity === rarity).length;
              const percent = total > 0 ? (count / total) * 100 : 0;

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
    </div>
  )
}
