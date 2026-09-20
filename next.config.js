/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = '';
let basePath = '';

if (isGithubActions) {
  // trim off `refs/heads` to get the branch name
  const branch = process.env.GITHUB_REF
    ? process.env.GITHUB_REF.split('/').pop()
    : '';

  // Set for GitHub Pages deployment
  assetPrefix = branch === 'main' ? '/' : `/${branch}/`;
  basePath = branch === 'main' ? '' : `/${branch}`;
}

const isProduction =
  process.env.NODE_ENV === 'production' ||
  process.argv.includes('build') ||
  process.argv.some((arg) => arg.endsWith('/next') || arg.endsWith('/next.js'));

const nextConfig = {
  reactStrictMode: true,
  distDir: isProduction ? 'out' : '.next',
  // Static export only for production builds (GH Pages).
  // next dev stays dynamic so new /members/[slug] works without rebuild.
  ...(isProduction ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  assetPrefix,
  basePath,
  trailingSlash: true,
};

module.exports = nextConfig;
