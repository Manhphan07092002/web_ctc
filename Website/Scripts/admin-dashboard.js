// Admin Dashboard JavaScript
// Manages dashboard functionality, charts, and real-time updates

class AdminDashboard {
    constructor() {
        this.charts = {};
        this.updateInterval = null;
        this.apiBaseUrl = '/Admin';
        
        this.init();
    }

    init() {
        this.loadDashboardData();
        this.initializeCharts();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        this.loadRecentActivities();
    }

    // Load dashboard statistics
    async loadDashboardData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/GetDashboardStats`);
            const data = await response.json();
            
            this.updateStatistics(data);
            this.updateCharts(data);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Không thể tải dữ liệu dashboard');
        }
    }

    // Update statistics cards
    updateStatistics(data) {
        const elements = {
            totalActivities: document.getElementById('totalActivities'),
            totalNotifications: document.getElementById('totalNotifications'),
            totalEvents: document.getElementById('totalEvents'),
            activeActivities: document.getElementById('activeActivities')
        };

        if (elements.totalActivities) {
            this.animateNumber(elements.totalActivities, data.totalActivities || 0);
        }
        if (elements.totalNotifications) {
            this.animateNumber(elements.totalNotifications, data.totalNotifications || 0);
        }
        if (elements.totalEvents) {
            this.animateNumber(elements.totalEvents, data.totalEvents || 0);
        }
        if (elements.activeActivities) {
            const activeCount = data.recentActivities ? 
                data.recentActivities.filter(a => a.status === 'ongoing').length : 0;
            this.animateNumber(elements.activeActivities, activeCount);
        }

        // Update distribution percentages
        this.updateDistributionStats(data);
    }

    // Animate number counting
    animateNumber(element, targetValue, duration = 1000) {
        const startValue = parseInt(element.textContent) || 0;
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

    // Update distribution statistics
    updateDistributionStats(data) {
        const total = data.totalActivities || 1;
        const events = data.totalEvents || 0;
        const notifications = data.totalNotifications || 0;
        const activities = data.totalActivities - events - notifications || 0;
        const schedules = Math.max(0, total - events - notifications - activities);

        const percentages = {
            events: Math.round((events / total) * 100),
            notifications: Math.round((notifications / total) * 100),
            activities: Math.round((activities / total) * 100),
            schedules: Math.round((schedules / total) * 100)
        };

        // Update percentage displays
        const elements = {
            eventsPercent: document.getElementById('eventsPercent'),
            notificationsPercent: document.getElementById('notificationsPercent'),
            activitiesPercent: document.getElementById('activitiesPercent'),
            schedulesPercent: document.getElementById('schedulesPercent')
        };

        Object.keys(percentages).forEach(key => {
            const element = elements[key + 'Percent'];
            if (element) {
                element.textContent = percentages[key] + '%';
            }
        });

        // Update pie chart
        if (this.charts.typeDistribution) {
            this.charts.typeDistribution.data.datasets[0].data = [
                events, notifications, activities, schedules
            ];
            this.charts.typeDistribution.update();
        }
    }

    // Initialize charts
    initializeCharts() {
        this.initActivitiesChart();
        this.initTypeDistributionChart();
    }

    // Initialize main activities chart
    initActivitiesChart() {
        const ctx = document.getElementById('activitiesChart');
        if (!ctx) return;

        this.charts.activities = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.getLast7Days(),
                datasets: [{
                    label: 'Hoạt động mới',
                    data: [12, 19, 3, 5, 2, 3, 9],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Sự kiện',
                    data: [5, 8, 2, 3, 1, 2, 4],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Initialize type distribution chart
    initTypeDistributionChart() {
        const ctx = document.getElementById('typeDistributionChart');
        if (!ctx) return;

        this.charts.typeDistribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Sự kiện', 'Thông báo', 'Hoạt động', 'Lịch trình'],
                datasets: [{
                    data: [30, 25, 35, 10],
                    backgroundColor: [
                        '#2563eb',
                        '#f59e0b',
                        '#10b981',
                        '#ef4444'
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '70%'
            }
        });
    }

    // Get last 7 days labels
    getLast7Days() {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toLocaleDateString('vi-VN', { 
                month: 'short', 
                day: 'numeric' 
            }));
        }
        return days;
    }

    // Update charts with new data
    updateCharts(data) {
        // Update activities chart with real data if available
        if (data.monthlyStats && this.charts.activities) {
            // Process monthly stats for chart
            const chartData = this.processMonthlyStats(data.monthlyStats);
            this.charts.activities.data.datasets[0].data = chartData.activities;
            this.charts.activities.data.datasets[1].data = chartData.events;
            this.charts.activities.update();
        }
    }

    // Process monthly statistics for chart
    processMonthlyStats(monthlyStats) {
        const days = this.getLast7Days();
        const activities = new Array(7).fill(0);
        const events = new Array(7).fill(0);

        // Simulate data based on monthly stats
        monthlyStats.forEach(stat => {
            const randomDistribution = this.generateRandomDistribution(stat.count, 7);
            if (stat.type === 'activity') {
                activities.forEach((_, i) => activities[i] += randomDistribution[i]);
            } else if (stat.type === 'event') {
                events.forEach((_, i) => events[i] += randomDistribution[i]);
            }
        });

        return { activities, events };
    }

    // Generate random distribution for chart data
    generateRandomDistribution(total, days) {
        const distribution = new Array(days).fill(0);
        let remaining = total;

        for (let i = 0; i < days - 1; i++) {
            const max = Math.ceil(remaining / (days - i));
            const value = Math.floor(Math.random() * max);
            distribution[i] = value;
            remaining -= value;
        }
        distribution[days - 1] = remaining;

        return distribution;
    }

    // Load recent activities
    async loadRecentActivities() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/GetDashboardStats`);
            const data = await response.json();
            
            if (data.recentActivities) {
                this.renderRecentActivities(data.recentActivities);
            }
        } catch (error) {
            console.error('Error loading recent activities:', error);
        }
    }

    // Render recent activities list
    renderRecentActivities(activities) {
        const container = document.getElementById('recentActivities');
        if (!container) return;

        if (activities.length === 0) {
            container.innerHTML = '<p class="no-data">Chưa có hoạt động nào</p>';
            return;
        }

        container.innerHTML = activities.map(activity => `
            <div class="recent-item">
                <div class="recent-icon ${activity.type}">
                    <i class="${this.getTypeIcon(activity.type)}"></i>
                </div>
                <div class="recent-content">
                    <div class="recent-title">${activity.title}</div>
                    <div class="recent-meta">
                        ${this.formatDate(activity.date)} • ${this.getStatusLabel(activity.status)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Get icon for activity type
    getTypeIcon(type) {
        const icons = {
            'event': 'fas fa-calendar-check',
            'activity': 'fas fa-users',
            'notification': 'fas fa-bell',
            'schedule': 'fas fa-clock'
        };
        return icons[type] || 'fas fa-circle';
    }

    // Get status label
    getStatusLabel(status) {
        const labels = {
            'upcoming': 'Sắp tới',
            'ongoing': 'Đang diễn ra',
            'completed': 'Đã hoàn thành'
        };
        return labels[status] || status;
    }

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Chart period selector
        const chartPeriod = document.getElementById('chartPeriod');
        if (chartPeriod) {
            chartPeriod.addEventListener('change', (e) => {
                this.updateChartPeriod(e.target.value);
            });
        }

        // Refresh button (if exists)
        const refreshBtn = document.getElementById('refreshDashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboard();
            });
        }

        // Auto-refresh toggle (if exists)
        const autoRefreshToggle = document.getElementById('autoRefreshToggle');
        if (autoRefreshToggle) {
            autoRefreshToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.startRealTimeUpdates();
                } else {
                    this.stopRealTimeUpdates();
                }
            });
        }
    }

    // Update chart period
    updateChartPeriod(period) {
        let labels = [];
        
        switch (period) {
            case 'month':
                labels = this.getLast7Days();
                break;
            case 'quarter':
                labels = this.getLast12Weeks();
                break;
            case 'year':
                labels = this.getLast12Months();
                break;
        }

        if (this.charts.activities) {
            this.charts.activities.data.labels = labels;
            this.charts.activities.update();
        }
    }

    // Get last 12 weeks
    getLast12Weeks() {
        const weeks = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - (i * 7));
            weeks.push(`Tuần ${Math.ceil(date.getDate() / 7)}`);
        }
        return weeks;
    }

    // Get last 12 months
    getLast12Months() {
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            months.push(date.toLocaleDateString('vi-VN', { 
                month: 'short',
                year: '2-digit'
            }));
        }
        return months;
    }

    // Start real-time updates
    startRealTimeUpdates() {
        this.stopRealTimeUpdates(); // Clear existing interval
        
        this.updateInterval = setInterval(() => {
            this.loadDashboardData();
        }, 30000); // Update every 30 seconds
    }

    // Stop real-time updates
    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    // Refresh dashboard
    async refreshDashboard() {
        const refreshBtn = document.getElementById('refreshDashboard');
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang tải...';
        }

        try {
            await this.loadDashboardData();
            await this.loadRecentActivities();
            
            this.showSuccess('Dashboard đã được cập nhật');
        } catch (error) {
            this.showError('Không thể cập nhật dashboard');
        } finally {
            if (refreshBtn) {
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Làm mới';
            }
        }
    }

    // Show success message
    showSuccess(message) {
        this.showToast(message, 'success');
    }

    // Show error message
    showError(message) {
        this.showToast(message, 'error');
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `admin-toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;

        // Toast styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.remove();
        }, 5000);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }

    // Export dashboard data
    async exportDashboard() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/ExportDashboard`);
            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dashboard-export-${new Date().toISOString().split('T')[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            this.showSuccess('Đã xuất báo cáo thành công');
        } catch (error) {
            this.showError('Không thể xuất báo cáo');
        }
    }

    // Cleanup when page unloads
    destroy() {
        this.stopRealTimeUpdates();
        
        // Destroy charts
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
    }
}

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard = new AdminDashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (window.adminDashboard) {
        window.adminDashboard.destroy();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminDashboard;
}
