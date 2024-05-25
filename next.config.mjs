/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'meudxrcsglqhfsylqmhs.supabase.co',
                port: '',
            },
        ],
    },
};

export default nextConfig;
