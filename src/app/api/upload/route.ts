import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

// Gera o token para o navegador enviar a foto direto para o Vercel Blob
// (evita o limite de 4,5 MB do corpo das funções). O acesso é protegido pelo proxy.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"],
        maximumSizeInBytes: 20 * 1024 * 1024,
        addRandomSuffix: true,
      }),
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
