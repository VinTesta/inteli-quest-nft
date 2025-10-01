import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Check, Lock, Clock } from "lucide-react";
import { useEffect, useState } from "react";

type Rarity = "comum" | "rara" | "épica" | "lendária";

interface Task {
  id: number;
  description: string;
  completed: boolean;
}

interface Mission {
  id: number;
  title: string;
  story: string;
  status: "current" | "upcoming" | "completed";
  description: string;
  tasks: Task[];
}

const missionData: Mission[] = [
  {
    id: 1,
    title: "Recrutando os Primeiros Aliados",
    story: "Você me parece bom nisso, que tal se você provar seu valor?",
    description: "Vá atrás do coletivo Grace Hopper, da Liga de IA e do Inteli Blockchain, talvez eles te ajudem.",
    status: "current",
    tasks: [
      { id: 1, description: "Capture a NFT do Coletivo Feminino", completed: true },
      { id: 2, description: "Capture a NFT da Liga de IA", completed: false },
      { id: 3, description: "Capture a NFT do Inteli Blockchain", completed: false },
    ],
  },
  {
    id: 2,
    title: "Expansão Tecnológica",
    status: "upcoming",
    story: "",
    description: "",
    tasks: [
      { id: 1, description: "Capture a NFT do Inteli Ultimate Frisbee", completed: false },
      { id: 2, description: "Capture a NFT da Bateria", completed: false },
    ]
  },
  {
    id: 3,
    title: "Dominando o Metaverso",
    status: "upcoming",
    story: "",
    description: "",
    tasks: []
  },
  {
    id: 4,
    title: "A Primeira Missão",
    description: "Colete os NFTs dos clubes fundadores.",
    status: "completed",
    tasks: [
      { id: 1, description: "Capture a NFT do Inteli Ultimate Frisbee", completed: true },
      { id: 2, description: "Capture a NFT da Bateria", completed: true },
    ],
    story: ""
  },
];

export function HomePage() {
  const [currMissionDetails, setCurrMissionDetails] = useState<boolean>(false);

  let currentMission = missionData.find(m => m.status === "current");

  const completedTasks = currentMission?.tasks.filter(t => t.completed).length || 0;
  const totalTasks = currentMission?.tasks.length || 0;
  const currentProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const allTasks = missionData.flatMap(m => m.tasks);
  const totalCompletedTasks = allTasks.filter(t => t.completed).length;
  const totalOverallTasks = allTasks.length;
  const totalProgress = totalOverallTasks > 0 ? (totalCompletedTasks / totalOverallTasks) * 100 : 0;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">Progresso Atual</h2>
      {currentMission && (
        <Card
          key={currentMission.id}
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
            <div className="space-y-2">
            {currMissionDetails ? (
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Progresso</span>
                    <span className="font-bold">{completedTasks}/{totalTasks}</span>
                  </div>
                  <Progress value={currentProgress} className="h-3" />
                </div>
            ) : currentMission.tasks.map((task) => (
                <div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${task.completed && "line-through text-emerald-700"}`}>{task.description}</span>
                    <span className={`font-bold ${task.completed && 'text-green-400'}`}>{task.completed ? 1 : 0}/1</span>
                  </div>
                  <Progress value={0} className={`h-3 ${task.completed && 'bg-green-400'}`} />
                </div>
              )
            )}
            </div>

          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missionData.slice(1).map((mission, index) => {
          const completed = mission.status === 'completed';
          const Icon = completed ? Check : Lock;

          return (
            <Card
              key={mission.id}
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