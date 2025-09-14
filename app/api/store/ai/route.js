import { openai } from "@/configs/openai";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

async function main(base64Image, mimeType) {
  const messages = [
    {
      role: "system",
      content: `
                You are a product listing assistant for an e-commerce store. 
    Your task is to analyze an uploaded product image and generate high-quality structured data. 

    ✅ Response Rules:
    - Return only raw JSON (no code blocks, no markdown, no explanations).
    - The JSON must strictly follow the given schema.
    - Ensure the product name is concise, clear, and recognizable.
    - Ensure the description is marketing-friendly, engaging, and highlights product benefits.

    JSON Schema:
    {
      \"name\": string,          // short product name (e.g., 'Wireless Bluetooth Headphones')
      \"description\": string    // compelling marketing-friendly description of the product
    }
            `,
    },
    {
      "role": "user",
      "content": [
        {
          "type": "text",
          "text": "Analyze the product in this image. Ignore background or irrelevant details. Return only the product's name and description, following the exact JSON schema provided by the system.",
        },
        {
          "type": "image_url",
          "image_url": {
            "url": `data:${mimeType};base64,${base64Image}`,
          },
        },
      ],
    },
  ];
  const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: messages,
    })
    const raw = response.choices[0].message.content
    // remove json or wrapper if present
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
        parsed = JSON.parse(cleaned)
    } catch (error) {
        throw new Error("Ai did not return valide json")
    }
    return parsed;
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }
    const { base64Image, mimeType } = await request.json();
    const result = await main(base64Image,mimeType);
    return NextResponse.json({...result})
  } catch (error) {
    console.log(error);
    return NextResponse.json({error:error.code || error.message}, {status:400})
  }
}
