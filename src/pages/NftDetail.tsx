import { FC } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Rarity = "common" | "rare" | "epic" | "legendary";

const rarityColors: Record<Rarity, string> = {
  common: "bg-gray-300 text-foreground",
  rare: "bg-blue-400 text-blue-900",
  epic: "bg-indigo-400 text-indigo-900",
  legendary: "bg-amber-400 text-amber-900",
};

const NftDetail: FC = () => {
  const { id } = useParams<{ id: string }>();

  const nftData = {
    key: "0x1234567890abcdef",
    acquisitionDate: "2024-05-10T14:30:00Z",
    transactionHash: "0xabcdef1234567890",
    title: "NFT Fantástico",
    description: "Esta é uma descrição incrível para um NFT mais incrível ainda.",
    imageUrl: "https://i.imgur.com/3Z3bJ1f.png",
    rarity: "legendary" as Rarity,
  };

  return (
    <div className="container mx-auto p-4 space-y-6 h-screen flex items-center justify-center">
      <Card className="glass-panel border-0 w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">{nftData.title}</CardTitle>
          <CardDescription>{nftData.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="bg-gray-200 p-4 rounded-xl mx-auto w-fit">
            <img src={nftData.imageUrl} alt={nftData.title} className="h-64 w-64 rounded-lg" />
          </div>
          <div className="text-center">
            <Badge className={`${rarityColors[nftData.rarity]} mt-2`}>
              {nftData.rarity}
            </Badge>
          </div>
          <div className="glass-panel rounded-xl p-4 space-y-2">
            <p><strong>ID da NFT:</strong> {id}</p>
            <p><strong>Chave:</strong> {nftData.key}</p>
            <p><strong>Data de Aquisição:</strong> {new Date(nftData.acquisitionDate).toLocaleString()}</p>
            <p><strong>Hash da Transação:</strong> {nftData.transactionHash}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NftDetail;