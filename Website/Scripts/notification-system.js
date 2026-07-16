// Advanced Notification System
class NotificationSystem {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.init();
    }

    init() {
        this.createContainer();
        this.setupStyles();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notification-container';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }

    setupStyles() {
        if (document.getElementById('notification-styles')) return;

        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                width: 100%;
            }

            .notification {
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.12);
                margin-bottom: 12px;
                overflow: hidden;
                transform: translateX(100%);
                opacity: 0;
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border-left: 4px solid #667eea;
                backdrop-filter: blur(10px);
            }

            .notification.show {
                transform: translateX(0);
                opacity: 1;
            }

            .notification.hide {
                transform: translateX(100%);
                opacity: 0;
                margin-bottom: 0;
                max-height: 0;
            }

            .notification-header {
                padding: 16px 20px 12px;
                display: flex;
                align-items: center;
                gap: 12px;
                border-bottom: 1px solid #f1f3f4;
            }

            .notification-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: white;
                flex-shrink: 0;
            }

            .notification-content {
                flex: 1;
            }

            .notification-title {
                font-weight: 600;
                font-size: 14px;
                color: #1a202c;
                margin: 0 0 4px 0;
            }

            .notification-message {
                font-size: 13px;
                color: #4a5568;
                margin: 0;
                line-height: 1.4;
            }

            .notification-close {
                background: none;
                border: none;
                color: #a0aec0;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s;
                flex-shrink: 0;
            }

            .notification-close:hover {
                background: #f7fafc;
                color: #4a5568;
            }

            .notification-progress {
                height: 3px;
                background: #f1f3f4;
                overflow: hidden;
            }

            .notification-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #667eea, #764ba2);
                width: 100%;
                transform: translateX(-100%);
                animation: progress linear;
            }

            .notification.success {
                border-left-color: #48bb78;
            }

            .notification.success .notification-icon {
                background: #48bb78;
            }

            .notification.error {
                border-left-color: #f56565;
            }

            .notification.error .notification-icon {
                background: #f56565;
            }

            .notification.warning {
                border-left-color: #ed8936;
            }

            .notification.warning .notification-icon {
                background: #ed8936;
            }

            .notification.info {
                border-left-color: #4299e1;
            }

            .notification.info .notification-icon {
                background: #4299e1;
            }

            @keyframes progress {
                from { transform: translateX(-100%); }
                to { transform: translateX(0); }
            }

            @media (max-width: 480px) {
                .notification-container {
                    left: 10px;
                    right: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    show(options) {
        const notification = this.createNotification(options);
        this.notifications.push(notification);
        this.container.appendChild(notification.element);

        // Trigger show animation
        requestAnimationFrame(() => {
            notification.element.classList.add('show');
        });

        // Auto hide if duration is set
        if (options.duration !== 0) {
            const duration = options.duration || 5000;
            notification.progressBar.style.animationDuration = `${duration}ms`;
            
            notification.timeout = setTimeout(() => {
                this.hide(notification.id);
            }, duration);
        }

        return notification.id;
    }

    createNotification(options) {
        const id = 'notification_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        const type = options.type || 'info';
        
        const element = document.createElement('div');
        element.className = `notification ${type}`;
        element.dataset.id = id;

        const icon = this.getIcon(type);
        
        element.innerHTML = `
            <div class="notification-header">
                <div class="notification-icon">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${options.title || this.getDefaultTitle(type)}</div>
                    <div class="notification-message">${options.message}</div>
                </div>
                <button class="notification-close" onclick="notificationSystem.hide('${id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            ${options.duration !== 0 ? '<div class="notification-progress"><div class="notification-progress-bar"></div></div>' : ''}
        `;

        const progressBar = element.querySelector('.notification-progress-bar');

        return {
            id,
            element,
            progressBar,
            timeout: null,
            options
        };
    }

    hide(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (!notification) return;

        // Clear timeout
        if (notification.timeout) {
            clearTimeout(notification.timeout);
        }

        // Hide animation
        notification.element.classList.add('hide');
        
        setTimeout(() => {
            if (notification.element.parentNode) {
                notification.element.parentNode.removeChild(notification.element);
            }
            this.notifications = this.notifications.filter(n => n.id !== id);
        }, 400);
    }

    hideAll() {
        this.notifications.forEach(notification => {
            this.hide(notification.id);
        });
    }

    getIcon(type) {
        const icons = {
            success: 'fa-check',
            error: 'fa-exclamation-triangle',
            warning: 'fa-exclamation',
            info: 'fa-info'
        };
        return icons[type] || icons.info;
    }

    getDefaultTitle(type) {
        const titles = {
            success: 'Thành công',
            error: 'Lỗi',
            warning: 'Cảnh báo',
            info: 'Thông tin'
        };
        return titles[type] || titles.info;
    }

    // Convenience methods
    success(message, options = {}) {
        return this.show({
            type: 'success',
            message,
            ...options
        });
    }

    error(message, options = {}) {
        return this.show({
            type: 'error',
            message,
            duration: 0, // Don't auto-hide errors
            ...options
        });
    }

    warning(message, options = {}) {
        return this.show({
            type: 'warning',
            message,
            ...options
        });
    }

    info(message, options = {}) {
        return this.show({
            type: 'info',
            message,
            ...options
        });
    }

    // Activity-specific notifications
    activityCreated(title) {
        return this.success(`Hoạt động "${title}" đã được tạo thành công`, {
            title: 'Tạo hoạt động',
            duration: 4000
        });
    }

    activityUpdated(title) {
        return this.success(`Hoạt động "${title}" đã được cập nhật`, {
            title: 'Cập nhật hoạt động',
            duration: 4000
        });
    }

    activityDeleted(count = 1) {
        const message = count === 1 
            ? 'Hoạt động đã được xóa' 
            : `${count} hoạt động đã được xóa`;
        return this.success(message, {
            title: 'Xóa hoạt động',
            duration: 3000
        });
    }

    bulkActionCompleted(action, count) {
        const actions = {
            publish: 'xuất bản',
            unpublish: 'hủy xuất bản',
            feature: 'đánh dấu nổi bật',
            unfeature: 'bỏ đánh dấu nổi bật'
        };
        
        return this.success(`Đã ${actions[action]} ${count} hoạt động`, {
            title: 'Thao tác hàng loạt',
            duration: 3000
        });
    }

    exportCompleted(filename, count) {
        return this.success(`Đã xuất ${count} hoạt động vào file ${filename}`, {
            title: 'Xuất dữ liệu',
            duration: 4000
        });
    }

    uploadProgress(filename, progress) {
        const id = 'upload_' + filename.replace(/[^a-zA-Z0-9]/g, '_');
        
        if (progress === 100) {
            this.hide(id);
            return this.success(`File "${filename}" đã được tải lên thành công`, {
                title: 'Tải file',
                duration: 3000
            });
        }
        
        return this.show({
            type: 'info',
            title: 'Đang tải file',
            message: `${filename} - ${progress}%`,
            duration: 0
        });
    }
}

// Initialize global notification system
const notificationSystem = new NotificationSystem();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSystem;
}
