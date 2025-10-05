import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccountData, getNfts, getUserNfts } from "@/lib/api";

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
  completed: boolean;
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
        const accountData = await getAccountData();
        const walletData = accountData.find((item) => item.SK === "WALLET");
        const publicKey = walletData?.publicKey;

        const allNfts = await getNfts();

        if (publicKey) {
          const userNftsResponse = await getUserNfts(publicKey);
          const userNftIds = userNftsResponse.items.map((nft: { nftId: string }) => nft.nftId);

          const updatedNfts = allNfts.map((nft: Nft) => ({
            ...nft,
            completed: userNftIds.includes(nft.GSI2SK.split("#")[1]),
          }));

          setNfts(updatedNfts);
        } else {
          setNfts(allNfts.map((nft: Nft) => ({ ...nft, completed: false })));
        }
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
    return nfts.filter(n => n.rarity === rarity && n.completed).length;
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
              <div className="text-2d font-bold">
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
              className={`glass-panel border-0 transition-all overflow-hidden ${nft.completed ? 'hover:scale-105' : 'opacity-60'}`}
              onClick={() => nft.completed && navigate(`/nfts/${nft.PK.split("#")[1]}`)}
            >
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-200 dark:bg-gray-800">
                  {nft.completed ? (
                    <img src={nft.imageUrl} alt={nft.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-500">?</div>
                  )}
                </div>
                <div className="p-4 text-center">
                  <p className="font-bold truncate">{nft.completed ? nft.title : "???"}</p>
                  {nft.completed && (
                    <Badge className={`${rarityColors[nft.rarity]} mt-2`}>
                      {nft.rarity}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  )
}
