// scripts/checkSession.js
const { PrismaClient } = require("../lib/generated/prisma"); // relative path to your generated client

const prisma = new PrismaClient();

async function run(token) {
  try {
    if (!token) {
      console.error("Please provide a session token as an argument.");
      process.exit(1);
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken: token },
    });

    if (!session) {
      console.log("No session found for token:", token);
    } else {
      console.log("Session row:", session);
    }
  } catch (err) {
    console.error("Error checking session:", err);
  } finally {
    await prisma.$disconnect();
  }
}

run(process.argv[2]);
