// Advanced Activities Features JavaScript
// Extended functionality for the activities page

class AdvancedActivitiesManager extends ActivitiesManager {
    constructor() {
        super();
        this.chatMessages = [];
        this.uploadedFiles = [];
        this.teamMembers = [];
        this.charts = {};
        this.activityFeed = [];
        
        this.initAdvancedFeatures();
    }

    initAdvancedFeatures() {
        this.setupLiveChat();
        this.setupAdvancedSearch();
        this.setupFileUpload();
        this.setupTeamCollaboration();
        this.setupDataVisualization();
        this.setupActivityFeed();
        this.setupManagementDashboard();
        this.loadAdvancedData();
    }

    // Live Chat System
    setupLiveChat() {
        const chatWidget = document.createElement('div');
        chatWidget.className = 'live-chat-widget';
        chatWidget.innerHTML = `
            <div class="chat-toggle" id="chatToggle">
                <i class="fas fa-comments"></i>
            </div>
            <div class="chat-window" id="chatWindow">
                <div class="chat-header">
                    <h4>Hỗ trợ trực tuyến</h4>
                    <button class="chat-close" id="chatClose">&times;</button>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="chat-message bot">
                        Xin chào! Tôi có thể giúp gì cho bạn?
                    </div>
                </div>
                <div class="chat-input-container">
                    <input type="text" class="chat-input" id="chatInput" placeholder="Nhập tin nhắn...">
                    <button class="chat-send" id="chatSend">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(chatWidget);

        // Chat events
        document.getElementById('chatToggle').addEventListener('click', () => {
            document.getElementById('chatWindow').classList.toggle('active');
        });

        document.getElementById('chatClose').addEventListener('click', () => {
            document.getElementById('chatWindow').classList.remove('active');
        });

        document.getElementById('chatSend').addEventListener('click', () => {
            this.sendChatMessage();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });
    }

    sendChatMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addChatMessage(message, 'user');
        input.value = '';

        // Simulate bot response
        setTimeout(() => {
            const responses = [
                'Cảm ơn bạn đã liên hệ. Tôi sẽ hỗ trợ bạn ngay.',
                'Bạn có thể cung cấp thêm thông tin chi tiết không?',
                'Tôi đã ghi nhận yêu cầu của bạn. Vui lòng chờ trong giây lát.',
                'Có gì khác tôi có thể giúp bạn không?'
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            this.addChatMessage(randomResponse, 'bot');
        }, 1000);
    }

    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.textContent = message;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Advanced Search with Suggestions
    setupAdvancedSearch() {
        const searchSection = document.createElement('section');
        searchSection.className = 'advanced-search-section';
        searchSection.innerHTML = `
            <div class="container">
                <div class="search-container-advanced">
                    <div class="search-header">
                        <h3>Tìm kiếm nâng cao</h3>
                        <p>Sử dụng bộ lọc để tìm kiếm chính xác hơn</p>
                    </div>
                    <div class="search-main">
                        <i class="fas fa-search search-icon-advanced"></i>
                        <input type="text" class="search-input-advanced" id="advancedSearchInput" 
                               placeholder="Tìm kiếm hoạt động, sự kiện, thông báo...">
                        <div class="search-suggestions" id="searchSuggestions"></div>
                    </div>
                    <div class="search-filters">
                        <div class="filter-group">
                            <label class="filter-label">Loại</label>
                            <select class="filter-select" id="typeFilter">
                                <option value="">Tất cả</option>
                                <option value="activity">Hoạt động</option>
                                <option value="event">Sự kiện</option>
                                <option value="notification">Thông báo</option>
                                <option value="schedule">Lịch trình</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">Thời gian</label>
                            <select class="filter-select" id="timeFilter">
                                <option value="">Tất cả</option>
                                <option value="today">Hôm nay</option>
                                <option value="week">Tuần này</option>
                                <option value="month">Tháng này</option>
                            </select>
                        </div>
                        <div class="filter-group">
                            <label class="filter-label">Trạng thái</label>
                            <select class="filter-select" id="statusFilter">
                                <option value="">Tất cả</option>
                                <option value="upcoming">Sắp tới</option>
                                <option value="ongoing">Đang diễn ra</option>
                                <option value="completed">Đã hoàn thành</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert after filter section
        const filterSection = document.querySelector('.filter-section');
        filterSection.parentNode.insertBefore(searchSection, filterSection.nextSibling);

        // Setup search suggestions
        const searchInput = document.getElementById('advancedSearchInput');
        const suggestions = document.getElementById('searchSuggestions');

        searchInput.addEventListener('input', debounce((e) => {
            this.showSearchSuggestions(e.target.value, suggestions);
        }, 300));

        // Setup filters
        ['typeFilter', 'timeFilter', 'statusFilter'].forEach(filterId => {
            document.getElementById(filterId).addEventListener('change', () => {
                this.applyAdvancedFilters();
            });
        });
    }

