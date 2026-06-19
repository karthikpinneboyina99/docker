import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env') });

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`FATAL ERROR: Environment variable ${name} is missing.`);
    process.exit(1);
  }
  return value;
}

export const config = {
  port: process.env.PORT || 3001,
  databaseUrl: getEnvVar('DATABASE_URL'),
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
};
