// lib/prisma.js
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Neon serverless config
neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const connectionString = process.env.DATABASE_URL;

let prisma;

if (process.env.NEXT_RUNTIME === 'edge') {
  // Edge runtime (Vercel Edge, Cloudflare Workers, etc.)
  const adapter = new PrismaNeon({ connectionString });
  prisma = new PrismaClient({ adapter });
} else {
  // Local dev / Node.js runtime
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: { db: { url: connectionString } },
    });
  }
  prisma = global.prisma;
}

// Optional: test connection at startup
(async () => {
  try {
    await prisma.$connect();
    console.log('✅ Prisma connected successfully');
  } catch (err) {
    console.error('❌ Prisma connection failed:', err);
  }
})();

export default prisma;
