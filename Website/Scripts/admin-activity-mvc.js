// Admin Activity MVC JavaScript
$(document).ready(function() {
    initializeAdminActivity();
    setupKeyboardShortcuts();
    setupNotificationSystem();
});

function initializeAdminActivity() {
    setupFilters();
    setupFileUploads();
    setupToggles();
    setupModals();
}

// Setup filters
function setupFilters() {
    $('#filterType, #filterStatus').on('change', function() {
        applyFilters();
    });
    
    $('#searchInput').on('keyup debounce', function() {
        applyFilters();
    });
    
    // Setup advanced search toggle
    $('.search-toggle').on('click', function() {
        toggleAdvancedSearch();
    });
}

function applyFilters() {
    const search = $('#searchInput').val();
    const type = $('#filterType').val();
    const status = $('#filterStatus').val();
    
    // Update URL with filters
    const url = new URL(window.location);
    url.searchParams.set('search', search);
    url.searchParams.set('type', type);
    url.searchParams.set('status', status);
    url.searchParams.set('page', 1); // Reset to first page
    
    window.location.href = url.toString();
}

function changePageSize(pageSize) {
    const url = new URL(window.location);
    url.searchParams.set('pageSize', pageSize);
    url.searchParams.set('page', 1); // Reset to first page
    
    window.location.href = url.toString();
}

function toggleAdvancedSearch() {
    const $toggle = $('.search-toggle');
    const $form = $('.search-form');
    
    if ($toggle.hasClass('collapsed')) {
        $toggle.removeClass('collapsed');
        $form.slideDown(300);
    } else {
        $toggle.addClass('collapsed');
        $form.slideUp(300);
    }
}

function clearFilters() {
    $('#searchInput').val('');
    $('#filterType').val('');
    $('#filterStatus').val('');
    
    // Redirect to clean URL
    window.location.href = window.location.pathname;
}

// Filter table
function filterTable() {
    const typeFilter = $('#filterType').val().toLowerCase();
    const statusFilter = $('#filterStatus').val().toLowerCase();
    const searchText = $('#searchInput').val().toLowerCase();
    
    $('#activitiesTable tbody tr').each(function() {
        const $row = $(this);
        const type = $row.find('.badge').text().toLowerCase();
        const title = $row.find('.activity-title strong').text().toLowerCase();
        const description = $row.find('.activity-title small').text().toLowerCase();
        
        let showRow = true;
        
        // Type filter
        if (typeFilter && !type.includes(typeFilter)) {
            showRow = false;
        }
        
        // Status filter
        if (statusFilter) {
            const isPublished = $row.find('input[id^="published"]').is(':checked');
            const isFeatured = $row.find('input[id^="featured"]').is(':checked');
            
            if (statusFilter === 'published' && !isPublished) {
                showRow = false;
            } else if (statusFilter === 'unpublished' && isPublished) {
                showRow = false;
            } else if (statusFilter === 'featured' && !isFeatured) {
                showRow = false;
            }
        }
        
        // Search filter
        if (searchText && !title.includes(searchText) && !description.includes(searchText)) {
            showRow = false;
        }
        
        $row.toggle(showRow);
    });
}

// Setup file uploads
function setupFileUploads() {
    setupImageUpload();
    setupDocumentUpload();
}

function setupImageUpload() {
    const $uploadArea = $('#imageUploadArea');
    const $fileInput = $('#imageFile');
    const $preview = $('#imagePreview');
    
    // Click to select file
    $uploadArea.on('click', function() {
        $fileInput.click();
    });
    
    // File input change
    $fileInput.on('change', function() {
        const file = this.files[0];
        if (file) {
            if (validateImageFile(file)) {
                showImagePreview(file);
            }
        }
    });
    
    // Drag and drop
    $uploadArea.on('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    });
    
    $uploadArea.on('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
    });
    
    $uploadArea.on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        
        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (validateImageFile(file)) {
                $fileInput[0].files = files;
                showImagePreview(file);
            }
        }
    });
}

