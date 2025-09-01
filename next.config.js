/**
 * @type {import('next').NextConfig}
 */

const repoName = 'frontchapter-website'; // Change if your repo name is different
const isGithubPages = true;

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isGithubPages ? `/${repoName}` : '',
  assetPrefix: isGithubPages ? `/${repoName}/` : '',
};

module.exports = nextConfig;
