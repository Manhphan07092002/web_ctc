// Activities Page JavaScript
// Modern Activities & Events Management System

class ActivitiesManager {
    constructor() {
        this.currentFilter = 'all';
        this.currentMonth = new Date().getMonth();
        this.currentYear = new Date().getFullYear();
        this.activities = [];
        this.notifications = [];
        this.events = [];
        this.sortOrder = 'desc'; // 'asc' hoặc 'desc'
        this.sortBy = 'date'; // 'date', 'title', 'type'
        
        this.init();
    }

    async init() {
        try {
            // Load data first
            await this.loadSampleData();
            
            // Setup UI components
            this.setupEventListeners();
            this.setupAnimations();
            this.addSortingControls();
            this.renderCalendar();
            
            // Render data
            this.renderActivities();
            this.renderNotifications();
            this.renderTimeline();
            this.updateStats();
            
            // Add refresh button
            this.addRefreshButton();
        } catch (error) {
            console.error('Initialization error:', error);
            this.showToast('Có lỗi xảy ra khi khởi tạo trang', 'error');
        }
    }

    addRefreshButton() {
        const heroSection = document.querySelector('.activities-hero .hero-content');
        if (heroSection && !heroSection.querySelector('.refresh-button')) {
            const refreshButton = document.createElement('button');
            refreshButton.className = 'refresh-button';
            refreshButton.innerHTML = '<i class="fas fa-sync-alt"></i> Làm mới dữ liệu';
            refreshButton.style.cssText = `
                margin-top: var(--space-4);
                padding: var(--space-3) var(--space-6);
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: var(--radius-full);
                color: white;
                font-weight: 600;
                cursor: pointer;
                transition: var(--transition-normal);
                backdrop-filter: blur(10px);
            `;
            
            refreshButton.addEventListener('click', () => {
                this.refreshData();
            });
            
            refreshButton.addEventListener('mouseenter', () => {
                refreshButton.style.background = 'rgba(255, 255, 255, 0.3)';
                refreshButton.style.transform = 'translateY(-2px)';
            });
            
            refreshButton.addEventListener('mouseleave', () => {
                refreshButton.style.background = 'rgba(255, 255, 255, 0.2)';
                refreshButton.style.transform = 'translateY(0)';
            });
            
            heroSection.appendChild(refreshButton);
        }
    }

    async loadSampleData() {
        try {
            // Load activities from API
            await this.loadActivitiesFromAPI();
            await this.loadNotificationsFromAPI();
            await this.loadEventsFromAPI();
            await this.loadStatsFromAPI();
        } catch (error) {
            console.error('Error loading data from API:', error);
            // Fallback to sample data if API fails
            this.loadFallbackData();
        }
    }

    async loadActivitiesFromAPI() {
        try {
            const response = await fetch('/api/ActivitiesApi/GetActivities');
            const result = await response.json();
            
            if (result.success && result.data) {
                this.activities = result.data;
            } else {
                throw new Error('Failed to load activities');
            }
        } catch (error) {
            console.error('Error loading activities:', error);
            this.loadFallbackActivities();
        }
    }

