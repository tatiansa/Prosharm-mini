// src/app/api/actions/route.js
import { FrameActionPayload } from "@farcaster/frame-sdk";

export async function GET() {
  return new Response(
    JSON.stringify({
      bio: "Mint your NFT with one click",
      name: "Prosharm Mini",
      icon: "https://yourdomain.com/icon.png", 
      description: "A mini app to mint NFTs directly from Farcaster",
      actions: [
        {
          name: "Mint NFT",
          action: {
            type: "uri",
            uri: "https://yourdomain.com/api/mint" 
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
  const body = await req.json();

  const isValid = FrameActionPayload.safeParse(body);

  if (!isValid.success) {
    return new Response(JSON.stringify({ message: "Invalid request" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  // Здесь можно обработать действие, например mint NFT
  const userFid = isValid.data.untrustedData.fid;

  return new Response(
    JSON.stringify({
      status: "success",
      message: `NFT successfully minted for user #${userFid}!`
    }),
    {
      headers: {
        "Content-Type": "application/json"
      },
      status: 200
    }
  );
}
