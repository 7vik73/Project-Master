import { getEnv } from "../utils/get-env";
import path from "path";

// Import shared config
const sharedConfigPath = path.join(__dirname, '../../../shared-config.js');
const sharedConfig = require(sharedConfigPath);

const appConfig = () => {
  // Get port configuration with fallbacks
  const backendPort = getEnv("BACKEND_PORT", "5002");
  const frontendPort = getEnv("FRONTEND_PORT", "8081");
  const mongodbPort = getEnv("MONGODB_PORT", "34567");

  // Automatically derive URLs from ports
  const frontendOrigin = `http://localhost:${frontendPort}`;
  const backendUrl = `http://localhost:${backendPort}`;
  const mongoUri = `mongodb://localhost:${mongodbPort}/project-master`;
  const googleCallbackUrl = `${backendUrl}/api/auth/google/callback`;
  const frontendGoogleCallbackUrl = `${frontendOrigin}/auth/callback`;

  return {
    NODE_ENV: getEnv("NODE_ENV", "development"),
    PORT: backendPort,
    BASE_PATH: getEnv("BASE_PATH", "/api"),
    MONGO_URI: getEnv("MONGO_URI", mongoUri),

    SESSION_SECRET: getEnv("SESSION_SECRET", "your-super-secret-session-key-change-this-in-production"),
    SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN", "3y"),

    GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
    GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL", googleCallbackUrl),

    FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", frontendOrigin),
    FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL", frontendGoogleCallbackUrl),

    // Additional derived configs
    BACKEND_URL: backendUrl,
    FRONTEND_URL: frontendOrigin,
    MONGODB_PORT: mongodbPort,
    FRONTEND_PORT: frontendPort,
  };
};

export const config = appConfig();
