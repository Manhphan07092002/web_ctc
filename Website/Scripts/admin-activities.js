// Admin Activities Management JavaScript
// Complete CRUD functionality for activities management

class AdminActivities {
    constructor() {
        this.dataTable = null;
        this.selectedRows = new Set();
        this.apiBaseUrl = '/Admin';
        this.currentEditId = null;
        
        this.init();
    }

    init() {
        this.initializeDataTable();
        this.setupEventListeners();
        this.setupFormValidation();
        this.loadActivities();
    }

    // Initialize DataTable
    initializeDataTable() {
        this.dataTable = $('#activitiesTable').DataTable({
            processing: true,
            serverSide: false,
            responsive: true,
            pageLength: 25,
            order: [[3, 'desc']], // Sort by date descending
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/vi.json'
            },
            columnDefs: [
                {
                    targets: 0,
                    orderable: false,
                    searchable: false,
                    render: function(data, type, row) {
                        return `<input type="checkbox" class="row-select" value="${row.id}" onchange="adminActivities.handleRowSelect(this)">`;
                    }
                },
                {
                    targets: 2,
                    render: function(data, type, row) {
                        return `<span class="type-badge ${data}">${adminActivities.getTypeLabel(data)}</span>`;
                    }
                },
                {
                    targets: 3,
                    render: function(data, type, row) {
                        return adminActivities.formatDate(data);
                    }
                },
                {
                    targets: 5,
                    render: function(data, type, row) {
                        return `<span class="status-badge ${data}">${adminActivities.getStatusLabel(data)}</span>`;
                    }
                },
                {
                    targets: 7,
                    orderable: false,
                    searchable: false,
                    render: function(data, type, row) {
                        return `
                            <div class="action-buttons">
                                <button class="btn-action btn-view" onclick="adminActivities.viewActivity('${row.id}')" title="Xem chi tiết">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="btn-action btn-edit" onclick="adminActivities.editActivity('${row.id}')" title="Chỉnh sửa">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn-action btn-delete" onclick="adminActivities.deleteActivity('${row.id}')" title="Xóa">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        `;
                    }
                }
            ],
            dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6"f>>rtip',
            buttons: [
                {
                    extend: 'excel',
                    text: '<i class="fas fa-file-excel"></i> Excel',
                    className: 'btn btn-success'
                }
            ]
        });
    }

    // Load activities data
    async loadActivities() {
        try {
            this.showLoading();
            
            const response = await fetch(`${this.apiBaseUrl}/GetActivitiesData`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to load activities');
            }
            
            const result = await response.json();
            
            // Clear existing data
            this.dataTable.clear();
            
            // Add new data
            if (result.data && result.data.length > 0) {
                this.dataTable.rows.add(result.data);
            }
            
            // Redraw table
            this.dataTable.draw();
            
            this.hideLoading();
        } catch (error) {
            console.error('Error loading activities:', error);
            this.showError('Không thể tải danh sách hoạt động');
            this.hideLoading();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Filter events
        document.getElementById('typeFilter').addEventListener('change', () => {
            this.applyFilters();
        });
        
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.applyFilters();
        });
        
        document.getElementById('dateFilter').addEventListener('change', () => {
            this.applyFilters();
        });

        // Form submission
        document.getElementById('activityForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveActivity();
        });

        // Modal close on overlay click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closeBulkStatusModal();
            }
            if (e.ctrlKey && e.key === 'n') {
                e.preventDefault();
                this.openCreateModal();
            }
        });
    }

    // Apply filters to DataTable
    applyFilters() {
        const typeFilter = document.getElementById('typeFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;

        // Apply column filters
        this.dataTable.column(2).search(typeFilter);
        this.dataTable.column(5).search(statusFilter);
        
        if (dateFilter) {
            this.dataTable.column(3).search(dateFilter);
        } else {
            this.dataTable.column(3).search('');
        }
        
        this.dataTable.draw();
    }

    // Handle row selection
    handleRowSelect(checkbox) {
        const id = checkbox.value;
        
        if (checkbox.checked) {
            this.selectedRows.add(id);
        } else {
            this.selectedRows.delete(id);
        }
        
        this.updateBulkActionButtons();
        this.updateSelectAllCheckbox();
    }

    // Toggle select all
    toggleSelectAll() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const rowCheckboxes = document.querySelectorAll('.row-select');
        
        rowCheckboxes.forEach(checkbox => {
            checkbox.checked = selectAllCheckbox.checked;
            this.handleRowSelect(checkbox);
        });
    }

    // Update select all checkbox state
    updateSelectAllCheckbox() {
        const selectAllCheckbox = document.getElementById('selectAll');
        const rowCheckboxes = document.querySelectorAll('.row-select');
        const checkedBoxes = document.querySelectorAll('.row-select:checked');
        
        if (checkedBoxes.length === 0) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = false;
        } else if (checkedBoxes.length === rowCheckboxes.length) {
            selectAllCheckbox.indeterminate = false;
            selectAllCheckbox.checked = true;
        } else {
            selectAllCheckbox.indeterminate = true;
        }
    }

    // Update bulk action buttons
    updateBulkActionButtons() {
        const bulkButtons = document.querySelectorAll('.btn-bulk-action');
        const hasSelection = this.selectedRows.size > 0;
        
        bulkButtons.forEach(button => {
            button.disabled = !hasSelection;
        });
        
        // Update selected count
        const selectedCountElement = document.getElementById('selectedCount');
        if (selectedCountElement) {
            selectedCountElement.textContent = this.selectedRows.size;
        }
    }

    // Open create modal
    openCreateModal() {
        this.currentEditId = null;
        document.getElementById('modalTitle').textContent = 'Tạo hoạt động mới';
        document.getElementById('saveButtonText').textContent = 'Tạo';
        document.getElementById('activityForm').reset();
        
        // Set default values
        document.getElementById('isActive').checked = true;
        document.getElementById('date').value = new Date().toISOString().split('T')[0];
        
        this.showModal();
    }

    // Edit activity
    async editActivity(id) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/EditActivity/${id}`);
            
            if (!response.ok) {
                throw new Error('Failed to load activity');
            }
            
            const activity = await response.json();
            
            this.currentEditId = id;
            document.getElementById('modalTitle').textContent = 'Chỉnh sửa hoạt động';
            document.getElementById('saveButtonText').textContent = 'Cập nhật';
            
            // Populate form
            this.populateForm(activity);
            
            this.showModal();
        } catch (error) {
            console.error('Error loading activity:', error);
            this.showError('Không thể tải thông tin hoạt động');
        }
    }

    // Populate form with activity data
    populateForm(activity) {
        document.getElementById('activityId').value = activity.Id || '';
        document.getElementById('title').value = activity.Title || '';
        document.getElementById('description').value = activity.Description || '';
        document.getElementById('type').value = activity.Type || '';
        document.getElementById('date').value = activity.Date ? activity.Date.split('T')[0] : '';
        document.getElementById('time').value = activity.Time || '';
        document.getElementById('location').value = activity.Location || '';
        document.getElementById('status').value = activity.Status || '';
        document.getElementById('priority').value = activity.Priority || '';
        document.getElementById('image').value = activity.Image || '';
        document.getElementById('tags').value = activity.Tags || '';
        document.getElementById('notes').value = activity.Notes || '';
        document.getElementById('isActive').checked = activity.IsActive !== false;
        document.getElementById('isFeatured').checked = activity.IsFeatured === true;
    }

    // Save activity (create or update)
    async saveActivity() {
        const form = document.getElementById('activityForm');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = new FormData(form);
        const activityData = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            if (key === 'IsActive' || key === 'IsFeatured') {
                activityData[key] = value === 'on';
            } else {
                activityData[key] = value;
            }
        }

        // Handle checkboxes that aren't in FormData when unchecked
        activityData.IsActive = formData.has('IsActive');
        activityData.IsFeatured = formData.has('IsFeatured');

        try {
            this.showSaveLoading();
            
            const url = this.currentEditId 
                ? `${this.apiBaseUrl}/EditActivity`
                : `${this.apiBaseUrl}/CreateActivity`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': this.getAntiForgeryToken()
                },
                body: JSON.stringify(activityData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result.message);
                this.closeModal();
                this.loadActivities();
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            console.error('Error saving activity:', error);
            this.showError('Có lỗi xảy ra khi lưu hoạt động');
        } finally {
            this.hideSaveLoading();
        }
    }

    // Delete activity
    async deleteActivity(id) {
        if (!confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/DeleteActivity/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': this.getAntiForgeryToken()
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result.message);
                this.loadActivities();
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            console.error('Error deleting activity:', error);
            this.showError('Có lỗi xảy ra khi xóa hoạt động');
        }
    }

    // View activity details
    async viewActivity(id) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/EditActivity/${id}`);
            
            if (!response.ok) {
                throw new Error('Failed to load activity');
            }
            
            const activity = await response.json();
            
            // Open in view mode (you can create a separate view modal)
            this.showActivityDetails(activity);
        } catch (error) {
            console.error('Error loading activity:', error);
            this.showError('Không thể tải thông tin hoạt động');
        }
    }

    // Show activity details (implement as needed)
    showActivityDetails(activity) {
        // For now, just populate the edit form in read-only mode
        this.populateForm(activity);
        document.getElementById('modalTitle').textContent = 'Chi tiết hoạt động';
        
        // Disable all form fields
        const formElements = document.querySelectorAll('#activityForm input, #activityForm select, #activityForm textarea');
        formElements.forEach(element => {
            element.disabled = true;
        });
        
        // Hide save button
        document.querySelector('.modal-footer .btn-primary').style.display = 'none';
        
        this.showModal();
    }

    // Bulk delete
    async bulkDelete() {
        if (this.selectedRows.size === 0) {
            this.showError('Vui lòng chọn ít nhất một hoạt động');
            return;
        }

        if (!confirm(`Bạn có chắc chắn muốn xóa ${this.selectedRows.size} hoạt động đã chọn?`)) {
            return;
        }

        try {
            const ids = Array.from(this.selectedRows);
            
            const response = await fetch(`${this.apiBaseUrl}/BulkDelete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': this.getAntiForgeryToken()
                },
                body: JSON.stringify({ ids: ids })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result.message);
                this.selectedRows.clear();
                this.updateBulkActionButtons();
                this.loadActivities();
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            console.error('Error bulk deleting:', error);
            this.showError('Có lỗi xảy ra khi xóa hoạt động');
        }
    }

    // Bulk update status
    bulkUpdateStatus() {
        if (this.selectedRows.size === 0) {
            this.showError('Vui lòng chọn ít nhất một hoạt động');
            return;
        }

        document.getElementById('selectedCount').textContent = this.selectedRows.size;
        this.showBulkStatusModal();
    }

    // Confirm bulk status update
    async confirmBulkStatusUpdate() {
        const newStatus = document.getElementById('bulkStatus').value;
        
        if (!newStatus) {
            this.showError('Vui lòng chọn trạng thái');
            return;
        }

        try {
            const ids = Array.from(this.selectedRows);
            
            const response = await fetch(`${this.apiBaseUrl}/BulkUpdateStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'RequestVerificationToken': this.getAntiForgeryToken()
                },
                body: JSON.stringify({ ids: ids, status: newStatus })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(result.message);
                this.selectedRows.clear();
                this.updateBulkActionButtons();
                this.closeBulkStatusModal();
                this.loadActivities();
            } else {
                this.showError(result.message);
            }
        } catch (error) {
            console.error('Error bulk updating status:', error);
            this.showError('Có lỗi xảy ra khi cập nhật trạng thái');
        }
    }

    // Export activities
    exportActivities() {
        if (this.dataTable) {
            // Trigger DataTables export
            this.dataTable.button('.buttons-excel').trigger();
        }
    }

    // Modal management
    showModal() {
        document.getElementById('activityModal').classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('activityModal').classList.remove('show');
        document.body.style.overflow = '';
        
        // Re-enable form fields and show save button
        const formElements = document.querySelectorAll('#activityForm input, #activityForm select, #activityForm textarea');
        formElements.forEach(element => {
            element.disabled = false;
        });
        document.querySelector('.modal-footer .btn-primary').style.display = 'flex';
    }

    showBulkStatusModal() {
        document.getElementById('bulkStatusModal').classList.add('show');
    }

    closeBulkStatusModal() {
        document.getElementById('bulkStatusModal').classList.remove('show');
    }

    // Form validation
    setupFormValidation() {
        const form = document.getElementById('activityForm');
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    this.validateField(input);
                }
            });
        });
    }

    validateField(field) {
        const isValid = field.checkValidity();
        
        if (isValid) {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        } else {
            field.classList.remove('is-valid');
            field.classList.add('is-invalid');
        }
        
        return isValid;
    }

    // Utility functions
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

    formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    getAntiForgeryToken() {
        const token = document.querySelector('input[name="__RequestVerificationToken"]');
        return token ? token.value : '';
    }

    // Loading states
    showLoading() {
        const container = document.querySelector('.activities-table-container');
        if (container && !container.querySelector('.loading-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'loading-overlay';
            overlay.innerHTML = '<div class="loading-spinner"></div>';
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

    showSaveLoading() {
        const saveBtn = document.querySelector('#activityForm .btn-primary');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
        }
    }

    hideSaveLoading() {
        const saveBtn = document.querySelector('#activityForm .btn-primary');
        if (saveBtn) {
            saveBtn.disabled = false;
            const text = this.currentEditId ? 'Cập nhật' : 'Tạo';
            saveBtn.innerHTML = `<i class="fas fa-save"></i> <span>${text}</span>`;
        }
    }

    // Toast notifications
    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

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
            max-width: 350px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });
    }
}

// Global functions for onclick handlers
window.openCreateModal = function() {
    if (window.adminActivities) {
        window.adminActivities.openCreateModal();
    }
};

window.closeModal = function() {
    if (window.adminActivities) {
        window.adminActivities.closeModal();
    }
};

window.closeBulkStatusModal = function() {
    if (window.adminActivities) {
        window.adminActivities.closeBulkStatusModal();
    }
};

window.toggleSelectAll = function() {
    if (window.adminActivities) {
        window.adminActivities.toggleSelectAll();
    }
};

window.bulkDelete = function() {
    if (window.adminActivities) {
        window.adminActivities.bulkDelete();
    }
};

window.bulkUpdateStatus = function() {
    if (window.adminActivities) {
        window.adminActivities.bulkUpdateStatus();
    }
};

window.confirmBulkStatusUpdate = function() {
    if (window.adminActivities) {
        window.adminActivities.confirmBulkStatusUpdate();
    }
};

window.exportActivities = function() {
    if (window.adminActivities) {
        window.adminActivities.exportActivities();
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminActivities;
}