function setupDocumentUpload() {
    const $uploadArea = $('#documentUploadArea');
    const $fileInput = $('#documentFile');
    const $preview = $('#documentPreview');
    
    // Click to select file
    $uploadArea.on('click', function() {
        $fileInput.click();
    });
    
    // File input change
    $fileInput.on('change', function() {
        const file = this.files[0];
        if (file) {
            if (validateDocumentFile(file)) {
                showDocumentPreview(file);
            }
        }
    });
    
    // Drag and drop
    $uploadArea.on('dragover', function(e) {
        e.preventDefault();
        $(this).addClass('dragover');
    });
    
    $uploadArea.on('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
    });
    
    $uploadArea.on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('dragover');
        
        const files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (validateDocumentFile(file)) {
                $fileInput[0].files = files;
                showDocumentPreview(file);
            }
        }
    });
}

// File validation
function validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
        showError('Chỉ hỗ trợ file ảnh: JPG, PNG, GIF, WebP');
        return false;
    }
    
    if (file.size > maxSize) {
        showError('File ảnh không được vượt quá 5MB');
        return false;
    }
    
    return true;
}

function validateDocumentFile(file) {
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedTypes.includes(file.type)) {
        showError('Chỉ hỗ trợ file tài liệu: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX');
        return false;
    }
    
    if (file.size > maxSize) {
        showError('File tài liệu không được vượt quá 10MB');
        return false;
    }
    
    return true;
}

// Show file previews
function showImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        $('#previewImg').attr('src', e.target.result);
        $('#imagePreview').show();
        $('#imageUploadArea').hide();
    };
    reader.readAsDataURL(file);
}

function showDocumentPreview(file) {
    $('#documentName').text(file.name);
    $('#documentPreview').show();
    $('#documentUploadArea').hide();
}

// Remove previews
function removeImagePreview() {
    $('#imageFile').val('');
    $('#imagePreview').hide();
    $('#imageUploadArea').show();
}

function removeDocumentPreview() {
    $('#documentFile').val('');
    $('#documentPreview').hide();
    $('#documentUploadArea').show();
}

// Setup toggle switches
function setupToggles() {
    $('.custom-control-input').on('change', function() {
        // Handle toggle changes if needed
    });
}

// Toggle status (Published/Featured)
function toggleStatus(id, type) {
    $.ajax({
        url: '/AdminActivity/ToggleStatus',
        type: 'POST',
        data: {
            id: id,
            type: type,
            __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },
        success: function(response) {
            if (response.success) {
                showSuccess('Cập nhật trạng thái thành công!');
            } else {
                showError(response.message || 'Có lỗi xảy ra');
                // Revert toggle
                $(`#${type}${id}`).prop('checked', !$(`#${type}${id}`).is(':checked'));
            }
        },
        error: function() {
            showError('Có lỗi xảy ra khi cập nhật trạng thái');
            // Revert toggle
            $(`#${type}${id}`).prop('checked', !$(`#${type}${id}`).is(':checked'));
        }
    });
}

// Delete activity
function deleteActivity(id) {
    if (confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) {
        $.ajax({
            url: '/AdminActivity/Delete',
            type: 'POST',
            data: {
                id: id,
                __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
            },
            success: function(response) {
                if (response.success) {
                    showSuccess(response.message);
                    $(`tr[data-id="${id}"]`).fadeOut(300, function() {
                        $(this).remove();
                    });
                } else {
                    showError(response.message);
                }
            },
            error: function() {
                showError('Có lỗi xảy ra khi xóa hoạt động');
            }
        });
    }
}

