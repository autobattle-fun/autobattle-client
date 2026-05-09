/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false,
  images: {
    domains: ["abc.deforge.io"],
  },
};

export default nextConfig;
