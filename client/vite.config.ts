import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  // Get port from environment variable or default to 8080
  const port = parseInt(env.FRONTEND_PORT || '8080', 10);

  return {
    plugins: [react()],
    server: {
      port: port,
      host: true, // Allow external connections
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Make environment variables available to the client
    define: {
      __FRONTEND_PORT__: JSON.stringify(port),
      __BACKEND_PORT__: JSON.stringify(env.BACKEND_PORT || '5002'),
    },
  };
});
