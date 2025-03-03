const environment = require('../environment/environment.json');  

class EnvConfig {
    constructor(env = process.env.NODE_ENV || 'development') {
        this.env = env;
        this.config = this.getConfig();
    }

    getConfig() {
        if (this.env === 'development') {
            return environment[this.env];
        }
        return environment.prod; 
    }

    loadEnv() {
        const envConfig = this.config;
        Object.keys(envConfig).forEach((key) => {
            process.env[key] = envConfig[key];
        });
    }
}

module.exports = EnvConfig;
