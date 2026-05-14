const mongoose = require('mongoose');
const logger = require('./logger');

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 5000;

const buildOptions = () => {
  const uri = process.env.MONGODB_URI || '';
  const isSrv = uri.startsWith('mongodb+srv://');
  const opts = {
    serverSelectionTimeoutMS: 15000,
    // Prefer IPv4 — broken IPv6 routes often surface as TLS "alert internal error" (80) on Windows
    family: 4,
  };

  if (isSrv) {
    // Node TLS OCSP to Atlas can fail on some networks and show as SSL alert 80; keep OCSP in production
    if (process.env.NODE_ENV !== 'production' || process.env.MONGODB_REQUEST_OCSP === 'false') {
      opts.requestOCSP = false;
    }
    if (process.env.MONGODB_TLS_INSECURE === 'true' && process.env.NODE_ENV !== 'production') {
      opts.tlsAllowInvalidCertificates = true;
    }
  }

  return opts;
};

const connect = async (retries = MAX_RETRIES) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, buildOptions());
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    if (retries === 0) {
      logger.error('MongoDB connection failed after max retries. Exiting.');
      process.exit(1);
    }
    logger.warn(`MongoDB connection failed. Retrying in ${RETRY_INTERVAL_MS / 1000}s... (${retries} retries left)`);
    await new Promise((res) => setTimeout(res, RETRY_INTERVAL_MS));
    return connect(retries - 1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting reconnection...');
});

mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB error: ${err.message}`);
});

module.exports = { connect };
