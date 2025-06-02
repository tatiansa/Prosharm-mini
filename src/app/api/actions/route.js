// Импортируем типы из Farcaster Frame SDK
import { FrameActionPayload } from "@farcaster/frame-sdk";

// GET-запрос: отображается при загрузке Mini App в Farcaster
export async function GET() {
  return new Response(
    JSON.stringify({
      bio: "Mint your NFT with one click",
      name: "Prosharm Mini",
      icon: "https://prosharm-mini.vercel.app/icon.png",  // Убедитесь, что файл существует
      description: "A mini app to mint NFTs directly from Farcaster",

      actions: [
        {
          name: "Mint NFT",
          action: {
            type: "uri",
            uri: "https://prosharm-mini.vercel.app/api/mint"  // Вызовет POST в api/mint/route.js
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

// POST-запрос: вызывается при нажатии на кнопку
export async function POST(req) {
  try {
    const body = await req.json();

    // Проверяем, что запрос соответствует формату Farcaster
    const isValid = FrameActionPayload.safeParse(body);

    if (!isValid.success) {
      return new Response(
        JSON.stringify({ message: "Invalid request" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Получаем FID пользователя
    const fid = isValid.data.untrustedData.fid;

    console.log("Кнопка нажата пользователем с FID:", fid);

    // Возвращаем успешный ответ
    return new Response(
      JSON.stringify({
        status: "success",
        message: `✅ NFT successfully minted for user ${fid}!`,
        imageUrl: "https://prosharm-mini.vercel.app/images/nft-success.png"  // Картинка после нажатия
      }),
      {
        headers: {
          "Content-Type": "application/json"
        },
        status: 200
      }
    );
  } catch (error) {
    console.error("Ошибка в обработке POST:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Internal server error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
}
