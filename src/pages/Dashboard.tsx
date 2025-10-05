import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Users, Trophy, Wallet, Sparkles, Check, Lock, Home, QrCode } from "lucide-react";
import { HomePage } from "./Home";
import { Collection } from "./Collection";
import { Clubs } from "./Clubs";
import { Profile } from "./Profile";
import { Capture } from "./Capture";

const Dashboard = () => {
  const [collectedNFTs, setCollectedNFTs] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("missoes");
  const navigate = useNavigate();

  const handleCollect = (clubId: number) => {
    if (!collectedNFTs.includes(clubId)) {
      setCollectedNFTs([...collectedNFTs, clubId]);
    }
  };

  const completedMissions = Math.floor(collectedNFTs.length / 2);

  return (
    <div className="min-h-screen pb-20">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Header */}
        <div className="glass-strong rounded-b-3xl p-6 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Inteli Day</h1>
              <p className="text-sm text-foreground/70 mt-1">
                Missão: Mudar o mundo com tecnologia
              </p>
            </div>
            <div className="bg-primary/20 p-3 rounded-full">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-6">
          {/* Missões Tab */}
          <TabsContent value="missoes" className="mt-0 space-y-6">
            <HomePage/>
          </TabsContent>

          {/* NFTs Tab */}
          <TabsContent value="nfts" className="mt-0 space-y-6">
            <Collection/>
          </TabsContent>

          <TabsContent value="capture" className="mt-0 space-y-6">
            <Capture/>
          </TabsContent>

          {/* Clubes Tab */}
          <TabsContent value="clubes" className="mt-0 space-y-6">
            <Clubs/>
          </TabsContent>

          {/* Perfil Tab */}
          <TabsContent value="perfil" className="mt-0 space-y-6">
            <Profile/>
          </TabsContent>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 glass-strong border-t border-border/50">
          <TabsList className="w-full h-16 bg-transparent grid grid-cols-5 rounded-none p-0">
            <TabsTrigger
              value="missoes"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 rounded-none"
            >
              <Home className="h-5 w-5" />
              <span className="text-xs">Missões</span>
            </TabsTrigger>
            <TabsTrigger
              value="nfts"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 rounded-none"
            >
              <Sparkles className="h-5 w-5" />
              <span className="text-xs">NFTs</span>
            </TabsTrigger>

            <TabsTrigger
              value="capture"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 rounded-none"
            >
              <div className="flex flex-col items-center justify-center -mt-8">
                <div className="bg-primary rounded-full p-4 shadow-lg">
                  <QrCode className="h-8 w-8 text-primary-foreground" />
                </div>
                <span className="text-xs mt-1">Capturar</span>
              </div>
            </TabsTrigger>

            <TabsTrigger
              value="clubes"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 rounded-none"
            >
              <Users className="h-5 w-5" />
              <span className="text-xs">Clubes</span>
            </TabsTrigger>
            <TabsTrigger
              value="perfil"
              className="flex-col gap-1 h-full data-[state=active]:bg-primary/10 rounded-none"
            >
              <Wallet className="h-5 w-5" />
              <span className="text-xs">Perfil</span>
            </TabsTrigger>
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};

export default Dashboard;
