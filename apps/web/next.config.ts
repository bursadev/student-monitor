import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @sm/i18n ships TypeScript source rather than a build step, so Next has to
  // compile it like first-party code.
  transpilePackages: ["@sm/i18n"],
};

export default nextConfig;
