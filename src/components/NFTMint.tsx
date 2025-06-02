import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Coins, Wallet, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface TransactionReceipt {
  status: string;
  transactionHash: string;
}

const NFTMint = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState<string>('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintHash, setMintHash] = useState<string>('');
  const { toast } = useToast();

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast({
          title: "MetaMask не найден",
          description: "Пожалуйста, установите MetaMask",
          variant: "destructive",
        });
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Проверяем сеть Base
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x2105') { // Base Mainnet
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x2105' }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0x2105',
                chainName: 'Base',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://mainnet.base.org'],
                blockExplorerUrls: ['https://basescan.org'],
              }],
            });
          }
        }
      }

      setAccount(accounts[0]);
      setIsConnected(true);
      toast({
        title: "Кошелек подключен",
        description: `Адрес: ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Ошибка подключения",
        description: "Не удалось подключить кошелек",
        variant: "destructive",
      });
    }
  };

  const mintNFT = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    setIsMinting(true);
    try {
      // Адрес вашего контракта
      const CONTRACT_ADDRESS = "0xe4563A05864A357f2B2579D6011b7fD64afac9BE";

      const transaction = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          from: account,
          to: CONTRACT_ADDRESS,
          value: '0x1197998E739E0', // 0.000005 ETH
          data: '0x1249c58b', // mint() function
        }],
      });

      setMintHash(transaction);
      toast({
        title: "NFT минтится!",
        description: "Транзакция отправлена. Ожидайте подтверждения...",
      });

      // Ждем подтверждения транзакции
      const receipt = await waitForTransaction(transaction);
      if (receipt.status === '0x1') {
        toast({
          title: "🎉 NFT заминчен!",
          description: "Ваш ProShark NFT успешно создан!",
        });
      }
    } catch (error: any) {
      console.error('Mint error:', error);
      toast({
        title: "Ошибка минта",
        description: error.message || "Не удалось заминтить NFT",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  };

  const waitForTransaction = async (hash: string): Promise<TransactionReceipt> => {
    return new Promise((resolve) => {
      const checkTransaction = async () => {
        try {
          const receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [hash],
          });
          if (receipt) {
            resolve(receipt as TransactionReceipt);
          } else {
            setTimeout(checkTransaction, 2000);
          }
        } catch (error) {
          setTimeout(checkTransaction, 2000);
        }
      };
      checkTransaction();
    });
  };

  return (
    <div className="space-y-6">
      {/* NFT Preview Card */}
      <Card className="overflow-hidden">
        <div className="relative">
          <img 
            src="https://gateway.pinata.cloud/ipfs/bafkreidmvxqjqpuz5rb7z74hcqdfprf26mgf4thovlh5erm5kqrng5sulq" 
            alt="ProShark NFT" 
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              Base Network
            </Badge>
          </div>
        </div>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>ProShark NFT</span>
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-bold">0.000005 ETH</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Уникальная коллекция ProShark NFT на сети Base. Заминтите свою акулу прямо сейчас!
          </p>

          {/* Wallet Connection */}
          {!isConnected ? (
            <Button 
              onClick={connectWallet} 
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              size="lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Подключить кошелек
            </Button>
          ) : (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Кошелек подключен: {account.slice(0, 6)}...{account.slice(-4)}
              </AlertDescription>
            </Alert>
          )}

          {/* Mint Button */}
          <Button 
            onClick={mintNFT}
            disabled={isMinting}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            size="lg"
          >
            {isMinting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Минтим...
              </>
            ) : (
              <>
                <Coins className="w-5 h-5 mr-2" />
                🦈 Заминтить ProShark NFT
              </>
            )}
          </Button>

          {/* Transaction Hash */}
          {mintHash && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="break-all">
                Транзакция: 
                <a 
                  href={`https://basescan.org/tx/${mintHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  {mintHash.slice(0, 10)}...{mintHash.slice(-8)}
                  <ExternalLink className="w-3 h-3 inline ml-1" />
                </a>
              </AlertDescription>
            </Alert>
          )}

          {/* Info */}
          <div className="text-sm text-gray-500 space-y-1">
            <p>• Сеть: Base Mainnet</p>
            <p>• Стандарт: ERC-721</p>
            <p>• Метаданные: On-chain + IPFS</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NFTMint;
