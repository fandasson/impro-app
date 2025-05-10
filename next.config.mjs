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
                port: "",
            },
        ],
    },
};

export default nextConfig;
