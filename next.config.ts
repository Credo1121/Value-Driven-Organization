import type { NextConfig } from 'next'

// ADR-001: fully static export, no server runtime.
const nextConfig: NextConfig = {
  output: 'export',
  // `/glossary` → `out/glossary/index.html`, so the export can be served
  // from any static folder or opened locally without rewrite rules.
  trailingSlash: true,
}

export default nextConfig
