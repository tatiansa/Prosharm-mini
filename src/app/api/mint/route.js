import { HubAsyncResult, HubError } from '@farcaster/hub-nodejs';

export async function GET() {
  return new Response(
    JSON.stringify({
      bio: "Mint your NFT with one click",
      name: "ProShark NFT",
      icon: "https://prosharm-mini.vercel.app/icon.png", 
      description: "Mint your ProShark NFT on Base network for 0.000005 ETH",
      actions: [
        {
          name: "Mint NFT",
          action: {
            type: "uri",
            uri: "https://prosharm-mini.vercel.app/api/mint" 
          }
        }
      ]
    }),
    {
      headers: {
        "Content-Type": "application/json"
      },
      status: 200
    }
  );
}

export async function POST(req) {
  try {
    const body = await req.json();

    // Пример проверки
    if (!body.untrustedData || !body.trustedData) {
      return new Response(JSON.stringify({ message: "Invalid request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const fid = body.untrustedData.fid;

    return new Response(
      JSON.stringify({
        status: "success",
        message: `✅ NFT successfully minted for user ${fid}!`,
        imageUrl: "https://prosharm-mini.vercel.app/images/nft-success.png" 
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200
      }
    );

  } catch (error) {
    console.error("POST error:", error);
    return new Response(
      JSON.stringify({ status: "error", message: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
