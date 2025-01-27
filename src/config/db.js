import { neon } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import os from 'os';
import { apiVersion, ipAddress } from '../constants/index.js';
const numCPUs = os.cpus().length;

const prisma = new PrismaClient();
const sql = neon(process.env.DATABASE_URL);
/**
 * Connect to the Neon database and log server details.
 *
 * @param {number} port - The server's port number.
 */
const connectDb = async (port) => {
  try {
    await prisma.$connect();

    // await sql`SELECT 1`;
    console.log(
      `\x1b[32m Prisma connected to the Neon database Server is running on port : ${port}, api url is =  http://${ipAddress()}:${port}/api/${apiVersion}\x1b[0m`
    );
    console.log(`Total cors are ${numCPUs}`);
  } catch (err) {
    console.error('Failed to connect to Neon Database:', err);
  }
};

export default connectDb;

export { prisma, sql };
