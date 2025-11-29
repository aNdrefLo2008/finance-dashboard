/** @format */
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const match = cookieHeader.match(/next-auth.session-token=([a-zA-Z0-9-]+)/);
    if (!match) {
      return NextResponse.json({ error: "Unauthorized - no session token" }, { status: 401 });
    }

    const sessionToken = match[1];

    // Look up session in database
    const session = await prisma.session.findUnique({
      where: { sessionToken },
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized - invalid session" }, { status: 401 });
    }

    const userId = session.userId;

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    })

    const total = transactions.reduce((sum: number, t: any) => sum + t.amount, 0)
    const avg = total / (transactions.length || 1)

    const systemPrompt = `
You are a financial assistant. Analyze these transactions and provide:
1. Spending insights (e.g., categories increasing/decreasing)
2. Predictions for next month
3. A short motivational message
Make it concise and human-friendly.
    `
    const userPrompt = JSON.stringify(transactions)

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // get free API key
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // free tier model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error("OpenRouter API error:", response.status, text)
      return NextResponse.json({
        total,
        avg,
        message: `⚠️ OpenRouter API error ${response.status}: ${text}`,
      })
    }

    const data = await response.json()
    const message = data.choices?.[0]?.message?.content || "No AI response"

    return NextResponse.json({ total, avg, message })
  } catch (error: any) {
    console.error("AI API error:", error)
    return NextResponse.json(
      {
        total: 0,
        avg: 0,
        message: "⚠️ AI service unavailable, showing fallback insights.",
      },
      { status: 500 }
    )
  }
}