    showSearchSuggestions(query, container) {
        if (!query.trim()) {
            container.classList.remove('active');
            return;
        }

        const suggestions = [
            'Hội thảo công nghệ',
            'Đào tạo nhân viên',
            'Team building',
            'Họp định kỳ',
            'Sự kiện khách hàng',
            'Thông báo nghỉ lễ',
            'Lịch trình dự án'
        ].filter(item => item.toLowerCase().includes(query.toLowerCase()));

        if (suggestions.length > 0) {
            container.innerHTML = suggestions.map(suggestion => 
                `<div class="suggestion-item" onclick="this.selectSuggestion('${suggestion}')">${suggestion}</div>`
            ).join('');
            container.classList.add('active');
        } else {
            container.classList.remove('active');
        }
    }

    // File Upload System
    setupFileUpload() {
        const uploadSection = document.createElement('section');
        uploadSection.className = 'upload-section';
        uploadSection.innerHTML = `
            <div class="container">
                <div class="section-header text-center">
                    <h2 class="section-title">Tải lên tài liệu</h2>
                    <p class="section-subtitle">Chia sẻ tài liệu, hình ảnh và files liên quan đến hoạt động</p>
                </div>
                <div class="upload-zone" id="uploadZone">
                    <div class="upload-icon">
                        <i class="fas fa-cloud-upload-alt"></i>
                    </div>
                    <div class="upload-text">Kéo thả files vào đây hoặc click để chọn</div>
                    <div class="upload-hint">Hỗ trợ: PDF, DOC, JPG, PNG (Tối đa 10MB)</div>
                    <input type="file" id="fileInput" multiple style="display: none;">
                </div>
                <div class="file-list" id="fileList"></div>
            </div>
        `;

        // Insert before footer
        document.body.appendChild(uploadSection);

        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const uploadZone = document.getElementById('uploadZone');
        const fileInput = document.getElementById('fileInput');

        uploadZone.addEventListener('click', () => fileInput.click());

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            this.handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });
    }

    handleFiles(files) {
        Array.from(files).forEach(file => {
            this.uploadFile(file);
        });
    }

    uploadFile(file) {
        const fileId = Date.now() + Math.random();
        const fileItem = {
            id: fileId,
            name: file.name,
            size: this.formatFileSize(file.size),
            progress: 0
        };

        this.uploadedFiles.push(fileItem);
        this.renderFileList();

        // Simulate upload progress
        const interval = setInterval(() => {
            fileItem.progress += Math.random() * 20;
            if (fileItem.progress >= 100) {
                fileItem.progress = 100;
                clearInterval(interval);
            }
            this.updateFileProgress(fileId, fileItem.progress);
        }, 200);
    }

    renderFileList() {
        const container = document.getElementById('fileList');
        container.innerHTML = this.uploadedFiles.map(file => `
            <div class="file-item" data-file-id="${file.id}">
                <div class="file-icon">
                    <i class="fas fa-file"></i>
                </div>
                <div class="file-info">
                    <div class="file-name">${file.name}</div>
                    <div class="file-size">${file.size}</div>
                    <div class="file-progress">
                        <div class="file-progress-bar" style="width: ${file.progress}%"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateFileProgress(fileId, progress) {
        const fileItem = document.querySelector(`[data-file-id="${fileId}"] .file-progress-bar`);
        if (fileItem) {
            fileItem.style.width = `${progress}%`;
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Team Collaboration
    setupTeamCollaboration() {
        const collaborationSection = document.createElement('section');
        collaborationSection.className = 'collaboration-section';
        collaborationSection.innerHTML = `
            <div class="container">
                <div class="section-header text-center">
                    <h2 class="section-title">Đội ngũ làm việc</h2>
                    <p class="section-subtitle">Theo dõi trạng thái và hoạt động của các thành viên</p>
                </div>
                <div class="team-grid" id="teamGrid"></div>
            </div>
        `;

        document.body.appendChild(collaborationSection);
        this.loadTeamMembers();
    }

    loadTeamMembers() {
        this.teamMembers = [
            { id: 1, name: 'Nguyễn Văn Minh', role: 'Giám đốc', status: 'online', avatar: 'GĐ' },
            { id: 2, name: 'Trần Thị Hoa', role: 'Phó Giám đốc', status: 'busy', avatar: 'PGĐ' },
            { id: 3, name: 'Lê Văn Tùng', role: 'Trưởng phòng Kỹ thuật', status: 'online', avatar: 'KT' },
            { id: 4, name: 'Phạm Thị Lan', role: 'Trưởng phòng Tài chính', status: 'online', avatar: 'TC' },
            { id: 5, name: 'Hoàng Văn Đức', role: 'Trưởng phòng Nhân sự', status: 'offline', avatar: 'NS' },
            { id: 6, name: 'Vũ Thị Mai', role: 'Trưởng phòng Pháp chế', status: 'busy', avatar: 'PC' },
            { id: 7, name: 'Đặng Văn Hải', role: 'Trưởng phòng An toàn', status: 'online', avatar: 'AT' },
            { id: 8, name: 'Bùi Thị Linh', role: 'Trưởng phòng IT', status: 'online', avatar: 'IT' },
            { id: 9, name: 'Cao Văn Nam', role: 'Trưởng phòng Kinh doanh', status: 'busy', avatar: 'KD' },
            { id: 10, name: 'Đinh Thị Thu', role: 'Trưởng phòng Đào tạo', status: 'online', avatar: 'ĐT' }
        ];

        this.renderTeamMembers();
    }

    renderTeamMembers() {
        const container = document.getElementById('teamGrid');
        container.innerHTML = this.teamMembers.map(member => `
            <div class="team-member">
                <div class="member-avatar">${member.avatar}</div>
                <div class="member-name">${member.name}</div>
                <div class="member-role">${member.role}</div>
                <div class="member-status status-${member.status}">
                    <div class="status-dot"></div>
                    <span>${this.getStatusLabel(member.status)}</span>
                </div>
            </div>
        `).join('');
    }

    getStatusLabel(status) {
        const labels = {
            'online': 'Trực tuyến',
            'offline': 'Ngoại tuyến', 
            'busy': 'Bận'
        };
        return labels[status] || status;
    }

    // Data Visualization
    setupDataVisualization() {
        const chartsSection = document.createElement('section');
        chartsSection.className = 'charts-section';
        chartsSection.innerHTML = `
            <div class="container">
                <div class="section-header text-center">
                    <h2 class="section-title">Thống kê & Báo cáo</h2>
                    <p class="section-subtitle">Phân tích dữ liệu hoạt động và hiệu suất</p>
                </div>
                <div class="charts-grid">
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3 class="chart-title">Hoạt động theo loại</h3>
                        </div>
                        <div class="chart-container" id="activityChart">
                            <div class="chart-bar">Sự kiện: 25</div>
                            <div class="chart-bar">Đào tạo: 18</div>
                            <div class="chart-bar">Họp: 15</div>
                            <div class="chart-bar">Team building: 12</div>
                            <div class="chart-bar">Khác: 8</div>
                        </div>
                    </div>
                    <div class="chart-card">
                        <div class="chart-header">
                            <h3 class="chart-title">Tham gia theo tháng</h3>
                        </div>
                        <div class="chart-container" id="participationChart">
                            <div class="chart-bar">Tháng 10: 45</div>
                            <div class="chart-bar">Tháng 9: 38</div>
                            <div class="chart-bar">Tháng 8: 32</div>
                            <div class="chart-bar">Tháng 7: 28</div>
                            <div class="chart-bar">Tháng 6: 22</div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(chartsSection);
    }

    // Activity Feed
    setupActivityFeed() {
        const feedSection = document.createElement('section');
        feedSection.className = 'activity-feed';
        feedSection.innerHTML = `
            <div class="container">
                <div class="section-header text-center">
                    <h2 class="section-title">Hoạt động gần đây</h2>
                    <p class="section-subtitle">Cập nhật mới nhất từ hệ thống</p>
                </div>
                <div class="feed-container" id="feedContainer"></div>
            </div>
        `;

        document.body.appendChild(feedSection);
        this.loadActivityFeed();
    }

    loadActivityFeed() {
        this.activityFeed = [
            {
                id: 1,
                author: 'Ban Giám đốc',
                avatar: 'BGĐ',
                time: '2 giờ trước',
                content: 'Thông báo Đại hội Cổ đông thường niên 2025 sẽ diễn ra ngày 15/3/2025 tại Trung tâm Hội nghị Đà Nẵng'
            },
            {
                id: 2,
                author: 'Phòng IT',
                avatar: 'IT', 
                time: '5 giờ trước',
                content: 'Bắt đầu triển khai hệ thống ERP tích hợp giai đoạn 1 - Đào tạo người dùng cuối'
            },
            {
                id: 3,
                author: 'Phòng Nhân sự',
                avatar: 'NS',
                time: '1 ngày trước', 
                content: 'Hoàn thành tổ chức Đại hội Đoàn Thanh niên 2024 với sự tham gia của 80 đoàn viên'
            },
            {
                id: 4,
                author: 'Phòng Kỹ thuật',
                avatar: 'KT',
                time: '2 ngày trước',
                content: 'Bàn giao thành công dự án Trung tâm Bưu chính Thừa Thiên Huế đúng tiến độ'
            },
            {
                id: 5,
                author: 'Phòng Pháp chế',
                avatar: 'PC',
                time: '3 ngày trước',
                content: 'Cập nhật quy định mới về đấu thầu theo Luật Đấu thầu sửa đổi - Yêu cầu các phòng ban nghiên cứu'
            },
            {
                id: 6,
                author: 'Phòng An toàn',
                avatar: 'AT',
                time: '1 tuần trước',
                content: 'Triển khai chương trình An toàn lao động 2025 - Tất cả CBCNV bắt buộc tham gia đào tạo'
            },
            {
                id: 7,
                author: 'Phòng Đào tạo',
                avatar: 'ĐT',
                time: '1 tuần trước',
                content: 'Lên kế hoạch đào tạo kỹ năng số cho CBCNV - Đăng ký tham gia từ ngày 10/3/2025'
            },
            {
                id: 8,
                author: 'Hành chính',
                avatar: 'HC',
                time: '2 tuần trước',
                content: 'Thông báo lịch nghỉ Tết Nguyên đán Ất Tỵ 2025 từ 26/1 đến 2/2 - Chúc mọi người năm mới an khang!'
            }
        ];

        this.renderActivityFeed();
    }

    renderActivityFeed() {
        const container = document.getElementById('feedContainer');
        container.innerHTML = this.activityFeed.map(item => `
            <div class="feed-item">
                <div class="feed-header">
                    <div class="feed-avatar">${item.avatar}</div>
                    <div class="feed-meta">
                        <div class="feed-author">${item.author}</div>
                        <div class="feed-time">${item.time}</div>
                    </div>
                </div>
                <div class="feed-content">${item.content}</div>
            </div>
        `).join('');
    }

    // Management Dashboard
    setupManagementDashboard() {
        const managementSection = document.createElement('section');
        managementSection.className = 'activity-management';
        managementSection.innerHTML = `
            <div class="container">
                <div class="section-header text-center">
                    <h2 class="section-title">Bảng điều khiển</h2>
                    <p class="section-subtitle">Quản lý và theo dõi các hoạt động</p>
                </div>
                
                <div class="management-tabs">
                    <button class="management-tab active" data-tab="overview">Tổng quan</button>
                    <button class="management-tab" data-tab="create">Tạo mới</button>
                    <button class="management-tab" data-tab="manage">Quản lý</button>
                    <button class="management-tab" data-tab="reports">Báo cáo</button>
                </div>

                <div class="management-content active" id="overview">
                    <div class="quick-actions">
                        <h3 style="margin-bottom: var(--space-4);">Thao tác nhanh</h3>
                        <div class="quick-actions-grid">
                            <a href="#" class="quick-action-btn">
                                <div class="quick-action-icon">
                                    <i class="fas fa-plus"></i>
                                </div>
                                <div class="quick-action-text">
                                    <div class="quick-action-title">Tạo sự kiện</div>
                                    <div class="quick-action-desc">Thêm sự kiện mới</div>
                                </div>
                            </a>
                            <a href="#" class="quick-action-btn">
                                <div class="quick-action-icon">
                                    <i class="fas fa-calendar"></i>
                                </div>
                                <div class="quick-action-text">
                                    <div class="quick-action-title">Lên lịch</div>
                                    <div class="quick-action-desc">Đặt lịch hoạt động</div>
                                </div>
                            </a>
                            <a href="#" class="quick-action-btn">
                                <div class="quick-action-icon">
                                    <i class="fas fa-bell"></i>
                                </div>
                                <div class="quick-action-text">
                                    <div class="quick-action-title">Thông báo</div>
                                    <div class="quick-action-desc">Gửi thông báo</div>
                                </div>
                            </a>
                            <a href="#" class="quick-action-btn">
                                <div class="quick-action-icon">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="quick-action-text">
                                    <div class="quick-action-title">Mời tham gia</div>
                                    <div class="quick-action-desc">Mời người tham gia</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="management-content" id="create">
                    <h3>Tạo hoạt động mới</h3>
                    <p>Chức năng tạo hoạt động sẽ được phát triển...</p>
                </div>

                <div class="management-content" id="manage">
                    <h3>Quản lý hoạt động</h3>
                    <p>Chức năng quản lý sẽ được phát triển...</p>
                </div>

                <div class="management-content" id="reports">
                    <h3>Báo cáo chi tiết</h3>
                    <p>Chức năng báo cáo sẽ được phát triển...</p>
                </div>
            </div>
        `;

        document.body.appendChild(managementSection);

        // Setup tab switching
        document.querySelectorAll('.management-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const targetTab = e.target.dataset.tab;
                this.switchManagementTab(targetTab);
            });
        });
    }

    switchManagementTab(tabName) {
        // Update active tab
        document.querySelectorAll('.management-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.management-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');
    }

    loadAdvancedData() {
        // Simulate loading advanced data
        console.log('Loading advanced features data...');
        
        // Auto-refresh activity feed every 30 seconds
        setInterval(() => {
            this.refreshActivityFeed();
        }, 30000);
    }

    refreshActivityFeed() {
        // Add new random activity
        const newActivity = {
            id: Date.now(),
            author: 'Hệ thống',
            avatar: 'S',
            time: 'Vừa xong',
            content: 'Cập nhật dữ liệu hoạt động tự động'
        };

        this.activityFeed.unshift(newActivity);
        if (this.activityFeed.length > 10) {
            this.activityFeed.pop();
        }
        
        this.renderActivityFeed();
    }

    // Advanced filtering
    applyAdvancedFilters() {
        const typeFilter = document.getElementById('typeFilter').value;
        const timeFilter = document.getElementById('timeFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;

        let filteredActivities = [...this.activities];

        if (typeFilter) {
            filteredActivities = filteredActivities.filter(activity => 
                activity.type === typeFilter
            );
        }

        if (statusFilter) {
            filteredActivities = filteredActivities.filter(activity => 
                activity.status === statusFilter
            );
        }

        if (timeFilter) {
            const now = new Date();
            filteredActivities = filteredActivities.filter(activity => {
                const activityDate = new Date(activity.date);
                
                switch (timeFilter) {
                    case 'today':
                        return activityDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                        return activityDate >= weekAgo;
                    case 'month':
                        return activityDate.getMonth() === now.getMonth() && 
                               activityDate.getFullYear() === now.getFullYear();
                    default:
                        return true;
                }
            });
        }

        this.renderFilteredActivities(filteredActivities);
    }
}

// Initialize advanced features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Replace basic manager with advanced one
    if (window.activitiesManager) {
        window.activitiesManager = new AdvancedActivitiesManager();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedActivitiesManager;
}
