import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { getAccountData } from "@/lib/api";

export function Capture() {
  const [publicKey, setPublicKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const accountData = await getAccountData();
        const walletData = accountData.find((item) => item.SK === "WALLET");
        if (walletData) {
          setPublicKey(walletData.publicKey);
        }
      } catch (error) {
        console.error("Failed to fetch account data:", error);
      }
    };

    fetchAccountData();
  }, []);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">Capture seu NFT</h2>
      <p className="text-center mb-8">Apresente este QR Code no stand do clube para coletar seu NFT.</p>
      {publicKey ? (
        <div className="bg-white p-4 rounded-lg">
          <QRCodeSVG value={publicKey} size={256} />
        </div>
      ) : (
        <p>Carregando seu código QR...</p>
      )}
    </div>
  );
}
