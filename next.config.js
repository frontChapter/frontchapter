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
  output: 'export',
  images: {
    unoptimized: true,
  },
  assetPrefix,
  basePath,
  trailingSlash: true,
};

module.exports = nextConfig;
