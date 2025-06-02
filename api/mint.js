export default function handler(req, res) {
  // Включаем CORS для Farcaster
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Адрес вашего задеплоенного контракта
    const CONTRACT_ADDRESS = "0xe4563A05864A357f2B2579D6011b7fD64afac9BE";
    
    console.log('Mint request received:', req.body);

    // Возвращаем транзакцию для минта
    return res.status(200).json({
      chainId: "eip155:8453", // Base Mainnet
      method: "eth_sendTransaction",
      params: {
        to: CONTRACT_ADDRESS,
        data: "0x1249c58b", // функция mint() encoded
        value: "0x1197998E739E0" // 0.000005 ETH в wei
      }
    });
  } catch (error) {
    console.error('Mint error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
