const EnvConfig = require('../config/EnvConfig');

const envConfig = new EnvConfig();

envConfig.loadEnv();

console.log(`Environment Loaded: ${process.env.NODE_ENV}`);
