import mongoose from 'mongoose';
import dns from 'node:dns';
import { promises as dnsPromises } from 'node:dns';

function configureSrvDnsFallback(uri) {
  if (!uri.startsWith('mongodb+srv://')) return;

  const dnsServers = (process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }
}

function getConnectionHelp(error) {
  const message = error?.message || '';

  if (message.includes('querySrv')) {
    return [
      message,
      'Atlas SRV DNS lookup failed. Keep MONGODB_URI as mongodb+srv:// only if your network allows SRV DNS queries.',
      'Try another network, set MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1, or use the non-SRV mongodb:// Atlas connection string.'
    ].join('\n');
  }

  if (message.includes('bad auth') || message.includes('Authentication failed')) {
    return `${message}\nMongoDB authentication failed. Check the username/password in MONGODB_URI.`;
  }

  if (message.includes('IP') || message.includes('not authorized')) {
    return `${message}\nYour current IP may not be allowed in MongoDB Atlas Network Access.`;
  }

  return message;
}

async function verifySrvLookup(uri) {
  if (!uri.startsWith('mongodb+srv://')) return;

  const hostname = new URL(uri).hostname;
  const srvName = `_mongodb._tcp.${hostname}`;
  const timeoutMs = Number(process.env.MONGODB_DNS_TIMEOUT_MS || 5000);

  try {
    await Promise.race([
      dnsPromises.resolveSrv(srvName),
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`querySrv ETIMEOUT ${srvName}`)), timeoutMs);
      })
    ]);
  } catch (error) {
    throw new Error(getConnectionHelp(error));
  }
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI is required');
  }

  mongoose.set('strictQuery', true);
  configureSrvDnsFallback(uri);
  await verifySrvLookup(uri);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log('MongoDB connected');
  } catch (error) {
    throw new Error(getConnectionHelp(error));
  }
}
