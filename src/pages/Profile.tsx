import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getAccountData, getNfts, getUserNfts, getMissions } from "@/lib/api";
import { Target, Users, Wallet, Copy, Check, Trophy, ListChecks } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Interfaces based on expected API responses
interface Nft {
  PK: string;
  SK: string;
  GSI2PK: string;
  GSI2SK: string;
  title: string;
  description: string;
  imageUrl: string;
  missionId: string;
  rarity: Rarity;
}

interface UserNft {
  clubId: string;
  nftId: string;
}

interface Mission {
  PK: string; // Mission ID
  SK: string;
  title: string;
  description: string;
  nfts: Nft[];
}

type Rarity = "common" | "rare" | "epic" | "legendary";

const rarityColors: Record<Rarity, string> = {
  common: "bg-gray-400",
  rare: "bg-blue-400",
  epic: "bg-purple-500",
  legendary: "bg-yellow-500",
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copyToClipboard} className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
      {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
    </button>
  );
};

export function Profile() {
  const navigate = useNavigate();
  const [account, setAccount] = useState<{ email: string; publicKey: string } | null>(null);
  const [allNfts, setAllNfts] = useState<Nft[]>([]);
  const [userNfts, setUserNfts] = useState<UserNft[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const accountData = await getAccountData();
        const walletData = accountData.find((item: any) => item.SK === "WALLET");
        const userData = accountData.find((item: any) => item.SK === "METADATA");
        const publicKey = walletData?.publicKey;

        if (!publicKey || !userData) throw new Error("Não foi possível carregar os dados da conta.");

        setAccount({ email: userData.email, publicKey });

        const [allNftsData, userNftsData, missionsData] = await Promise.all([
          getNfts(),
          getUserNfts(publicKey),
          getMissions(),
        ]);

        setAllNfts(allNftsData);
        setUserNfts(userNftsData.items);
        setMissions(missionsData.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/");
  };

  // Derived state for statistics
  const collectedNftCount = userNfts.length;
  const totalNftCount = allNfts.length;
  const completionPercentage = totalNftCount > 0 ? (collectedNftCount / totalNftCount) * 100 : 0;
  const visitedClubsCount = new Set(userNfts.map(nft => nft.clubId)).size;
  const userNftIds = new Set(userNfts.map(nft => nft.nftId));

  const completedMissionsCount = missions.filter(mission =>
    mission.nfts.every(nft => userNftIds.has(nft.GSI2SK.split('#')[1]))
  ).length;

  const rarityStats = allNfts.reduce((acc, nft) => {
    acc[nft.rarity] = acc[nft.rarity] || { total: 0, collected: 0 };
    acc[nft.rarity].total++;
    if (userNftIds.has(nft.GSI2SK.split('#')[1])) {
      acc[nft.rarity].collected++;
    }
    return acc;
  }, {} as Record<Rarity, { total: number; collected: number }>);

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6 animate-pulse">
        <Skeleton className="h-40 w-full rounded-2xl bg-gray-500/20" />
        <Skeleton className="h-10 w-full rounded-lg bg-gray-500/20" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-40 w-full rounded-2xl bg-gray-500/20" />
          <Skeleton className="h-40 w-full rounded-2xl bg-gray-500/20" />
        </div>
        <Skeleton className="h-60 w-full rounded-2xl bg-gray-500/20" />
        <Skeleton className="h-60 w-full rounded-2xl bg-gray-500/20" />
      </div>
    );
  }
  
  if (error) {
    return <div className="text-destructive text-center p-8">{error}</div>
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="glass-panel rounded-2xl p-6 text-center">
        <div className="bg-primary/20 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
          <Users className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-lg font-bold">{account?.email}</h2>
        <div className="flex items-center justify-center text-xs text-foreground/70 mt-1 font-mono">
          <a href={`https://solscan.io/account/${account?.publicKey}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            {account?.publicKey ? `${account.publicKey.slice(0, 6)}...${account.publicKey.slice(-6)}` : ""}
          </a>
          {account?.publicKey && <CopyButton text={account.publicKey} />}
        </div>
      </div>

      <Button onClick={handleLogout} variant="destructive" className="w-full">Logout</Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="glass-panel border-0">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-6 w-6 text-primary" />
              <h3 className="font-bold">Progresso</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-foreground/70">NFTs Coletados</span>
                <span className="font-bold">{collectedNftCount}/{totalNftCount}</span>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-foreground/70">Taxa de Conclusão</span>
                  <span className="font-bold">{Math.round(completionPercentage)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Clubes Visitados</span>
                <span className="font-bold">{visitedClubsCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-panel border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-6 w-6 text-primary" />
            <h3 className="font-bold">Raridade da Coleção</h3>
          </div>
          <div className="space-y-3">
            {(Object.keys(rarityStats) as Rarity[]).map(rarity => {
              const { collected, total } = rarityStats[rarity];
              const percent = total > 0 ? (collected / total) * 100 : 0;
              return (
                <div key={rarity}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium">{rarity}</span>
                    <span className="font-bold">{collected}/{total}</span>
                  </div>
                  <Progress value={percent} className={`h-2 [&>*]:bg-[${rarityColors[rarity]}]`} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}