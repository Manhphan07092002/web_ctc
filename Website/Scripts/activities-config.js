// Activities Page Configuration
// Configuration settings for advanced features

const ActivitiesConfig = {
    // Feature flags
    features: {
        liveChat: true,
        advancedSearch: true,
        fileUpload: true,
        teamCollaboration: true,
        dataVisualization: true,
        activityFeed: true,
        managementDashboard: true,
        notifications: true,
        calendar: true,
        exportFunctions: true
    },

    // API endpoints
    api: {
        baseUrl: '/api/activities',
        endpoints: {
            activities: '/activities',
            events: '/events',
            notifications: '/notifications',
            team: '/team',
            upload: '/upload',
            chat: '/chat',
            search: '/search',
            statistics: '/statistics'
        }
    },

    // UI settings
    ui: {
        theme: 'light', // 'light' | 'dark' | 'auto'
        animations: true,
        soundEffects: false,
        compactMode: false,
        language: 'vi', // 'vi' | 'en'
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '24h' // '12h' | '24h'
    },

    // Chat settings
    chat: {
        enabled: true,
        autoOpen: false,
        welcomeMessage: 'Xin chào! Tôi có thể giúp gì cho bạn?',
        maxMessages: 100,
        typingIndicator: true,
        soundNotifications: false,
        botResponseDelay: 1000 // milliseconds
    },

    // Search settings
    search: {
        enabled: true,
        minQueryLength: 2,
        maxSuggestions: 8,
        debounceDelay: 300,
        highlightResults: true,
        searchHistory: true,
        maxHistoryItems: 10
    },

    // File upload settings
    fileUpload: {
        enabled: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB in bytes
        allowedTypes: [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/gif',
            'text/plain'
        ],
        allowedExtensions: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.txt'],
        maxFiles: 5,
        dragAndDrop: true,
        progressIndicator: true
    },

    // Notification settings
    notifications: {
        enabled: true,
        position: 'top-right', // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
        autoHide: true,
        autoHideDelay: 5000,
        maxNotifications: 3,
        soundEnabled: false,
        types: {
            info: { icon: 'fas fa-info-circle', color: '#3b82f6' },
            success: { icon: 'fas fa-check-circle', color: '#10b981' },
            warning: { icon: 'fas fa-exclamation-triangle', color: '#f59e0b' },
            error: { icon: 'fas fa-times-circle', color: '#ef4444' }
        }
    },

    // Calendar settings
    calendar: {
        enabled: true,
        defaultView: 'month', // 'month' | 'week' | 'day'
        firstDayOfWeek: 1, // 0 = Sunday, 1 = Monday
        showWeekNumbers: false,
        eventColors: {
            activity: '#3b82f6',
            event: '#10b981',
            notification: '#f59e0b',
            schedule: '#8b5cf6'
        },
        timeSlots: {
            start: '08:00',
            end: '18:00',
            interval: 30 // minutes
        }
    },

    // Team collaboration settings
    team: {
        enabled: true,
        showOnlineStatus: true,
        refreshInterval: 30000, // 30 seconds
        maxTeamMembers: 50,
        roles: [
            'Project Manager',
            'Developer',
            'Designer',
            'Tester',
            'Business Analyst',
            'Marketing',
            'HR',
            'Admin'
        ],
        statusTypes: [
            { key: 'online', label: 'Trực tuyến', color: '#10b981' },
            { key: 'busy', label: 'Bận', color: '#f59e0b' },
            { key: 'away', label: 'Vắng mặt', color: '#6b7280' },
            { key: 'offline', label: 'Ngoại tuyến', color: '#9ca3af' }
        ]
    },

    // Data visualization settings
    charts: {
        enabled: true,
        animationDuration: 800,
        colors: [
            '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
            '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
        ],
        refreshInterval: 60000, // 1 minute
        exportFormats: ['png', 'jpg', 'pdf', 'svg']
    },

    // Activity feed settings
    activityFeed: {
        enabled: true,
        maxItems: 20,
        refreshInterval: 30000, // 30 seconds
        showAvatars: true,
        showTimestamps: true,
        groupSimilarActivities: true,
        autoScroll: false
    },

    // Performance settings
    performance: {
        lazyLoading: true,
        virtualScrolling: false,
        cacheEnabled: true,
        cacheExpiry: 300000, // 5 minutes
        batchSize: 20,
        debounceDelay: 300,
        throttleDelay: 100
    },

    // Accessibility settings
    accessibility: {
        highContrast: false,
        reducedMotion: false,
        screenReader: true,
        keyboardNavigation: true,
        focusIndicators: true,
        skipLinks: true
    },

    // Security settings
    security: {
        csrfProtection: true,
        sanitizeInput: true,
        validateFileTypes: true,
        maxRequestSize: 50 * 1024 * 1024, // 50MB
        rateLimiting: {
            enabled: true,
            maxRequests: 100,
            timeWindow: 60000 // 1 minute
        }
    },

    // Localization
    messages: {
        vi: {
            loading: 'Đang tải...',
            error: 'Có lỗi xảy ra',
            success: 'Thành công',
            noResults: 'Không tìm thấy kết quả',
            uploadSuccess: 'Tải lên thành công',
            uploadError: 'Lỗi tải lên',
            fileTooLarge: 'File quá lớn',
            invalidFileType: 'Loại file không hợp lệ',
            networkError: 'Lỗi kết nối mạng',
            unauthorized: 'Không có quyền truy cập',
            sessionExpired: 'Phiên làm việc đã hết hạn'
        },
        en: {
            loading: 'Loading...',
            error: 'An error occurred',
            success: 'Success',
            noResults: 'No results found',
            uploadSuccess: 'Upload successful',
            uploadError: 'Upload error',
            fileTooLarge: 'File too large',
            invalidFileType: 'Invalid file type',
            networkError: 'Network error',
            unauthorized: 'Unauthorized access',
            sessionExpired: 'Session expired'
        }
    },

    // Development settings
    development: {
        debug: false,
        mockData: true,
        logLevel: 'info', // 'debug' | 'info' | 'warn' | 'error'
        showPerformanceMetrics: false,
        enableHotReload: false
    }
};

