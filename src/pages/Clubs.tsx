
import { Card, CardContent } from "@/components/ui/card";
import { Code } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getClubs } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

type Rarity = "comum" | "rara" | "épica" | "lendária";

interface Club {
  id: string;
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

const collectedNFTs: string[] = [];

export function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClubs = async () => {
      setIsLoading(true);
      try {
        const data = await getClubs();
        const validClubs = data.clubs.filter((club: Club) => club.name);
        setClubs(validClubs);
      } catch (error) {
        console.error("Failed to fetch clubs", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubs();
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
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          clubs.map((club, index) => {
            const isCollected = collectedNFTs.includes(club.id);

            return (
              <Card
                key={club.id}
                className="glass-panel border-0 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/clubs/${club.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`bg-purple-200 p-4 rounded-xl`}>
                      <Code className={`h-8 w-8 text-purple-600`} />
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
          })
        )}
      </div>
    </div>
  )
}
