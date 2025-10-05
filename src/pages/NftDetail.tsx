import { FC, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertTriangle, Copy, Check } from "lucide-react";
import { getAccountData, getUserNfts } from "@/lib/api";
import { Button } from "@/components/ui/button";

type Rarity = "common" | "rare" | "epic" | "legendary";

const rarityColors: Record<Rarity, string> = {
  common: "bg-gray-300 text-foreground",
  rare: "bg-blue-400 text-blue-900",
  epic: "bg-indigo-400 text-indigo-900",
  legendary: "bg-amber-400 text-amber-900",
};

interface NftDetailData {
  nftId: string;
  title: string;
  description: string;
  rarity: Rarity;
  imageUrl: string;
  metadataUri: string;
  missionId: string;
  createdAt: string;
}

interface NftMintData {
  clubId: string;
  nftId: string;
  recipient: string;
  txSig: string;
  assetId: string;
  leafIndex: number;
  status: string;
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

const NftDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [nft, setNft] = useState<NftDetailData | null>(null);
  const [mintInfo, setMintInfo] = useState<NftMintData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        
        const nftResponse = await fetch(`http://localhost:3000/nft/templates/${id}`);
        if (!nftResponse.ok) {
          throw new Error('NFT não encontrado ou falha ao buscar.');
        }
        const nftData = await nftResponse.json();
        setNft(nftData);

        const accountData = await getAccountData();
        const walletData = accountData.find((item: any) => item.SK === "WALLET");
        const publicKey = walletData?.publicKey;

        if (publicKey) {
          const userNfts = await getUserNfts(publicKey);
          const currentMintInfo = userNfts.items.find((mint: NftMintData) => mint.nftId === id);
          if (currentMintInfo) {
            setMintInfo(currentMintInfo);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    } else {
      setError("ID da NFT não fornecido.");
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

  if (!nft) {
    return (
       <div className="container mx-auto p-4 flex justify-center items-center h-full">
        <Alert variant="default" className="max-w-lg glass-panel">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Não encontrado</AlertTitle>
          <AlertDescription>A NFT que você está procurando não foi encontrada.</AlertDescription>
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
        Voltar para a Coleção
      </Button>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="w-full">
          <Card className="glass-panel border-0 overflow-hidden rounded-2xl">
            <CardContent className="p-0">
              <div className="aspect-square">
                <img src={nft.imageUrl} alt={nft.title} className="w-full h-full object-cover" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <h1 className="text-4xl font-bold mb-2">{nft.title}</h1>
            <Badge className={`${rarityColors[nft.rarity]} text-lg px-4 py-1`}>
              {nft.rarity}
            </Badge>
            <p className="text-lg mt-4">{nft.description}</p>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-2">
            <h3 className="font-bold text-xl mb-4">Detalhes Técnicos</h3>
            <p><strong>ID da NFT:</strong> <span className="font-mono text-sm">{nft.nftId}</span></p>
            <p><strong>ID da Missão:</strong> <span className="font-mono text-sm">{nft.missionId}</span></p>
            <p><strong>Data de Criação:</strong> {new Date(nft.createdAt).toLocaleString()}</p>
            <p><strong>Metadata:</strong> <a href={nft.metadataUri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Ver JSON</a></p>
          </div>

          {mintInfo && (
            <div className="glass-panel rounded-2xl p-6 space-y-3">
              <h3 className="font-bold text-xl mb-4">Dados da Blockchain</h3>
              <p><strong>Data do Resgate:</strong> {new Date(mintInfo.createdAt).toLocaleString()}</p>
              
              <div>
                <p className="font-bold">Assinatura da Transação</p>
                <div className="flex items-start gap-2">
                  <a href={`https://solscan.io/tx/${mintInfo.txSig}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-mono text-sm break-all">
                    {mintInfo.txSig}
                  </a>
                  <CopyButton text={mintInfo.txSig} />
                </div>
              </div>

              <div>
                <p className="font-bold">Asset ID</p>
                <div className="flex items-start gap-2">
                  <a href={`https://solscan.io/account/${mintInfo.assetId.split(',')[0]}?cluster=devnet`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-mono text-sm break-all">
                    {mintInfo.assetId.split(',')[0]}
                  </a>
                  <CopyButton text={mintInfo.assetId.split(',')[0]} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NftDetail;
