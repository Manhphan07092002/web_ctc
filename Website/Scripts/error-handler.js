// Global Error Handler for Activities Page
// Handles JavaScript errors gracefully and provides fallback functionality

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 10;
        this.init();
    }

    init() {
        this.setupGlobalErrorHandling();
        this.setupUnhandledRejectionHandling();
        this.setupConsoleErrorCapture();
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'JavaScript Error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error,
                timestamp: new Date().toISOString()
            });

            // Prevent default browser error handling for specific errors
            if (this.shouldSuppressError(event.message)) {
                event.preventDefault();
                return false;
            }
        });
    }

    setupUnhandledRejectionHandling() {
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'Unhandled Promise Rejection',
                message: event.reason?.message || 'Unknown promise rejection',
                reason: event.reason,
                timestamp: new Date().toISOString()
            });

            // Prevent unhandled rejection from appearing in console
            if (this.shouldSuppressRejection(event.reason)) {
                event.preventDefault();
            }
        });
    }

    setupConsoleErrorCapture() {
        const originalConsoleError = console.error;
        console.error = (...args) => {
            // Log to our error handler
            this.logError({
                type: 'Console Error',
                message: args.join(' '),
                args: args,
                timestamp: new Date().toISOString()
            });

            // Call original console.error
            originalConsoleError.apply(console, args);
        };
    }

    logError(errorInfo) {
        // Add to errors array
        this.errors.push(errorInfo);
        
        // Keep only recent errors
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Handle specific error types
        this.handleSpecificErrors(errorInfo);

        // Send to analytics if available
        this.sendToAnalytics(errorInfo);
    }

    handleSpecificErrors(errorInfo) {
        const message = errorInfo.message?.toLowerCase() || '';

        // Handle DOM-related errors
        if (message.includes('cannot read properties of null')) {
            this.handleDOMError(errorInfo);
        }

        // Handle network errors
        if (message.includes('failed to load resource') || message.includes('404')) {
            this.handleNetworkError(errorInfo);
        }

        // Handle extension-related errors
        if (message.includes('message port closed') || message.includes('extension')) {
            this.handleExtensionError(errorInfo);
        }

        // Handle module loading errors
        if (message.includes('module') || message.includes('import')) {
            this.handleModuleError(errorInfo);
        }
    }

    handleDOMError(errorInfo) {
        console.warn('DOM Error detected, implementing fallback:', errorInfo.message);
        
        // Retry DOM operations after a delay
        setTimeout(() => {
            this.retryDOMOperations();
        }, 500);
    }

    handleNetworkError(errorInfo) {
        console.warn('Network Error detected:', errorInfo.message);
        
        // Show user-friendly message
        this.showUserMessage('Một số tài nguyên không thể tải. Trang web vẫn hoạt động bình thường.', 'warning');
    }

    handleExtensionError(errorInfo) {
        // Browser extension errors - usually safe to ignore
        console.info('Browser extension error (safe to ignore):', errorInfo.message);
    }

    handleModuleError(errorInfo) {
        console.warn('Module loading error:', errorInfo.message);
        
        // Try to load fallback functionality
        this.loadFallbackModules();
    }

    retryDOMOperations() {
        // Retry common DOM operations that might have failed
        try {
            // Re-initialize filter tabs if they exist
            const filterTabs = document.querySelectorAll('.filter-tab');
            if (filterTabs.length > 0 && window.activitiesManager) {
                filterTabs.forEach(tab => {
                    if (!tab.hasAttribute('data-error-handler-attached')) {
                        tab.addEventListener('click', (e) => {
                            const filter = e.target.dataset.filter || e.target.closest('.filter-tab')?.dataset.filter;
                            if (filter && window.activitiesManager.handleFilterChange) {
                                window.activitiesManager.handleFilterChange(filter);
                            }
                        });
                        tab.setAttribute('data-error-handler-attached', 'true');
                    }
                });
            }

            // Re-initialize other critical elements
            this.initializeCriticalElements();
        } catch (error) {
            console.warn('Retry DOM operations failed:', error);
        }
    }

    initializeCriticalElements() {
        // Ensure activities grid exists
        if (!document.querySelector('.activities-grid')) {
            const filterSection = document.querySelector('.filter-section .container');
            if (filterSection) {
                const grid = document.createElement('div');
                grid.className = 'activities-grid scroll-reveal';
                filterSection.appendChild(grid);
            }
        }

        // Ensure stats grid exists
        if (!document.querySelector('.stats-grid')) {
            const statsSection = document.querySelector('.stats-section .container');
            if (statsSection) {
                const grid = document.createElement('div');
                grid.className = 'stats-grid scroll-reveal';
                statsSection.appendChild(grid);
            }
        }
    }

    loadFallbackModules() {
        // Load basic functionality if advanced modules fail
        if (!window.activitiesManager) {
            console.warn('Loading fallback activities manager...');
            this.createFallbackManager();
        }
    }

    createFallbackManager() {
        // Create a basic activities manager if the main one fails
        window.activitiesManager = {
            activities: [],
            currentFilter: 'all',
            
            handleFilterChange: function(filter) {
                this.currentFilter = filter;
                console.log('Fallback filter change:', filter);
            },
            
            renderActivities: function() {
                const container = document.querySelector('.activities-grid');
                if (container) {
                    container.innerHTML = '<p>Đang tải hoạt động...</p>';
                }
            },
            
            showToast: function(message, type = 'info') {
                console.log(`Toast (${type}):`, message);
            }
        };
    }

    showUserMessage(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = `error-handler-toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            font-size: 14px;
            line-height: 1.4;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);

        // Manual close on click
        toast.addEventListener('click', () => {
            toast.remove();
        });
    }

    shouldSuppressError(message) {
        const suppressPatterns = [
            'message port closed',
            'extension',
            'chrome-extension',
            'moz-extension',
            'Non-Error promise rejection captured'
        ];

        return suppressPatterns.some(pattern => 
            message?.toLowerCase().includes(pattern.toLowerCase())
        );
    }

    shouldSuppressRejection(reason) {
        const reasonStr = reason?.toString()?.toLowerCase() || '';
        return this.shouldSuppressError(reasonStr);
    }

    sendToAnalytics(errorInfo) {
        // Send error to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: errorInfo.message,
                fatal: false
            });
        }

        // Send to custom analytics endpoint if available
        if (window.customAnalytics) {
            window.customAnalytics.trackError(errorInfo);
        }
    }

    getErrorReport() {
        return {
            errors: this.errors,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
    }

    clearErrors() {
        this.errors = [];
    }

    // Public method to manually report errors
    reportError(error, context = '') {
        this.logError({
            type: 'Manual Report',
            message: error.message || error,
            context: context,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
    }
}

// Initialize error handler immediately
const errorHandler = new ErrorHandler();

// Make it globally available
window.errorHandler = errorHandler;

// Add some helpful debugging functions
window.debugActivities = function() {
    console.log('Activities Manager:', window.activitiesManager);
    console.log('Modern UI:', window.modernUI);
    console.log('Error Report:', errorHandler.getErrorReport());
    console.log('DOM Elements:', {
        filterTabs: document.querySelectorAll('.filter-tab').length,
        activitiesGrid: !!document.querySelector('.activities-grid'),
        statsGrid: !!document.querySelector('.stats-grid')
    });
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}
