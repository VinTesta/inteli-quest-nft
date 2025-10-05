import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertTriangle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ClubData {
  clubId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  collectionPubkey: string;
  createdAt: string;
}

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button onClick={copyToClipboard} className="p-1.5 rounded-md hover:bg-white/20 transition-colors">
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
    </button>
  );
};

const ClubDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [club, setClub] = useState<ClubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClubDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/clubs/${id}`);
        if (!response.ok) {
          throw new Error('Clube não encontrado ou falha ao buscar.');
        }
        const data = await response.json();
        setClub(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchClubDetail();
    } else {
      setError("ID do Clube não fornecido.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Skeleton className="h-10 w-48 mb-4 bg-gray-500/20" />
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="w-full">
            <Skeleton className="w-full aspect-square rounded-2xl bg-gray-500/20" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-32 w-full rounded-2xl bg-gray-500/20" />
            <Skeleton className="h-40 w-full rounded-2xl bg-gray-500/20" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-full">
        <Alert variant="destructive" className="max-w-lg glass-panel">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!club) {
    return (
       <div className="container mx-auto p-4 flex justify-center items-center h-full">
        <Alert variant="default" className="max-w-lg glass-panel">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Não encontrado</AlertTitle>
          <AlertDescription>O clube que você está procurando não foi encontrado.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
       <Button 
        variant="ghost" 
        onClick={() => navigate('/dashboard')} 
        className="mb-4 flex items-center gap-2 text-foreground/80 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Clubes
      </Button>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="w-full">
          <Card className="glass-panel border-0 overflow-hidden rounded-2xl">
            <CardContent className="p-0">
              <div className="aspect-square">
                <img 
                  src={club.imageUrl || '/placeholder.svg'} 
                  alt={club.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <h1 className="text-4xl font-bold mb-2">{club.name}</h1>
            <p className="text-lg mt-4">{club.description}</p>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-3">
            <h3 className="font-bold text-xl mb-4">Detalhes do Clube</h3>
            <p><strong>Data de Criação:</strong> {new Date(club.createdAt).toLocaleString()}</p>
            
            <div>
              <p className="font-bold">Collection Pubkey</p>
              <div className="flex items-start gap-2">
                <a 
                  href={`https://solscan.io/account/${club.collectionPubkey}?cluster=devnet`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-400 hover:underline font-mono text-sm break-all"
                >
                  {club.collectionPubkey}
                </a>
                <CopyButton text={club.collectionPubkey} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetail;
