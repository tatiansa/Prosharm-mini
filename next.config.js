/** @type {import('next').NextConfig} */
const nextConfig = {
  // Поддержка экспортных функций (например, generateStaticParams)
  experimental: {
    serverActions: true,
  },
  // Опционально: если вы используете Edge API Routes
  output: 'standalone',
};

module.exports = nextConfig;
