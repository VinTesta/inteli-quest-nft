import { FC } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Rarity = "common" | "rare" | "epic" | "legendary";

const rarityColors: Record<Rarity, string> = {
  common: "bg-gray-300 text-foreground",
  rare: "bg-blue-400 text-blue-900",
  epic: "bg-indigo-400 text-indigo-900",
  legendary: "bg-amber-400 text-amber-900",
};

interface Nft {
  id: string;
  name: string;
  clubId: string;
  imageUrl: string;
  rarity: Rarity;
  collected: boolean;
}

const ClubDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const clubData = {
    name: "Clube de Tecnologia",
    description: "Um clube para entusiastas da tecnologia e inovação.",
    imageUrl: "https://i.imgur.com/3Z3bJ1f.png",
  };

  const userNfts: Nft[] = [
    { id: "1", name: "NFT 1", clubId: "1", imageUrl: "https://i.imgur.com/3Z3bJ1f.png", rarity: "common", collected: true },
    { id: "2", name: "NFT 2", clubId: "2", imageUrl: "https://i.imgur.com/3Z3bJ1f.png", rarity: "rare", collected: true },
    { id: "3", name: "NFT 3", clubId: "1", imageUrl: "https://i.imgur.com/3Z3bJ1f.png", rarity: "epic", collected: false },
  ];

  const clubNfts = userNfts.filter((nft) => nft.clubId === id);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="glass-panel border-0 w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="bg-gray-200 p-4 rounded-xl mx-auto w-fit mb-4">
            <img src={clubData.imageUrl} alt={clubData.name} className="h-32 w-32 rounded-lg" />
          </div>
          <CardTitle className="text-3xl font-bold">{clubData.name}</CardTitle>
          <CardDescription>{clubData.description}</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="glass-panel rounded-xl p-4">
            <h2 className="text-xl font-bold mb-4">NFTs do Clube</h2>
            {clubNfts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {clubNfts.map((nft) => (
                  <Card
                    key={nft.id}
                    className={`glass-panel border-0 transition-all ${nft.collected ? 'hover:scale-105' : 'opacity-60'}`}
                    onClick={() => nft.collected && navigate(`/nfts/${nft.id}`)}
                  >
                    <CardContent className="p-6 text-center space-y-3">
                      <div className={'bg-gray-200 p-4 rounded-xl mx-auto w-fit'}>
                        {nft.collected ? (
                          <img src={nft.imageUrl} alt={nft.name} className="h-8 w-8" />
                        ) : (
                          <div className="h-8 w-8 flex items-center justify-center text-2xl">?</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold">{nft.collected ? nft.name : "???"}</p>
                        <Badge className={`${rarityColors[nft.rarity]} mt-2`}>
                          {nft.collected ? nft.rarity : "???"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>Você ainda não coletou NFTs deste clube.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubDetail;