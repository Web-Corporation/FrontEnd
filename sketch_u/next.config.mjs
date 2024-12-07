/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        const destination = 'http://43.201.55.125:8081/api/:path*';
        
        return [
          {
            source: '/api/:path*',
            destination: destination,
          },
        ];
    }
};

export default nextConfig;
