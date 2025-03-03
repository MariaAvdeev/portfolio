import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import mkcert from "vite-plugin-mkcert";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/mini-app",
  plugins: [
    // Allows using React dev server along with building a React application with Vite.
    // https://npmjs.com/package/@vitejs/plugin-react-swc
    react(),
    // Creates a custom SSL certificate valid for the local machine.
    // Using this plugin requires admin rights on the first dev-mode launch.
    // https://www.npmjs.com/package/vite-plugin-mkcert
    process.env.HTTPS && mkcert(),
  ],
  define: { "process.env": process.env },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "../fonts": path.resolve(__dirname, "./src/assets/fonts/"),
    },
  },
  publicDir: "./public",
  server: {
    // Exposes your dev server and makes it accessible for the devices in the same network.
    host: true,
    port: 3000,
  },
  preview: {
    port: 3000,
  },
});
