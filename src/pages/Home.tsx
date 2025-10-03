import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Check, Lock, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getMissions } from "@/lib/api";

interface Nft {
  GSI2PK: string;
  imageUrl: string;
  symbol: string;
  rarity: string;
  metadataUri: string;
  createdAt: string;
  SK: string;
  missionId: string;
  description: string;
  PK: string;
  GSI2SK: string;
  title: string;
}

interface Mission {
  createdAt: string;
  SK: string;
  missionId: string;
  order: number;
  description: string;
  PK: string;
  title: string;
  nfts: Nft[];
}

interface ApiResponse {
  ok: boolean;
  missions: Mission[];
}

export function HomePage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currMissionDetails, setCurrMissionDetails] = useState<boolean>(false);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const response: ApiResponse = await getMissions();
        setMissions(response.missions);
      } catch (error) {
        console.error("Failed to fetch missions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const currentMission = missions.length > 0 ? missions[0] : undefined;
  const completedTasks = 0; // Mocked as per requirement
  const totalTasks = currentMission?.nfts.length || 0;
  const currentProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const allNfts = missions.flatMap(m => m.nfts);
  const totalCompletedTasks = 0; // Mocked as per requirement
  const totalOverallTasks = allNfts.length;
  const totalProgress = totalOverallTasks > 0 ? (totalCompletedTasks / totalOverallTasks) * 100 : 0;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">Progresso Atual</h2>
      {currentMission && (
        <Card
          key={currentMission.missionId}
          className={`border-0 transition-all animate-fade-in`}
          onClick={() => setCurrMissionDetails(!currMissionDetails)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl`}>
                  <Clock className={`h-6 w-6`} />
                </div>
                <CardTitle className={`text-lg`}>{currentMission.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground/80 leading-relaxed">
              {currentMission.description}
            </p>
            <div className="space-y-2">
            {currMissionDetails ? (
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Progresso</span>
                    <span className="font-bold">{completedTasks}/{totalTasks}</span>
                  </div>
                  <Progress value={currentProgress} className="h-3" />
                </div>
            ) : currentMission.nfts.map((nft) => (
                <div key={nft.PK}>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium`}>{nft.title}</span>
                    <span className={`font-bold`}>0/1</span>
                  </div>
                  <Progress value={0} className={`h-3`} />
                </div>
              )
            )}
            </div>

          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missions.slice(1).map((mission, index) => {
          const completed = false; // Mocked as per requirement
          const Icon = completed ? Check : Lock;

          return (
            <Card
              key={mission.missionId}
              className={`${completed ? "bg-green-300" : "bg-gray-300"} border-0 transition-all animate-fade-in`}
              style={{ animationDelay: `${0.1 + index * 0.05}s` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl`}>
                      <Icon className={`h-6 w-6`} />
                    </div>
                    <CardTitle className={`text-lg ${completed ? "line-through text-emerald-700" : "text-gray-500"}`}>{mission.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <hr />
      <h2 className="text-xl font-bold">Progresso Total</h2>

      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold">NFTs Descobertas</h2>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed mb-4">
          Visite os stands dos clubes estudantis e colete suas NFTs de Conhecimento.
          Cada clube tem habilidades únicas e essenciais para transformar o mundo!
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progresso</span>
            <span className="font-bold">{totalCompletedTasks}/{totalOverallTasks}</span>
          </div>
          <Progress value={totalProgress} className="h-3" />
        </div>
      </div>
    </div>
  );
}