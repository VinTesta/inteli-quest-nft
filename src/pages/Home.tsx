import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Check, Lock, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getAccountData, getMissions, getUserNfts } from "@/lib/api";

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
  completed: boolean;
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
  const [otherMissions, setOtherMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [currMissionDetails, setCurrMissionDetails] = useState<boolean>(false);
  const [currentMissionIndex, setCurrentMissionIndex] = useState<number>(0);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const accountData = await getAccountData();
        const walletData = accountData.find((item) => item.SK === "WALLET");
        const publicKey = walletData?.publicKey;

        const response: ApiResponse = await getMissions();

        if (publicKey) {
          const userNftsResponse = await getUserNfts(publicKey);
          const userNftIds = userNftsResponse.items.map((nft: { nftId: string }) => nft.nftId);

          const updatedMissions = response.missions.map(mission => ({
            ...mission,
            nfts: mission.nfts.map(nft => ({
              ...nft,
              completed: userNftIds.includes(nft.GSI2SK.split("#")[1]),
            })),
          }));

          setMissions(updatedMissions);

          const firstUncompletedMissionIndex = updatedMissions.findIndex(
            mission => !mission.nfts.every(nft => nft.completed)
          );

          if (firstUncompletedMissionIndex !== -1) {
            setCurrentMissionIndex(firstUncompletedMissionIndex);
            const uncompletedMissions = updatedMissions.filter((_, index) => index !== firstUncompletedMissionIndex);
            setOtherMissions(uncompletedMissions);
          } else {
            setCurrentMissionIndex(updatedMissions.length);
            setOtherMissions(updatedMissions);
          }
        } else {
          setMissions(response.missions);
        }
      } catch (error) {
        console.error("Failed to fetch missions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const currentMission = missions[currentMissionIndex];
  const allMissionsCompleted = currentMissionIndex >= missions.length;

  const completedTasks = currentMission?.nfts.filter(nft => nft.completed).length || 0;
  const totalTasks = currentMission?.nfts.length || 0;
  const currentProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const allNfts = missions.flatMap(m => m.nfts);
  const totalCompletedTasks = allNfts.filter(nft => nft.completed).length;
  const totalOverallTasks = allNfts.length;
  const totalProgress = totalOverallTasks > 0 ? (totalCompletedTasks / totalOverallTasks) * 100 : 0;

  const totalMissionsProgress = missions.length > 0 ? (missions.filter(m => m.nfts.every(nft => nft.completed)).length / missions.length) * 100 : 0;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Progresso Total</h2>
        <Progress value={totalMissionsProgress} className="h-3" />
      </div>
      <hr />
      <h2 className="text-xl font-bold">Missão Atual</h2>
      {allMissionsCompleted ? (
        <Card className="border-0 transition-all animate-fade-in bg-green-300">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl">
                  <Check className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg text-emerald-700">Chega por hoje jovem inovador.</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground/80 leading-relaxed">
              Que tal descançar um pouco e aproveitar a jornada? Seja bem-vindo a faculdade do futuro!
            </p>
          </CardContent>
        </Card>
      ) : currentMission && (
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
            ) : currentMission.nfts.map((nft) => {
                const isCompleted = nft.completed;
                const progressValue = isCompleted ? 100 : 0;
                return (
                  <div key={nft.PK}>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${isCompleted ? "line-through" : ""}`}>{nft.title}</span>
                      <span className={`font-bold`}>{isCompleted ? "1/1" : "0/1"}</span>
                    </div>
                    <Progress value={progressValue} className={`h-3`} />
                  </div>
                )
              }
            )}
            </div>

          </CardContent>
        </Card>
      )}

      <hr />
      <h2 className="text-xl font-bold">Todas as Missões</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {otherMissions
        .sort((a, b) => {
          const aCompleted = a.nfts.every(nft => nft.completed);
          const bCompleted = b.nfts.every(nft => nft.completed);
          if (aCompleted && !bCompleted) {
            return 1;
          }
          if (!aCompleted && bCompleted) {
            return -1;
          }
          return 0;
        })
        .map((mission, index) => {
          const completed = mission.nfts.every(nft => nft.completed);
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


    </div>
  );
}