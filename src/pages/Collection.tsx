import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNfts } from "@/lib/api";

type Rarity = "common" | "rare" | "epic" | "legendary";

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
  symbol: string;
  createdAt: string;
  metadataUri: string;
  collected: boolean;
}

const rarityColors: Record<Rarity, string> = {
  common: "bg-gray-300 text-foreground",
  rare: "bg-blue-400 text-blue-900",
  epic: "bg-indigo-400 text-indigo-900",
  legendary: "bg-amber-400 text-amber-900",
};

export function Collection() {
  const [nfts, setNfts] = useState<Nft[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        let data = await getNfts();
        data = data.map((nft: Nft) => ({
          ...nft,
          collected: true
        }));
        setNfts(data);
      } catch (error) {
        console.error("Failed to fetch nfts:", error);
      }
    };

    fetchNfts();
  }, []);

  const getRarityCount = (rarity: Rarity) => {
    return nfts.filter(n => n.rarity === rarity).length;
  };

  const getCollectedRarityCount = (rarity: Rarity) => {
    return nfts.filter(n => n.rarity === rarity && n.collected).length;
  };

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
                {getCollectedRarityCount(rarity as Rarity)}/{getRarityCount(rarity as Rarity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {nfts.map((nft) => {
          return (
            <Card
              key={nft.PK}
              className={`glass-panel border-0 transition-all ${nft.collected ? 'hover:scale-105' : 'opacity-60'}`}
              onClick={() => nft.collected && navigate(`/nfts/${nft.PK}`)}
            >
              <CardContent className="p-6 text-center space-y-3">
                <div className={'bg-gray-200 p-4 rounded-xl mx-auto w-fit'}>
                  {nft.collected ? (
                    <img src={nft.imageUrl} alt={nft.title} className="h-8 w-8" />
                  ) : (
                    <div className="h-8 w-8 flex items-center justify-center text-2xl">?</div>
                  )}
                </div>
                <div>
                  <p className="font-bold">{nft.collected ? nft.title : "???"}</p>
                  <Badge className={`${rarityColors[nft.rarity]} mt-2`}>
                    {nft.collected ? nft.rarity : "???"}
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
