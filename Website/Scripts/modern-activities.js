// Modern Activities JavaScript - Kết nối với SQL Database
// Dành cho trang hoạt động của Công ty CP Xây lắp Bưu điện Miền Trung

document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo Activities Manager
    const activitiesManager = new ModernActivitiesManager();
    activitiesManager.init();
});

class ModernActivitiesManager {
    constructor() {
        this.currentFilter = 'all';
        this.activities = [];
        this.isLoading = false;
        this.apiBase = '/api/ActivitiesApi';
    }

    async init() {
        try {
            // Thiết lập event listeners
            this.setupEventListeners();
            
            // Tải dữ liệu từ API
            await this.loadActivities();
            
            // Render giao diện
            this.renderActivities();
            
            // Thiết lập animations
            this.setupAnimations();
            
            console.log('Modern Activities Manager initialized successfully');
        } catch (error) {
            console.error('Error initializing Modern Activities Manager:', error);
            this.showError('Không thể tải dữ liệu hoạt động');
        }
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const filter = btn.getAttribute('data-filter');
                this.handleFilterChange(filter);
            });
        });

        // Load more button
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadMoreActivities();
            });
        }

        // Activity card interactions
        document.addEventListener('click', (e) => {
            // Chi tiết hoạt động
            if (e.target.closest('.activity-link') || e.target.closest('.featured-link') || e.target.closest('.event-link')) {
                e.preventDefault();
                const card = e.target.closest('.activity-card, .featured-main-card, .event-card, .news-card, .training-card');
                if (card) {
                    const activityId = this.extractActivityId(card);
                    if (activityId) {
                        this.showActivityDetail(activityId);
                    }
                }
            }
        });

        // Search functionality
        const searchInput = document.querySelector('#activitySearch');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchActivities(e.target.value);
                }, 500);
            });
        }
    }

    async loadActivities() {
        try {
            this.showLoading();
            const response = await fetch(`${this.apiBase}/GetActivities`);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.activities = result.data;
                console.log('Loaded activities:', this.activities.length);
            } else {
                throw new Error('Failed to load activities');
            }
        } catch (error) {
            console.error('Error loading activities:', error);
            this.showError('Không thể tải danh sách hoạt động');
        } finally {
            this.hideLoading();
        }
    }

    async handleFilterChange(filter) {
        try {
            this.currentFilter = filter;
            
            // Cập nhật active state
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
            
            // Lọc dữ liệu
            await this.filterActivities(filter);
            
        } catch (error) {
            console.error('Error handling filter change:', error);
            this.showError('Lỗi khi lọc dữ liệu');
        }
    }

    async filterActivities(type) {
        try {
            this.showLoading();
            
            let url = `${this.apiBase}/Filter`;
            if (type && type !== 'all') {
                url += `?type=${encodeURIComponent(type)}`;
            }
            
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.activities = result.data;
                this.renderActivities();
                
                // Hiển thị thông báo kết quả
                const count = result.data.length;
                const typeLabel = this.getTypeLabel(type);
                this.showToast(`Tìm thấy ${count} ${typeLabel}`, 'info');
            } else {
                throw new Error('Filter failed');
            }
        } catch (error) {
            console.error('Error filtering activities:', error);
            this.showError('Lỗi khi lọc dữ liệu');
        } finally {
            this.hideLoading();
        }
    }

    async searchActivities(query) {
        try {
            if (!query.trim()) {
                await this.loadActivities();
                this.renderActivities();
                return;
            }
            
            this.showLoading();
            const response = await fetch(`${this.apiBase}/Search?query=${encodeURIComponent(query)}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.activities = result.data;
                this.renderActivities();
                
                const count = result.data.length;
                this.showToast(`Tìm thấy ${count} kết quả cho "${query}"`, 'info');
            } else {
                throw new Error('Search failed');
            }
        } catch (error) {
            console.error('Error searching activities:', error);
            this.showError('Lỗi khi tìm kiếm');
        } finally {
            this.hideLoading();
        }
    }

    renderActivities() {
        const container = document.querySelector('.activities-container') || document.querySelector('.activities-grid');
        if (!container) {
            console.warn('Activities container not found');
            return;
        }

        if (!this.activities || this.activities.length === 0) {
            container.innerHTML = this.getEmptyStateHTML();
            return;
        }

        // Render các hoạt động
        container.innerHTML = this.activities.map(activity => {
            return this.getActivityCardHTML(activity);
        }).join('');

        // Thiết lập animations cho các card mới
        this.setupCardAnimations();
    }

    getActivityCardHTML(activity) {
        const typeClass = this.getTypeClass(activity.type);
        const statusClass = this.getStatusClass(activity.statusText);
        
        return `
            <article class="activity-card modern fade-in-up" data-category="${activity.type}" data-id="${activity.id}">
                <div class="card-header-modern">
                    <div class="card-icon ${typeClass}">
                        <i class="${this.getTypeIcon(activity.type)}"></i>
                    </div>
                    <div class="card-badge">${activity.typeLabel}</div>
                </div>
                <div class="activity-content-modern">
                    <h3 class="activity-title-modern">
                        <a href="#" class="activity-link">${activity.title}</a>
                    </h3>
                    <p class="activity-excerpt-modern">
                        ${activity.description ? activity.description.substring(0, 150) + (activity.description.length > 150 ? '...' : '') : ''}
                    </p>
                    
                    ${activity.startDate ? `
                        <div class="activity-date-info">
                            <i class="fas fa-calendar"></i>
                            <span>${activity.formattedStartDate}</span>
                            ${activity.formattedEndDate ? ` - ${activity.formattedEndDate}` : ''}
                        </div>
                    ` : ''}
                    
                    ${activity.location ? `
                        <div class="activity-location-info">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${activity.location}</span>
                        </div>
                    ` : ''}
                    
                    ${activity.participants ? `
                        <div class="activity-participants-info">
                            <i class="fas fa-users"></i>
                            <span>${activity.participants} người tham gia</span>
                        </div>
                    ` : ''}
                    
                    <div class="activity-meta-modern">
                        <span class="meta-item">
                            <i class="fas fa-eye"></i>
                            ${activity.viewCount || 0} lượt xem
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-clock"></i>
                            ${activity.relativeTime}
                        </span>
                        <span class="meta-item status-${statusClass}">
                            <i class="fas fa-circle"></i>
                            ${activity.statusText}
                        </span>
                    </div>
                </div>
            </article>
        `;
    }

    getEmptyStateHTML() {
        return `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-calendar-times"></i>
                </div>
                <h3>Không có hoạt động nào</h3>
                <p>Hiện tại không có hoạt động nào phù hợp với bộ lọc của bạn.</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-refresh"></i>
                    Tải lại trang
                </button>
            </div>
        `;
    }

    async showActivityDetail(activityId) {
        try {
            this.showLoading();
            const response = await fetch(`${this.apiBase}/GetActivityDetail/${activityId}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                this.displayActivityModal(result.data);
            } else {
                throw new Error('Failed to load activity detail');
            }
        } catch (error) {
            console.error('Error loading activity detail:', error);
            this.showError('Không thể tải chi tiết hoạt động');
        } finally {
            this.hideLoading();
        }
    }

    displayActivityModal(activity) {
        // Tạo modal hiển thị chi tiết hoạt động
        const modal = document.createElement('div');
        modal.className = 'activity-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${activity.title}</h2>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${activity.image ? `<img src="${activity.image}" alt="${activity.title}" class="modal-image">` : ''}
                    
                    <div class="modal-info">
                        <p><strong>Loại:</strong> ${activity.typeLabel}</p>
                        <p><strong>Trạng thái:</strong> ${activity.statusText}</p>
                        ${activity.formattedStartDate ? `<p><strong>Ngày bắt đầu:</strong> ${activity.formattedStartDate}</p>` : ''}
                        ${activity.formattedEndDate ? `<p><strong>Ngày kết thúc:</strong> ${activity.formattedEndDate}</p>` : ''}
                        ${activity.location ? `<p><strong>Địa điểm:</strong> ${activity.location}</p>` : ''}
                        ${activity.participants ? `<p><strong>Số người tham gia:</strong> ${activity.participants}</p>` : ''}
                        <p><strong>Lượt xem:</strong> ${activity.viewCount}</p>
                    </div>
                    
                    <div class="modal-description">
                        <h4>Mô tả chi tiết</h4>
                        <p>${activity.description || 'Không có mô tả chi tiết.'}</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Event listeners cho modal
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.modal-overlay').addEventListener('click', () => {
            modal.remove();
        });

        // Escape key để đóng modal
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }

    setupAnimations() {
        // Intersection Observer cho scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe tất cả các elements có class fade-in-up
        document.querySelectorAll('.fade-in-up').forEach(el => {
            observer.observe(el);
        });
    }

    setupCardAnimations() {
        // Stagger animation cho các cards
        const cards = document.querySelectorAll('.activity-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Utility methods
    extractActivityId(element) {
        return element.getAttribute('data-id') || element.dataset.id;
    }

    getTypeClass(type) {
        const typeMap = {
            'news': 'news',
            'events': 'events', 
            'training': 'training',
            'projects': 'projects'
        };
        return typeMap[type] || 'default';
    }

    getStatusClass(status) {
        if (!status) return 'default';
        
        if (status.includes('Sắp diễn ra')) return 'upcoming';
        if (status.includes('Đang diễn ra')) return 'ongoing';
        if (status.includes('Đã kết thúc')) return 'completed';
        if (status.includes('Đang hoạt động')) return 'active';
        
        return 'default';
    }

    getTypeIcon(type) {
        const iconMap = {
            'news': 'fas fa-newspaper',
            'events': 'fas fa-calendar-alt',
            'training': 'fas fa-graduation-cap',
            'projects': 'fas fa-building'
        };
        return iconMap[type] || 'fas fa-calendar';
    }

    getTypeLabel(type) {
        const labelMap = {
            'all': 'hoạt động',
            'news': 'tin tức',
            'events': 'sự kiện',
            'training': 'khóa đào tạo',
            'projects': 'dự án'
        };
        return labelMap[type] || 'hoạt động';
    }

    // UI feedback methods
    showLoading() {
        if (this.isLoading) return;
        this.isLoading = true;
        
        const container = document.querySelector('.activities-container') || document.querySelector('.activities-grid');
        if (container) {
            container.style.opacity = '0.6';
            container.style.pointerEvents = 'none';
        }
    }

    hideLoading() {
        this.isLoading = false;
        
        const container = document.querySelector('.activities-container') || document.querySelector('.activities-grid');
        if (container) {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';
        }
    }

    showToast(message, type = 'info') {
        // Tạo toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getToastIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Thêm styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getToastColor(type)};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    getToastIcon(type) {
        const iconMap = {
            'info': 'info-circle',
            'success': 'check-circle',
            'warning': 'exclamation-triangle',
            'error': 'times-circle'
        };
        return iconMap[type] || 'info-circle';
    }

    getToastColor(type) {
        const colorMap = {
            'info': '#3498db',
            'success': '#2ecc71',
            'warning': '#f39c12',
            'error': '#e74c3c'
        };
        return colorMap[type] || '#3498db';
    }
}

// Export cho sử dụng global
window.ModernActivitiesManager = ModernActivitiesManager;
