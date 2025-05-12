/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "meudxrcsglqhfsylqmhs.supabase.co",
                port: "",
            },
            {
                protocol: "https",
                hostname: "www.improvariace.cz",
                pathname: "/**",
            },
        ],
    },
};

export default nextConfig;
