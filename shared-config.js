// Shared configuration for the entire project
// This file ensures consistent port configuration across frontend and backend

const config = {
    // Default ports - these can be overridden by environment variables
    backend: {
        port: process.env.BACKEND_PORT || 5002,
        host: process.env.BACKEND_HOST || 'localhost'
    },
    frontend: {
        port: process.env.FRONTEND_PORT || 8081,
        host: process.env.FRONTEND_HOST || 'localhost'
    },
    mongodb: {
        port: process.env.MONGODB_PORT || 34567,
        host: process.env.MONGODB_HOST || 'localhost'
    }
};

// Helper functions
const getBackendUrl = () => `http://${config.backend.host}:${config.backend.port}`;
const getFrontendUrl = () => `http://${config.frontend.host}:${config.frontend.port}`;
const getMongoUrl = () => `mongodb://${config.mongodb.host}:${config.mongodb.port}/project-master`;

// Export for Node.js (backend)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        config,
        getBackendUrl,
        getFrontendUrl,
        getMongoUrl
    };
}

// Export for ES modules (frontend)
if (typeof window !== 'undefined') {
    window.sharedConfig = {
        config,
        getBackendUrl,
        getFrontendUrl,
        getMongoUrl
    };
} 