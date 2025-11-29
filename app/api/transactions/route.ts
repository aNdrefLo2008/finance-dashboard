// app/api/transactions/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";


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

    // Fetch only transactions for this user
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });


    return NextResponse.json(transactions);
  } catch (err) {
    console.error(err);
    return NextResponse.json([], { status: 500 });
  }
}



export async function POST(req: NextRequest) {
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

    // Parse request body
    const body = await req.json();


    // Create transaction (remove fields not in your schema)
    const newTransaction = await prisma.transaction.create({
      data: {
        userId,
        amount: body.amount,
        date: new Date(body.date),
        desc: body.desc, 
      },
    });

    return NextResponse.json(newTransaction);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}