import { FrameActionPayload } from "@farcaster/frame-sdk";

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

  const fid = isValid.data.untrustedData.fid;

  return new Response(
    JSON.stringify({
      status: "success",
      message: `✅ NFT successfully minted for user ${fid}!`,
      imageUrl: "https://prosharm-mini.vercel.app/images/nft-success.png" 
    }),
    {
      headers: {
        "Content-Type": "application/json"
      },
      status: 200
    }
  );
}
