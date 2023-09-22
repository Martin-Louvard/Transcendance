// vite.config.ts
import { defineConfig } from "file:///app/node_modules/vite/dist/node/index.js";
import react from "file:///app/node_modules/@vitejs/plugin-react/dist/index.mjs";
import * as path from "path";
import inject from "file:///app/node_modules/@rollup/plugin-inject/dist/es/index.js";
import glsl from "file:///app/node_modules/vite-plugin-glsl/src/index.js";
var __vite_injected_original_dirname = "/app";
var vite_config_default = defineConfig({
  plugins: [react(), glsl()],
  server: { port: 3e3 },
  resolve: {
    alias: [{ find: "@shared", replacement: path.resolve(__vite_injected_original_dirname, "shared") }]
  },
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ["Buffer", "Buffer"], process: "process" })]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IGluamVjdCBmcm9tICdAcm9sbHVwL3BsdWdpbi1pbmplY3QnXG5pbXBvcnQgZ2xzbCBmcm9tICd2aXRlLXBsdWdpbi1nbHNsJ1xuXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKSwgZ2xzbCgpXSxcbiAgc2VydmVyOiB7cG9ydDogMzAwMH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW3sgZmluZDogJ0BzaGFyZWQnLCByZXBsYWNlbWVudDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NoYXJlZCcpIH1dLFxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIHBsdWdpbnM6IFtpbmplY3QoeyBCdWZmZXI6IFsnQnVmZmVyJywgJ0J1ZmZlciddLCBwcm9jZXNzOiAncHJvY2VzcycgfSldLFxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOEwsU0FBUyxvQkFBb0I7QUFDM04sT0FBTyxXQUFXO0FBQ2xCLFlBQVksVUFBVTtBQUN0QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxVQUFVO0FBSmpCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0FBQUEsRUFDekIsUUFBUSxFQUFDLE1BQU0sSUFBSTtBQUFBLEVBQ25CLFNBQVM7QUFBQSxJQUNQLE9BQU8sQ0FBQyxFQUFFLE1BQU0sV0FBVyxhQUFrQixhQUFRLGtDQUFXLFFBQVEsRUFBRSxDQUFDO0FBQUEsRUFDN0U7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGVBQWU7QUFBQSxNQUNiLFNBQVMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLFVBQVUsUUFBUSxHQUFHLFNBQVMsVUFBVSxDQUFDLENBQUM7QUFBQSxJQUN4RTtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
