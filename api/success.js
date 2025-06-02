
// api/success.js - Callback после успешного минта
export default async function handler(req, res) {
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
    const { transactionId } = req.body;
    
    console.log('Success callback received:', req.body);

    // Создаем новый Frame для отображения успеха
    const successFrame = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>ProShark NFT Minted!</title>
    
    <!-- Farcaster Frame Meta Tags для успешного минта -->
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="https://gateway.pinata.cloud/ipfs/bafybeigfv2x5akwar7xlq7qturlzpbygb5g2dyzodiew5c4zyadwba42de" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    <meta property="fc:frame:button:1" content="🎉 View on BaseScan" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="https://basescan.org/tx/${transactionId || 'latest'}" />
    <meta property="fc:frame:button:2" content="🦈 Mint Another" />
    <meta property="fc:frame:button:2:action" content="post" />
    <meta property="fc:frame:button:2:target" content="https://prosharm-mini.vercel.app" />
    
    <meta property="og:title" content="ProShark NFT Minted Successfully!" />
    <meta property="og:description" content="Your ProShark NFT has been minted successfully!" />
    <meta property="og:image" content="https://gateway.pinata.cloud/ipfs/bafybeigfv2x5akwar7xlq7qturlzpbygb5g2dyzodiew5c4zyadwba42de" />
</head>
<body>
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: Arial, sans-serif;">
        <h1>🎉 NFT Minted Successfully!</h1>
        <p>Your ProShark NFT has been minted!</p>
        ${transactionId ? `<p>Transaction: ${transactionId}</p>` : ''}
        <img src="https://gateway.pinata.cloud/ipfs/bafybeigfv2x5akwar7xlq7qturlzpbygb5g2dyzodiew5c4zyadwba42de" alt="ProShark NFT" style="max-width: 300px; border-radius: 10px;" />
    </div>
</body>
</html>`;

    return res.status(200).send(successFrame);
    
  } catch (error) {
    console.error('Success callback error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
