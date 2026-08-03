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

const nextConfig = {
  reactStrictMode: true,
  // Static export only for production builds (GH Pages).
  // next.devs stays dynamic so new /members/[slug] works without rebuild.
  ...(process.env.NODE_ENV === 'production' ? { output: 'export' } : {}),
  images: {
    unoptimized: true,
  },
  assetPrefix,
  basePath,
  trailingSlash: true,
};

module.exports = nextConfig;
