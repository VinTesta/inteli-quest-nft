import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Lock, Clock, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { getAccountData, getMissions, getUserNfts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Interfaces
interface Club {
  PK: string; // CLUB#<id>
  name: string;
  description: string;
}

interface Nft {
  clubId: string;
  title: string;
  club: Club;
}

interface Mission {
  missionId: string;
  title: string;
  description: string;
  nfts: Nft[];
  isCompleted?: boolean;
  completedClubsCount?: number;
  totalClubsCount?: number;
  progress?: number;
}

interface UserNft {
  clubId: string;
}

interface ApiResponse {
  ok: boolean;
  missions: Mission[];
}

export function HomePage() {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [collectedClubIds, setCollectedClubIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const accountData = await getAccountData();
        const walletData = accountData.find((item: any) => item.SK === "WALLET");
        const publicKey = walletData?.publicKey;

        const response: ApiResponse = await getMissions();
        let userClubIds = new Set<string>();

        if (publicKey) {
          const userNftsResponse = await getUserNfts(publicKey);
          userClubIds = new Set(userNftsResponse.items.map((nft: UserNft) => nft.clubId));
          setCollectedClubIds(userClubIds);
        }

        const updatedMissions = response.missions.map(mission => {
          const requiredClubIds = new Set(mission.nfts.map(nft => nft.clubId));
          const completedClubsCount = [...requiredClubIds].filter(clubId => userClubIds.has(clubId)).length;
          const totalClubsCount = requiredClubIds.size;
          const isCompleted = completedClubsCount === totalClubsCount;
          const progress = totalClubsCount > 0 ? (completedClubsCount / totalClubsCount) * 100 : 0;

          return {
            ...mission,
            isCompleted,
            completedClubsCount,
            totalClubsCount,
            progress,
          };
        });

        setMissions(updatedMissions);
      } catch (error) {
        console.error("Failed to fetch missions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const firstUncompletedMissionIndex = missions.findIndex(m => !m.isCompleted);
  const currentMission = missions[firstUncompletedMissionIndex];
  const otherMissions = missions.filter((_, index) => index !== firstUncompletedMissionIndex);
  const allMissionsCompleted = firstUncompletedMissionIndex === -1 && missions.length > 0;

  const totalMissionsCompletedCount = missions.filter(m => m.isCompleted).length;
  const totalMissionsProgress = missions.length > 0 ? (totalMissionsCompletedCount / missions.length) * 100 : 0;

  const getUniqueClubsForMission = (mission: Mission) => {
    const uniqueClubs = new Map<string, { name: string; description: string }>();
    mission.nfts.forEach(nft => {
      if (!uniqueClubs.has(nft.clubId)) {
        uniqueClubs.set(nft.clubId, { name: nft.club.name, description: nft.club.description });
      }
    });
    return Array.from(uniqueClubs.entries()).map(([id, data]) => ({ id, ...data }));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-6 animate-pulse">
        <div className="space-y-2">
          <Skeleton className="h-6 w-1/3 bg-gray-500/20" />
          <Skeleton className="h-3 w-full rounded-full bg-gray-500/20" />
        </div>
        <hr />
        <Skeleton className="h-6 w-1/4 bg-gray-500/20" />
        <Skeleton className="h-48 w-full rounded-2xl bg-gray-500/20" />
        <hr />
        <Skeleton className="h-6 w-1/4 bg-gray-500/20" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full rounded-2xl bg-gray-500/20" />
          <Skeleton className="h-24 w-full rounded-2xl bg-gray-500/20" />
        </div>
      </div>
    );
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
        <Card className="border-0 transition-all animate-fade-in glass-panel-success">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-white/20">
                <Check className="h-6 w-6 text-emerald-900" />
              </div>
              <CardTitle className="text-lg text-emerald-900">Todas as missões concluídas!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-900/80 leading-relaxed">
              Parabéns, você completou sua jornada e ajudou a recrutar para um futuro melhor. Explore o resto do evento!
            </p>
          </CardContent>
        </Card>
      ) : currentMission && (
        <Card
          key={currentMission.missionId}
          className="border-0 transition-all animate-fade-in glass-panel cursor-pointer"
          onClick={() => setShowDetails(!showDetails)}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-black/10">
                <Clock className="h-6 w-6" />
              </div>
              <CardTitle className="text-lg">{currentMission.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground/80 leading-relaxed">
              {currentMission.description}
            </p>
            <div className="space-y-2">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Progresso da Missão</span>
                  <span className="font-bold">{currentMission.completedClubsCount}/{currentMission.totalClubsCount}</span>
                </div>
                <Progress value={currentMission.progress} className="h-3" />
              </div>
              {showDetails && (
                <div className="pt-4 space-y-3">
                  <h3 className="font-bold text-sm">Clubes a visitar para esta missão:</h3>
                  {getUniqueClubsForMission(currentMission).map(club => {
                    const isVisited = collectedClubIds.has(club.id);
                    return (
                      <div key={club.id} className={`p-3 rounded-lg flex items-center gap-3 text-sm transition-all ${isVisited ? 'bg-green-500/20' : 'bg-black/10'}`}>
                        {isVisited ? <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" /> : <Target className="h-5 w-5 text-foreground/50 flex-shrink-0" />}
                        <span className={`font-medium ${isVisited ? 'line-through text-foreground/60' : ''}`}>{club.name}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <hr />
      <h2 className="text-xl font-bold">Próximas Missões</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {otherMissions
          .sort((a, b) => (a.isCompleted ? 1 : -1) - (b.isCompleted ? 1 : -1) || a.title.localeCompare(b.title))
          .map((mission, index) => {
            const Icon = mission.isCompleted ? Check : Lock;
            return (
              <Card
                key={mission.missionId}
                className={`${mission.isCompleted ? "glass-panel-success" : "glass-panel-disabled"} border-0 transition-all animate-fade-in`}
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-white/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className={`text-lg ${mission.isCompleted ? "line-through" : ""}`}>{mission.title}</CardTitle>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
