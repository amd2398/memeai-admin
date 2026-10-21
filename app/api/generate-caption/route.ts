
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { getAdminDatabase } from "@/lib/admin";

const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
    try {
        // Verify that the signed-in user is a superadmin.
        await getAdminDatabase();

        const formData = await request.formData();
        const image = formData.get("image");
        const prompt = formData.get("prompt");

        if (
            !(image instanceof File) ||
            typeof prompt !== "string" ||
            !prompt.trim()
        ) {
            return NextResponse.json(
                { error: "Image and prompt are required" },
                { status: 400 }
            );
        }

        if (
            !image.type.startsWith("image/") ||
            image.size > 5 * 1024 * 1024
        ) {
            return NextResponse.json(
                { error: "Upload an image smaller than 5 MB" },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "Gemini API key is not configured" },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey });

        const bytes = await image.arrayBuffer();
        const base64Image = Buffer.from(bytes).toString("base64");

        let lastError: unknown;

        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-3.5-flash-lite",
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    inlineData: {
                                        mimeType: image.type,
                                        data: base64Image,
                                    },
                                },
                                {
                                    text: `You are a funny meme caption writer.

Look carefully at the uploaded image and write ONE short, funny meme caption for it.

The user gave you this context:
"${prompt}"

The target audience is a chronically-online college student in New York City.

Make the caption relevant to BOTH the image and the user's context.
Keep it concise, specific, and meme-like.
Return ONLY the caption with no explanation or quotation marks.`,
                                },
                            ],
                        },
                    ],
                });

                const caption = response.text?.trim();

                if (!caption) {
                    throw new Error("Gemini returned an empty caption");
                }

                return NextResponse.json({ caption });
            } catch (error) {
                lastError = error;

                if (attempt < 3) {
                    await sleep(attempt * 2000);
                }
            }
        }

        console.error("Gemini generation failed:", lastError);

        return NextResponse.json(
            { error: "Gemini is temporarily unavailable. Try again." },
            { status: 503 }
        );
    } catch (error) {
        console.error("Admin caption generation failed:", error);

        return NextResponse.json(
            { error: "Unauthorized or unable to generate caption" },
            { status: 403 }
        );
    }
}