// Configuration validation
function validateConfig() {
    const requiredFeatures = ['liveChat', 'advancedSearch', 'fileUpload'];
    const missingFeatures = requiredFeatures.filter(feature => 
        !ActivitiesConfig.features[feature]
    );
    
    if (missingFeatures.length > 0) {
        console.warn('Missing required features:', missingFeatures);
    }
    
    // Validate file upload settings
    if (ActivitiesConfig.fileUpload.enabled) {
        if (ActivitiesConfig.fileUpload.maxFileSize <= 0) {
            console.error('Invalid maxFileSize configuration');
        }
        
        if (!Array.isArray(ActivitiesConfig.fileUpload.allowedTypes)) {
            console.error('allowedTypes must be an array');
        }
    }
    
    // Validate API endpoints
    if (!ActivitiesConfig.api.baseUrl) {
        console.warn('API baseUrl not configured');
    }
    
    return true;
}

// Configuration utilities
const ConfigUtils = {
    // Get configuration value with fallback
    get(path, fallback = null) {
        const keys = path.split('.');
        let value = ActivitiesConfig;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return fallback;
            }
        }
        
        return value;
    },
    
    // Set configuration value
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        let target = ActivitiesConfig;
        
        for (const key of keys) {
            if (!(key in target)) {
                target[key] = {};
            }
            target = target[key];
        }
        
        target[lastKey] = value;
    },
    
    // Check if feature is enabled
    isFeatureEnabled(featureName) {
        return this.get(`features.${featureName}`, false);
    },
    
    // Get localized message
    getMessage(key, language = null) {
        const lang = language || this.get('ui.language', 'vi');
        return this.get(`messages.${lang}.${key}`, key);
    },
    
    // Get API endpoint URL
    getApiUrl(endpoint) {
        const baseUrl = this.get('api.baseUrl', '');
        const endpointPath = this.get(`api.endpoints.${endpoint}`, '');
        return baseUrl + endpointPath;
    }
};

// Initialize configuration
document.addEventListener('DOMContentLoaded', () => {
    validateConfig();
    
    // Apply theme
    const theme = ConfigUtils.get('ui.theme', 'light');
    if (theme !== 'auto') {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Apply accessibility settings
    if (ConfigUtils.get('accessibility.reducedMotion', false)) {
        document.documentElement.style.setProperty('--transition-normal', 'none');
        document.documentElement.style.setProperty('--transition-fast', 'none');
    }
    
    if (ConfigUtils.get('accessibility.highContrast', false)) {
        document.documentElement.classList.add('high-contrast');
    }
    
    // Log configuration status
    if (ConfigUtils.get('development.debug', false)) {
        console.log('Activities Configuration loaded:', ActivitiesConfig);
    }
});

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ActivitiesConfig, ConfigUtils };
} else {
    window.ActivitiesConfig = ActivitiesConfig;
    window.ConfigUtils = ConfigUtils;
}