// View image modal
function viewImage(imageUrl) {
    const modal = $(`
        <div class="modal fade" id="imageModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Xem hình ảnh</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${imageUrl}" class="img-fluid" alt="Activity Image">
                    </div>
                    <div class="modal-footer">
                        <a href="${imageUrl}" target="_blank" class="btn btn-primary">
                            <i class="fas fa-external-link-alt"></i> Mở trong tab mới
                        </a>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    `);
    
    $('body').append(modal);
    modal.modal('show');
    
    modal.on('hidden.bs.modal', function() {
        modal.remove();
    });
}

// View document modal
function viewDocument(documentUrl) {
    const fileName = documentUrl.split('/').pop();
    const modal = $(`
        <div class="modal fade" id="documentModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Xem tài liệu</h5>
                        <button type="button" class="close" data-dismiss="modal">
                            <span>&times;</span>
                        </button>
                    </div>
                    <div class="modal-body text-center">
                        <div class="document-preview">
                            <i class="fas fa-file-alt fa-5x text-primary mb-3"></i>
                            <h6>${fileName}</h6>
                            <p class="text-muted">Click vào nút bên dưới để xem hoặc tải xuống tài liệu</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <a href="${documentUrl}" target="_blank" class="btn btn-primary">
                            <i class="fas fa-external-link-alt"></i> Mở trong tab mới
                        </a>
                        <a href="${documentUrl}" download class="btn btn-success">
                            <i class="fas fa-download"></i> Tải xuống
                        </a>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    `);
    
    $('body').append(modal);
    modal.modal('show');
    
    modal.on('hidden.bs.modal', function() {
        modal.remove();
    });
}

// Setup modals
function setupModals() {
    // Auto-hide alerts after 5 seconds
    $('.alert').delay(5000).fadeOut();
}

// Notification functions
function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    const notification = $(`
        <div class="alert ${alertClass} alert-dismissible fade show notification-toast" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <i class="fas ${icon}"></i> ${message}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        </div>
    `);
    
    $('body').append(notification);
    
    // Auto remove after 5 seconds
    setTimeout(function() {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 5000);
}

// Bulk Actions Functions
let selectedActivities = new Set();

function toggleSelectAll() {
    const selectAllCheckbox = $('#selectAll');
    const rowCheckboxes = $('.row-checkbox');
    
    rowCheckboxes.prop('checked', selectAllCheckbox.is(':checked'));
    
    selectedActivities.clear();
    if (selectAllCheckbox.is(':checked')) {
        rowCheckboxes.each(function() {
            selectedActivities.add(parseInt($(this).val()));
        });
    }
    
    updateBulkActionsBar();
}

function handleRowSelect(checkbox) {
    const $checkbox = $(checkbox);
    const id = parseInt($checkbox.val());
    
    if ($checkbox.is(':checked')) {
        selectedActivities.add(id);
    } else {
        selectedActivities.delete(id);
    }
    
    updateSelectAllState();
    updateBulkActionsBar();
}

function updateSelectAllState() {
    const totalCheckboxes = $('.row-checkbox').length;
    const checkedCheckboxes = $('.row-checkbox:checked').length;
    const selectAllCheckbox = $('#selectAll')[0];
    
    if (checkedCheckboxes === 0) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = false;
    } else if (checkedCheckboxes === totalCheckboxes) {
        selectAllCheckbox.indeterminate = false;
        selectAllCheckbox.checked = true;
    } else {
        selectAllCheckbox.indeterminate = true;
        selectAllCheckbox.checked = false;
    }
}

function updateBulkActionsBar() {
    const count = selectedActivities.size;
    const $bulkActions = $('#bulkActions');
    const $selectedCount = $('#selectedCount');
    
    if (count > 0) {
        $bulkActions.show();
        $selectedCount.text(count);
    } else {
        $bulkActions.hide();
    }
}

