import { Card, CardContent } from "@/components/ui/card";
import { Check, Code } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClubs, getAccountData, getUserNfts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

interface Club {
  clubId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  standard: string;
  collectionPubkey: string;
  authorityPubkey: string;
  createdAt: string;
  metadata: {
    name: string;
    description: string;
    image: string;
    symbol: string;
    attributes: {
      trait_type: string;
      value: string;
    }[];
  };
}

export function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [visitedClubs, setVisitedClubs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [clubsData, accountData] = await Promise.all([
          getClubs(),
          getAccountData(),
        ]);

        const validClubs = clubsData.filter((club: Club) => club.name);
        setClubs(validClubs);

        const walletData = accountData.find((item: any) => item.SK === "WALLET");
        const publicKey = walletData?.publicKey;

        if (publicKey) {
          const userNfts = await getUserNfts(publicKey);
          const visitedClubIds = new Set<string>(userNfts.items.map((nft: { clubId: string }) => nft.clubId));
          setVisitedClubs(visitedClubIds);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-2">Clubes do Inteli</h2>
        <p className="text-sm text-foreground/70">
          Conheça os clubes estudantis e suas especialidades
        </p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="glass-panel border-0">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-16 w-16 rounded-xl bg-gray-500/20" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-1/2 bg-gray-500/20" />
                    <Skeleton className="h-4 w-3/4 bg-gray-500/20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          clubs.map((club, index) => {
            const isVisited = visitedClubs.has(club.clubId);

            return (
              <Card
                key={club.clubId}
                className="glass-panel border-0 animate-fade-in transition-all hover:scale-[1.02] cursor-pointer"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/clubs/${club.clubId}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`bg-purple-200/10 p-3 rounded-xl flex-shrink-0`}>
                      <img src={club.imageUrl || '/placeholder.svg'} alt={club.name} className="h-10 w-10 object-cover rounded-md" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg">{club.name}</h3>
                          <p className="text-sm text-foreground/70 truncate">{club.description.slice(0, 23)}{club.description.length > 23 && "..."}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-4 text-sm text-foreground/70 mt-3">
                        <div>
                          <div className="flex items-center justify-between text-sm">
                             <span className={`font-medium ${isVisited ? "text-emerald-400" : "text-foreground/60"}`}>
                              {isVisited ? "Visitado" : "Não Visitado"}
                            </span>
                            {isVisited && <Check className="h-5 w-5 text-emerald-400" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  )
}