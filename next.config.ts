import type { NextConfig } from "next";

/**
 * Allow remote images in next/image:
 * - picsum.photos: placeholder images used by the seed data
 * - images.unsplash.com: curated category photos (migration 0015)
 * - Supabase storage host: admin-uploaded product images
 */
function supabaseImageHost(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

const remotePatterns: { protocol: "https"; hostname: string }[] = [
  { protocol: "https", hostname: "picsum.photos" },
  { protocol: "https", hostname: "fastly.picsum.photos" },
  { protocol: "https", hostname: "images.unsplash.com" },
];

const supabaseHost = supabaseImageHost();
if (supabaseHost) {
  remotePatterns.push({ protocol: "https", hostname: supabaseHost });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