function bulkDelete() {
    if (selectedActivities.size === 0) {
        showError('Vui lòng chọn ít nhất một hoạt động để xóa');
        return;
    }
    
    if (confirm(`Bạn có chắc chắn muốn xóa ${selectedActivities.size} hoạt động đã chọn?`)) {
        const ids = Array.from(selectedActivities);
        
        $.ajax({
            url: '/AdminActivity/BulkDelete',
            type: 'POST',
            data: {
                ids: ids,
                __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
            },
            success: function(response) {
                if (response.success) {
                    showSuccess(response.message);
                    // Remove deleted rows
                    ids.forEach(id => {
                        $(`tr[data-id="${id}"]`).fadeOut(300, function() {
                            $(this).remove();
                        });
                    });
                    selectedActivities.clear();
                    updateBulkActionsBar();
                    updateSelectAllState();
                } else {
                    showError(response.message);
                }
            },
            error: function() {
                showError('Có lỗi xảy ra khi xóa hoạt động');
            }
        });
    }
}

function bulkTogglePublish() {
    if (selectedActivities.size === 0) {
        showError('Vui lòng chọn ít nhất một hoạt động');
        return;
    }
    
    const ids = Array.from(selectedActivities);
    
    $.ajax({
        url: '/AdminActivity/BulkToggleStatus',
        type: 'POST',
        data: {
            ids: ids,
            type: 'published',
            value: true,
            __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },
        success: function(response) {
            if (response.success) {
                showSuccess(response.message);
                // Update UI
                ids.forEach(id => {
                    $(`#published${id}`).prop('checked', true);
                });
            } else {
                showError(response.message);
            }
        },
        error: function() {
            showError('Có lỗi xảy ra khi cập nhật trạng thái');
        }
    });
}

function bulkToggleFeatured() {
    if (selectedActivities.size === 0) {
        showError('Vui lòng chọn ít nhất một hoạt động');
        return;
    }
    
    const ids = Array.from(selectedActivities);
    
    $.ajax({
        url: '/AdminActivity/BulkToggleStatus',
        type: 'POST',
        data: {
            ids: ids,
            type: 'featured',
            value: true,
            __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },
        success: function(response) {
            if (response.success) {
                showSuccess(response.message);
                // Update UI
                ids.forEach(id => {
                    $(`#featured${id}`).prop('checked', true);
                });
            } else {
                showError(response.message);
            }
        },
        error: function() {
            showError('Có lỗi xảy ra khi cập nhật trạng thái');
        }
    });
}

function bulkExport() {
    if (selectedActivities.size === 0) {
        // Export all if none selected
        window.location.href = '/AdminActivity/ExportExcel';
    } else {
        // Export selected
        const ids = Array.from(selectedActivities);
        const form = $('<form method="post" action="/AdminActivity/ExportExcel"></form>');
        
        ids.forEach(id => {
            form.append(`<input type="hidden" name="ids" value="${id}">`);
        });
        
        form.append(`<input type="hidden" name="__RequestVerificationToken" value="${$('input[name="__RequestVerificationToken"]').val()}">`);
        
        $('body').append(form);
        form.submit();
        form.remove();
        
        showSuccess(`Đang xuất ${ids.length} hoạt động đã chọn...`);
    }
}

