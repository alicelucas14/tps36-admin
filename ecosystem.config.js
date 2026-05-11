// PM2 Ecosystem Config — Teen Patti Stars
// Usage:
//   Development:  pm2 start ecosystem.config.js
//   Production:   pm2 start ecosystem.config.js --env production

module.exports = {
    apps: [
        {
            name: 'teenpattistars',
            script: 'server.js',
            instances: 1,          // Use 'max' for cluster mode on multi-core servers
            exec_mode: 'fork',     // Change to 'cluster' for multi-core
            autorestart: true,
            watch: false,           // Don't watch files in production
            max_memory_restart: '512M',
            error_file: './logs/pm2-error.log',
            out_file: './logs/pm2-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',

            // Development environment
            env: {
                NODE_ENV: 'development',
                PORT: 8000,
                COOKIE_SECURE: 'false',
                SESSION_SECRET: 'tp_stars_dev_secret_change_me_in_production_2024'
            },

            // Production environment (pm2 start ecosystem.config.js --env production)
            env_production: {
                NODE_ENV: 'production',
                PORT: 8000,
                COOKIE_SECURE: 'true',
                // SESSION_SECRET is read from system environment in production
                // Set it with: export SESSION_SECRET="your_long_random_string"
            }
        }
    ]
};
