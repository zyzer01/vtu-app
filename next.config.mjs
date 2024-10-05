/** @type {import('next').NextConfig} */
const nextConfig = {

    webpack: (config, { isServer }) => {
        // Add a rule for handling .hbs files
        config.module.rules.push({
          test: /\.hbs$/,
          loader: 'handlebars-loader'
        });
    
        // Ignore Handlebars warning
        config.ignoreWarnings = [
          { module: /node_modules\/handlebars\/lib\/index\.js/ }
        ];
    
        return config;
      },
};

export default nextConfig;