    async loadNotificationsFromAPI() {
        try {
            const response = await fetch('/api/ActivitiesApi/GetNotifications');
            const result = await response.json();
            
            if (result.success && result.data) {
                this.notifications = result.data;
            } else {
                throw new Error('Failed to load notifications');
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.loadFallbackNotifications();
        }
    }

    async loadEventsFromAPI() {
        try {
            const response = await fetch('/api/ActivitiesApi/GetEvents');
            const result = await response.json();
            
            if (result.success && result.data) {
                this.events = result.data;
            } else {
                throw new Error('Failed to load events');
            }
        } catch (error) {
            console.error('Error loading events:', error);
            this.loadFallbackEvents();
        }
    }

    async loadStatsFromAPI() {
        try {
            const response = await fetch('/api/ActivitiesApi/GetStats');
            const result = await response.json();
            
            if (result.success && result.data) {
                this.stats = result.data;
                this.updateStatsDisplay();
            } else {
                throw new Error('Failed to load stats');
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    }

    loadFallbackData() {
        this.loadFallbackActivities();
        this.loadFallbackNotifications();
        this.loadFallbackEvents();
    }

    loadFallbackActivities() {
        // Minimal fallback data nếu API thất bại
        this.activities = [];
    }

    loadFallbackNotifications() {
        // Minimal fallback data nếu API thất bại
        this.notifications = [];
    }

    loadFallbackEvents() {
        // Minimal fallback data nếu API thất bại
        this.events = [];
    }

    updateStatsDisplay() {
        if (!this.stats) return;

        // Update stats in UI
        const statsElements = {
            totalActivities: document.querySelector('[data-stat="totalActivities"]'),
            totalEvents: document.querySelector('[data-stat="totalEvents"]'),
            totalNotifications: document.querySelector('[data-stat="totalNotifications"]'),
            upcomingActivities: document.querySelector('[data-stat="upcomingActivities"]')
        };

        Object.keys(statsElements).forEach(key => {
            const element = statsElements[key];
            if (element && this.stats[key] !== undefined) {
                this.animateCounter(element, this.stats[key]);
            }
        });
    }

    animateCounter(element, targetValue) {
        const startValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const increment = (targetValue - startValue) / (duration / 16);
        let currentValue = startValue;

        const timer = setInterval(() => {
            currentValue += increment;
            if ((increment > 0 && currentValue >= targetValue) || 
                (increment < 0 && currentValue <= targetValue)) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            element.textContent = Math.floor(currentValue);
        }, 16);
    }

    // Search activities from API
    async searchActivities(query) {
        try {
            this.showLoading();
            const response = await fetch(`/api/ActivitiesApi/Search?query=${encodeURIComponent(query)}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.activities = result.data;
                this.renderActivities();
                this.showSearchResults(query, result.data.length);
            } else {
                throw new Error('Search failed');
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showToast('Lỗi tìm kiếm. Vui lòng thử lại.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Filter activities from API
    async filterActivities(type) {
        try {
            this.showLoading();
            let url = '/api/ActivitiesApi/Filter?';
            
            if (type && type !== 'all') {
                url += `type=${encodeURIComponent(type)}`;
            }
            
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.activities = result.data;
                this.renderActivities();
            } else {
                throw new Error('Filter failed');
            }
        } catch (error) {
            console.error('Filter error:', error);
            this.showToast('Lỗi lọc dữ liệu. Vui lòng thử lại.', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Refresh data from API
    async refreshData() {
        try {
            this.showLoading();
            await this.loadSampleData();
            this.renderActivities();
            this.renderNotifications();
            this.renderTimeline();
            this.showToast('Dữ liệu đã được cập nhật', 'success');
        } catch (error) {
            console.error('Refresh error:', error);
            this.showToast('Không thể cập nhật dữ liệu', 'error');
        } finally {
            this.hideLoading();
        }
    }

    showLoading() {
        const container = document.querySelector('.activities-grid');
        if (container && !container.querySelector('.loading-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <span>Đang tải...</span>
                </div>
            `;
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 100;
                border-radius: var(--radius-xl);
            `;
            container.style.position = 'relative';
            container.appendChild(overlay);
        }
    }

    hideLoading() {
        const overlay = document.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    showSearchResults(query, count) {
        const message = count > 0 
            ? `Tìm thấy ${count} kết quả cho "${query}"`
            : `Không tìm thấy kết quả cho "${query}"`;
        this.showToast(message, count > 0 ? 'info' : 'warning');
    }

    // Override handleFilterChange to use API
    async handleFilterChange(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Safely add active class
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Filter using API
        await this.filterActivities(filter);
        
        this.renderActivities();
    }

    setupEventListeners() {
        // Filter buttons - Wait for DOM to be ready
        setTimeout(() => {
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const filter = e.target.dataset.filter || e.target.closest('.filter-btn')?.dataset.filter;
                    if (filter) {
                        this.handleFilterChange(filter);
                    }
                });
            });
        }, 100);

        // Calendar navigation
        const prevBtn = document.querySelector('.calendar-prev');
        const nextBtn = document.querySelector('.calendar-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentMonth--;
                if (this.currentMonth < 0) {
                    this.currentMonth = 11;
                    this.currentYear--;
                }
                this.renderCalendar();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentMonth++;
                if (this.currentMonth > 11) {
                    this.currentMonth = 0;
                    this.currentYear++;
                }
                this.renderCalendar();
            });
        }

        // Activity card interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-primary')) {
                e.preventDefault();
                const card = e.target.closest('.activity-card');
                const activityId = card?.dataset.id;
                if (activityId) {
                    this.showActivityDetails(activityId);
                }
            }
        });

        // Notification interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.notification-card')) {
                const card = e.target.closest('.notification-card');
                this.markNotificationAsRead(card.dataset.id);
            }
        });
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
            observer.observe(el);
        });

        // Stagger animation for cards
        const cards = document.querySelectorAll('.activity-card, .notification-card, .stat-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
            observer.observe(card);
        });
    }

    handleFilterChange(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Safely add active class
        const activeTab = document.querySelector(`[data-filter="${filter}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }
        
        // Re-render activities
        this.renderActivities();
    }

    renderActivities() {
        const container = document.querySelector('.activities-grid');
        if (!container) return;

        const filteredActivities = this.currentFilter === 'all' 
            ? this.activities 
            : this.activities.filter(activity => activity.type === this.currentFilter);

        container.innerHTML = filteredActivities.map(activity => `
            <div class="activity-card fade-in" data-id="${activity.id}" onclick="activitiesManager.showActivityPopup(${activity.id})">
                <div class="activity-image">
                    <img src="${activity.image}" alt="${activity.title}" class="activity-img">
                    <div class="activity-badge badge-${activity.type}">
                        ${this.getTypeLabel(activity.type)}
                    </div>
                    <div class="activity-date">
                        ${this.formatDate(activity.date)}
                    </div>
                </div>
                <div class="activity-content">
                    <h3 class="activity-title">${activity.title}</h3>
                    <p class="activity-description">${activity.description}</p>
                    <div class="activity-meta">
                        <div class="activity-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${activity.location}</span>
                        </div>
                        <div class="activity-time">
                            <i class="fas fa-clock"></i>
                            <span>${activity.time}</span>
                        </div>
                    </div>
                    <div class="activity-actions" onclick="event.stopPropagation()">
                        <button class="btn-primary" onclick="activitiesManager.showActivityPopup(${activity.id})">
                            <i class="fas fa-eye"></i>
                            Chi tiết
                        </button>
                        <button class="btn-secondary" onclick="activitiesManager.shareActivity(${activity.id})">
                            <i class="fas fa-share"></i>
                            Chia sẻ
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Re-setup animations for new elements
        setTimeout(() => {
            this.setupAnimations();
        }, 100);
    }

    renderNotifications() {
        const container = document.querySelector('.notifications-grid');
        if (!container) return;

        container.innerHTML = this.notifications.map(notification => `
            <div class="notification-card fade-in ${notification.read ? 'read' : ''}" data-id="${notification.id}" onclick="activitiesManager.showNotificationPopup(${notification.id})">
                <div class="notification-header">
                    <div class="notification-type">
                        <div class="notification-icon icon-${notification.type}">
                            <i class="${notification.icon}"></i>
                        </div>
                        <span>${this.getNotificationTypeLabel(notification.type)}</span>
                    </div>
                    <div class="notification-time">${notification.time}</div>
                </div>
                <h4 class="notification-title">${notification.title}</h4>
                <p class="notification-message">${notification.message}</p>
                ${!notification.read ? '<div class="notification-unread-dot"></div>' : ''}
            </div>
        `).join('');
    }

    renderTimeline() {
        const container = document.querySelector('.timeline-container');
        if (!container) return;

        const timelineHTML = `
            <div class="timeline-line"></div>
            ${this.events.map((event, index) => `
                <div class="timeline-item fade-in" style="animation-delay: ${index * 0.2}s">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">${this.formatDate(event.date)}</div>
                        <h4 class="timeline-title">${event.title}</h4>
                        <p class="timeline-description">${event.description}</p>
                    </div>
                </div>
            `).join('')}
        `;

        container.innerHTML = timelineHTML;
    }

    renderCalendar() {
        const container = document.querySelector('.calendar-grid');
        const titleElement = document.querySelector('.calendar-title');
        
        if (!container || !titleElement) return;

        const monthNames = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];

        const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

        titleElement.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;

        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        let calendarHTML = '';

        // Day headers
        dayNames.forEach(day => {
            calendarHTML += `<div class="calendar-day-header">${day}</div>`;
        });

        // Calendar days
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = currentDate.getMonth() === this.currentMonth;
            const dateString = currentDate.toISOString().split('T')[0];
            const hasEvent = this.activities.some(activity => activity.date === dateString);
            
            const dayEvents = this.activities.filter(activity => activity.date === dateString);
            
            calendarHTML += `
                <div class="calendar-day ${hasEvent ? 'has-event' : ''}" data-date="${dateString}">
                    <div class="day-number ${!isCurrentMonth ? 'text-muted' : ''}">${currentDate.getDate()}</div>
                    <div class="day-events">
                        ${dayEvents.slice(0, 2).map(event => `
                            <div class="day-event" title="${event.title}">
                                ${event.title.substring(0, 10)}...
                            </div>
                        `).join('')}
                        ${dayEvents.length > 2 ? `<div class="day-event">+${dayEvents.length - 2} khác</div>` : ''}
                    </div>
                </div>
            `;
        }

        container.innerHTML = calendarHTML;
    }

    updateStats() {
        const stats = {
            totalActivities: this.activities.length,
            upcomingEvents: this.activities.filter(a => a.status === 'upcoming').length,
            completedTasks: this.activities.filter(a => a.status === 'completed').length,
            activeNotifications: this.notifications.length
        };

        // Update stat numbers with animation
        Object.keys(stats).forEach(key => {
            const element = document.querySelector(`[data-stat="${key}"]`);
            if (element) {
                this.animateNumber(element, 0, stats[key], 1000);
            }
        });
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }

    showActivityDetails(activityId) {
        const activity = this.activities.find(a => a.id == activityId);
        if (!activity) return;

        // Create modal or navigate to details page
        const modal = document.createElement('div');
        modal.className = 'activity-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${activity.title}</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <img src="${activity.image}" alt="${activity.title}" class="modal-image">
                        <p><strong>Mô tả:</strong> ${activity.description}</p>
                        <p><strong>Ngày:</strong> ${this.formatDate(activity.date)}</p>
                        <p><strong>Thời gian:</strong> ${activity.time}</p>
                        <p><strong>Địa điểm:</strong> ${activity.location}</p>
                        <p><strong>Trạng thái:</strong> ${this.getStatusLabel(activity.status)}</p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-primary">Tham gia</button>
                        <button class="btn-secondary modal-close">Đóng</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close modal events
        modal.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
            el.addEventListener('click', (e) => {
                if (e.target === el) {
                    modal.remove();
                }
            });
        });

        // Animate modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
    }

    markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id == notificationId);
        if (notification) {
            notification.read = true;
            // Update UI or send to server
            console.log(`Notification ${notificationId} marked as read`);
        }
    }

    getTypeLabel(type) {
        const labels = {
            'activity': 'Hoạt động',
            'event': 'Sự kiện',
            'notification': 'Thông báo',
            'schedule': 'Lịch trình'
        };
        return labels[type] || type;
    }

    getNotificationTypeLabel(type) {
        const labels = {
            'info': 'Thông tin',
            'warning': 'Cảnh báo',
            'success': 'Thành công',
            'danger': 'Khẩn cấp'
        };
        return labels[type] || type;
    }

    getStatusLabel(status) {
        const labels = {
            'upcoming': 'Sắp diễn ra',
            'ongoing': 'Đang diễn ra',
            'completed': 'Đã hoàn thành'
        };
        return labels[status] || status;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Search functionality
    searchActivities(query) {
        const filteredActivities = this.activities.filter(activity =>
            activity.title.toLowerCase().includes(query.toLowerCase()) ||
            activity.description.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderFilteredActivities(filteredActivities);
    }

    renderFilteredActivities(activities) {
        const container = document.querySelector('.activities-grid');
        if (!container) return;

        if (activities.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>Không tìm thấy kết quả</h3>
                    <p>Thử tìm kiếm với từ khóa khác</p>
                </div>
            `;
            return;
        }

        container.innerHTML = activities.map(activity => `
            <div class="activity-card fade-in" data-id="${activity.id}">
                <div class="activity-image">
                    <img src="${activity.image}" alt="${activity.title}" class="activity-img">
                    <div class="activity-badge badge-${activity.type}">
                        ${this.getTypeLabel(activity.type)}
                    </div>
                    <div class="activity-date">
                        ${this.formatDate(activity.date)}
                    </div>
                </div>
                <div class="activity-content">
                    <h3 class="activity-title">${activity.title}</h3>
                    <p class="activity-description">${activity.description}</p>
                    <div class="activity-meta">
                        <div class="activity-location">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${activity.location}</span>
                        </div>
                        <div class="activity-time">
                            <i class="fas fa-clock"></i>
                            <span>${activity.time}</span>
                        </div>
                    </div>
                    <div class="activity-actions">
                        <a href="#" class="btn-primary">
                            <i class="fas fa-eye"></i>
                            Chi tiết
                        </a>
                        <a href="#" class="btn-secondary">
                            <i class="fas fa-share"></i>
                            Chia sẻ
                        </a>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Export functionality
    exportCalendar() {
        const calendarData = {
            month: this.currentMonth,
            year: this.currentYear,
            activities: this.activities,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(calendarData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `calendar-${this.currentYear}-${this.currentMonth + 1}.json`;
        link.click();
    }

    // Real-time updates simulation
    startRealTimeUpdates() {
        setInterval(() => {
            // Simulate new notifications
            if (Math.random() < 0.1) { // 10% chance every interval
                this.addNewNotification();
            }
        }, 30000); // Check every 30 seconds
    }

    addNewNotification() {
        const types = ['info', 'warning', 'success'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const newNotification = {
            id: Date.now(),
            type: randomType,
            title: "Thông báo mới",
            message: "Có cập nhật mới trong hệ thống.",
            time: "Vừa xong",
            icon: "fas fa-bell"
        };

        this.notifications.unshift(newNotification);
        this.renderNotifications();
        
        // Show toast notification
        this.showToast('Có thông báo mới!', 'info');
    }

    // Sorting functions
    sortActivities(sortBy = 'date', order = 'desc') {
        this.sortBy = sortBy;
        this.sortOrder = order;
        
        this.activities.sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case 'date':
                    comparison = new Date(a.date) - new Date(b.date);
                    break;
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'type':
                    comparison = a.type.localeCompare(b.type);
                    break;
                default:
                    comparison = new Date(a.date) - new Date(b.date);
            }
            
            return order === 'desc' ? -comparison : comparison;
        });
        
        this.renderActivities();
    }

    // Popup functions
    showActivityPopup(activityId) {
        const activity = this.activities.find(a => a.id === activityId);
        if (!activity) return;

        const popup = document.createElement('div');
        popup.className = 'activity-popup';
        popup.innerHTML = `
            <div class="popup-overlay" onclick="this.parentElement.remove()">
                <div class="popup-content" onclick="event.stopPropagation()">
                    <div class="popup-header">
                        <h2>${activity.title}</h2>
                        <button class="popup-close" onclick="this.closest('.activity-popup').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="popup-body">
                        <div class="popup-image">
                            <img src="${activity.image}" alt="${activity.title}" />
                        </div>
                        <div class="popup-details">
                            <div class="detail-row">
                                <i class="fas fa-calendar"></i>
                                <span><strong>Ngày:</strong> ${this.formatDate(activity.date)}</span>
                            </div>
                            <div class="detail-row">
                                <i class="fas fa-clock"></i>
                                <span><strong>Thời gian:</strong> ${activity.time}</span>
                            </div>
                            <div class="detail-row">
                                <i class="fas fa-map-marker-alt"></i>
                                <span><strong>Địa điểm:</strong> ${activity.location}</span>
                            </div>
                            <div class="detail-row">
                                <i class="fas fa-tag"></i>
                                <span><strong>Loại:</strong> ${this.getTypeLabel(activity.type)}</span>
                            </div>
                            <div class="detail-row">
                                <i class="fas fa-info-circle"></i>
                                <span><strong>Trạng thái:</strong> ${this.getStatusLabel(activity.status)}</span>
                            </div>
                            <div class="detail-description">
                                <h4>Mô tả chi tiết:</h4>
                                <p>${activity.description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="popup-footer">
                        <button class="btn-secondary" onclick="this.closest('.activity-popup').remove()">
                            Đóng
                        </button>
                        <button class="btn-primary" onclick="activitiesManager.addToCalendar(${activity.id})">
                            <i class="fas fa-calendar-plus"></i>
                            Thêm vào lịch
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        
        // Add animation
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
    }

    showNotificationPopup(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (!notification) return;

        const popup = document.createElement('div');
        popup.className = 'notification-popup';
        popup.innerHTML = `
            <div class="popup-overlay" onclick="this.parentElement.remove()">
                <div class="popup-content" onclick="event.stopPropagation()">
                    <div class="popup-header">
                        <div class="notification-header">
                            <i class="${notification.icon} notification-icon ${notification.type}"></i>
                            <h2>${notification.title}</h2>
                        </div>
                        <button class="popup-close" onclick="this.closest('.notification-popup').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="popup-body">
                        <div class="notification-details">
                            <div class="detail-row">
                                <i class="fas fa-clock"></i>
                                <span><strong>Thời gian:</strong> ${notification.time}</span>
                            </div>
                            <div class="detail-row">
                                <i class="fas fa-tag"></i>
                                <span><strong>Loại:</strong> ${this.getNotificationTypeLabel(notification.type)}</span>
                            </div>
                            <div class="notification-message">
                                <h4>Nội dung:</h4>
                                <p>${notification.message}</p>
                            </div>
                        </div>
                    </div>
                    <div class="popup-footer">
                        <button class="btn-secondary" onclick="this.closest('.notification-popup').remove()">
                            Đóng
                        </button>
                        <button class="btn-primary" onclick="activitiesManager.markAsRead(${notification.id})">
                            <i class="fas fa-check"></i>
                            Đánh dấu đã đọc
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(popup);
        
        // Add animation
        setTimeout(() => {
            popup.classList.add('show');
        }, 10);
    }

    // Helper functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getTypeLabel(type) {
        const labels = {
            'event': 'Sự kiện',
            'activity': 'Hoạt động',
            'notification': 'Thông báo',
            'schedule': 'Lịch trình'
        };
        return labels[type] || type;
    }

    getStatusLabel(status) {
        const labels = {
            'upcoming': 'Sắp tới',
            'ongoing': 'Đang diễn ra',
            'completed': 'Đã hoàn thành'
        };
        return labels[status] || status;
    }

    getNotificationTypeLabel(type) {
        const labels = {
            'info': 'Thông tin',
            'warning': 'Cảnh báo',
            'success': 'Thành công',
            'danger': 'Khẩn cấp'
        };
        return labels[type] || type;
    }

    addToCalendar(activityId) {
        const activity = this.activities.find(a => a.id === activityId);
        if (!activity) return;

        // Create calendar event
        const event = {
            title: activity.title,
            start: new Date(activity.date + 'T' + activity.time),
            description: activity.description,
            location: activity.location
        };

        // For demo purposes, show success message
        this.showToast('Đã thêm vào lịch thành công!', 'success');
        
        // Close popup
        document.querySelector('.activity-popup')?.remove();
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.renderNotifications();
            this.showToast('Đã đánh dấu thông báo là đã đọc', 'success');
        }
        
        // Close popup
        document.querySelector('.notification-popup')?.remove();
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;

        document.body.appendChild(toast);

        // Show toast
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.remove();
        }, 5000);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }

    // Share activity function
    shareActivity(activityId) {
        const activity = this.activities.find(a => a.id === activityId);
        if (!activity) return;

        if (navigator.share) {
            navigator.share({
                title: activity.title,
                text: activity.description,
                url: window.location.href + '#activity-' + activityId
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const shareText = `${activity.title}\n${activity.description}\n${window.location.href}#activity-${activityId}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('Đã sao chép link chia sẻ!', 'success');
            });
        }
    }

    // Add sorting controls to the page
    addSortingControls() {
        const filterSection = document.querySelector('.filter-section .container');
        if (!filterSection) return;

        const sortingHTML = `
            <div class="sorting-controls fade-in">
                <div class="sort-group">
                    <label class="sort-label">Sắp xếp theo:</label>
                    <select class="sort-select" id="sortBy" onchange="activitiesManager.handleSortChange()">
                        <option value="date">Thời gian</option>
                        <option value="title">Tên</option>
                        <option value="type">Loại</option>
                    </select>
                </div>
                <div class="sort-group">
                    <label class="sort-label">Thứ tự:</label>
                    <select class="sort-select" id="sortOrder" onchange="activitiesManager.handleSortChange()">
                        <option value="desc">Mới nhất</option>
                        <option value="asc">Cũ nhất</option>
                    </select>
                </div>
                <button class="sort-reset-btn" onclick="activitiesManager.resetSort()">
                    <i class="fas fa-undo"></i>
                    Đặt lại
                </button>
            </div>
        `;

        // Insert after filter tabs
        const filterTabs = filterSection.querySelector('.filter-tabs');
        if (filterTabs) {
            filterTabs.insertAdjacentHTML('afterend', sortingHTML);
        }
    }

    handleSortChange() {
        const sortBy = document.getElementById('sortBy').value;
        const sortOrder = document.getElementById('sortOrder').value;
        this.sortActivities(sortBy, sortOrder);
    }

    resetSort() {
        document.getElementById('sortBy').value = 'date';
        document.getElementById('sortOrder').value = 'desc';
        this.sortActivities('date', 'desc');
        this.showToast('Đã đặt lại sắp xếp', 'info');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const activitiesManager = new ActivitiesManager();
    
    // Make it globally available for debugging
    window.activitiesManager = activitiesManager;
    
    // Start real-time updates
    activitiesManager.startRealTimeUpdates();
});

// Additional utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ActivitiesManager;
}
