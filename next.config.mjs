import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: resolve(__dirname),
  // Allow the Base44 preview origin to load dev assets/HMR. The preview origin
  // is https://3000-<suffix>; a bare '*' does not match, so list it explicitly.
  allowedDevOrigins: process.env.BASE44_PUBLIC_HOST_SUFFIX
    ? ["https://3000-" + process.env.BASE44_PUBLIC_HOST_SUFFIX]
    : [],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