// Clone Activity
function cloneActivity(id) {
    if (confirm('Bạn có muốn tạo bản sao của hoạt động này?')) {
        $.ajax({
            url: '/AdminActivity/Clone',
            type: 'POST',
            data: {
                id: id,
                __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
            },
            success: function(response) {
                if (response.success) {
                    if (typeof notificationSystem !== 'undefined') {
                        notificationSystem.success(response.message, {
                            title: 'Nhân bản hoạt động',
                            duration: 4000
                        });
                    } else {
                        showSuccess(response.message);
                    }
                    // Reload page to show cloned activity
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    if (typeof notificationSystem !== 'undefined') {
                        notificationSystem.error(response.message);
                    } else {
                        showError(response.message);
                    }
                }
            },
            error: function() {
                const message = 'Có lỗi xảy ra khi nhân bản hoạt động';
                if (typeof notificationSystem !== 'undefined') {
                    notificationSystem.error(message);
                } else {
                    showError(message);
                }
            }
        });
    }
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    $(document).on('keydown', function(e) {
        // Ctrl/Cmd + N: New Activity
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            window.location.href = '/AdminActivity/Create';
        }
        
        // Ctrl/Cmd + F: Focus Search
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            $('#searchInput').focus();
        }
        
        // Ctrl/Cmd + A: Select All (when in table)
        if ((e.ctrlKey || e.metaKey) && e.key === 'a' && $(e.target).closest('.data-table-container').length) {
            e.preventDefault();
            $('#selectAll').prop('checked', true).trigger('change');
        }
        
        // Delete: Bulk Delete Selected
        if (e.key === 'Delete' && selectedActivities.size > 0) {
            e.preventDefault();
            bulkDelete();
        }
        
        // Escape: Clear Selection
        if (e.key === 'Escape') {
            selectedActivities.clear();
            $('.row-checkbox').prop('checked', false);
            updateBulkActionsBar();
            updateSelectAllState();
        }
    });
}

// Setup Notification System
function setupNotificationSystem() {
    // Replace existing notification functions with advanced system
    if (typeof notificationSystem !== 'undefined') {
        window.showSuccess = function(message) {
            notificationSystem.success(message);
        };
        
        window.showError = function(message) {
            notificationSystem.error(message);
        };
        
        window.showWarning = function(message) {
            notificationSystem.warning(message);
        };
        
        window.showInfo = function(message) {
            notificationSystem.info(message);
        };
    }
}

// Enhanced notification functions for activities
function notifyActivityAction(action, data) {
    if (typeof notificationSystem === 'undefined') return;
    
    switch (action) {
        case 'created':
            notificationSystem.activityCreated(data.title);
            break;
        case 'updated':
            notificationSystem.activityUpdated(data.title);
            break;
        case 'deleted':
            notificationSystem.activityDeleted(data.count || 1);
            break;
        case 'bulk_action':
            notificationSystem.bulkActionCompleted(data.action, data.count);
            break;
        case 'exported':
            notificationSystem.exportCompleted(data.filename, data.count);
            break;
    }
}

// Keyboard Shortcuts Help Modal
function showKeyboardShortcuts() {
    const shortcuts = [
        { key: 'Ctrl + N', description: 'Tạo hoạt động mới' },
        { key: 'Ctrl + F', description: 'Tìm kiếm' },
        { key: 'Ctrl + A', description: 'Chọn tất cả' },
        { key: 'Delete', description: 'Xóa các item đã chọn' },
        { key: 'Escape', description: 'Hủy chọn tất cả' }
    ];
    
    let content = '<div class="keyboard-shortcuts"><h5>Phím tắt</h5><ul>';
    shortcuts.forEach(shortcut => {
        content += `<li><kbd>${shortcut.key}</kbd> - ${shortcut.description}</li>`;
    });
    content += '</ul></div>';
    
    if (typeof notificationSystem !== 'undefined') {
        notificationSystem.info(content, {
            title: 'Phím tắt hệ thống',
            duration: 0
        });
    }
}

// Global functions for onclick handlers
window.toggleSelectAll = toggleSelectAll;
window.handleRowSelect = handleRowSelect;
window.bulkDelete = bulkDelete;
window.bulkTogglePublish = bulkTogglePublish;
window.bulkToggleFeatured = bulkToggleFeatured;
window.bulkExport = bulkExport;
window.changePageSize = changePageSize;
window.toggleAdvancedSearch = toggleAdvancedSearch;
window.clearFilters = clearFilters;
window.cloneActivity = cloneActivity;
window.showKeyboardShortcuts = showKeyboardShortcuts;
window.toggleStatus = toggleStatus;
window.deleteActivity = deleteActivity;
window.viewImage = viewImage;
window.viewDocument = viewDocument;
window.removeImagePreview = removeImagePreview;
window.removeDocumentPreview = removeDocumentPreview;
