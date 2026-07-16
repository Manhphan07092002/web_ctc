/**
 * Admin Projects JavaScript
 * Handles all client-side functionality for project management
 */

$(document).ready(function() {
    initializeAdminProjects();
});

function initializeAdminProjects() {
    // Initialize tooltips
    $('[data-toggle="tooltip"]').tooltip();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize file upload handlers
    initializeFileUploadHandlers();
    
    // Initialize table interactions
    initializeTableInteractions();
    
    // Initialize search and filters
    initializeSearchAndFilters();
}

// Form Validation
function initializeFormValidation() {
    $('.project-form').on('submit', function(e) {
        var isValid = true;
        var form = $(this);
        
        // Clear previous errors
        form.find('.text-danger').text('');
        form.find('.form-control').removeClass('is-invalid');
        
        // Validate required fields
        form.find('input[required], select[required], textarea[required]').each(function() {
            var field = $(this);
            var value = field.val().trim();
            
            if (!value) {
                showFieldError(field, 'Trường này là bắt buộc');
                isValid = false;
            }
        });
        
        // Validate title length
        var titleField = form.find('#Title');
        if (titleField.length && titleField.val().length > 500) {
            showFieldError(titleField, 'Tiêu đề không được vượt quá 500 ký tự');
            isValid = false;
        }
        
        // Validate project value
        var valueField = form.find('#ProjectValue');
        if (valueField.length && valueField.val()) {
            var value = parseFloat(valueField.val());
            if (isNaN(value) || value < 0) {
                showFieldError(valueField, 'Giá trị dự án phải là số dương');
                isValid = false;
            }
        }
        
        // Validate progress
        var progressField = form.find('#Progress');
        if (progressField.length) {
            var progress = parseInt(progressField.val());
            if (isNaN(progress) || progress < 0 || progress > 100) {
                showFieldError(progressField, 'Tiến độ phải từ 0 đến 100');
                isValid = false;
            }
        }
        
        // Validate dates
        validateDates(form);
        
        if (!isValid) {
            e.preventDefault();
            showToast('error', 'Vui lòng kiểm tra lại thông tin đã nhập');
            
            // Scroll to first error
            var firstError = form.find('.is-invalid').first();
            if (firstError.length) {
                $('html, body').animate({
                    scrollTop: firstError.offset().top - 100
                }, 500);
            }
        } else {
            // Show loading state
            var submitBtn = form.find('button[type="submit"]');
            submitBtn.prop('disabled', true);
            submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Đang xử lý...');
        }
        
        return isValid;
    });
}

function showFieldError(field, message) {
    field.addClass('is-invalid');
    var errorContainer = field.closest('.form-group').find('.text-danger');
    if (errorContainer.length) {
        errorContainer.text(message);
    }
}

function validateDates(form) {
    var startDate = form.find('#StartDate').val();
    var endDate = form.find('#EndDate').val();
    var completionDate = form.find('#CompletionDate').val();
    
    if (startDate && endDate) {
        var start = new Date(startDate);
        var end = new Date(endDate);
        
        if (start > end) {
            showFieldError(form.find('#EndDate'), 'Ngày kết thúc phải sau ngày bắt đầu');
        }
    }
    
    if (endDate && completionDate) {
        var end = new Date(endDate);
        var completion = new Date(completionDate);
        
        if (completion < end) {
            showFieldError(form.find('#CompletionDate'), 'Ngày hoàn thành không được trước ngày kết thúc');
        }
    }
}

// File Upload Handlers
function initializeFileUploadHandlers() {
    // Image upload handling
    $('#imageFile').on('change', function() {
        handleFileUpload(this, 'image');
    });
    
    // Document upload handling
    $('#documentFile').on('change', function() {
        handleFileUpload(this, 'document');
    });
    
    // Drag and drop handlers
    initializeDragAndDrop();
}

function handleFileUpload(input, type) {
    var file = input.files[0];
    if (!file) return;
    
    var maxSize = type === 'image' ? 5 * 1024 * 1024 : 10 * 1024 * 1024; // 5MB for images, 10MB for documents
    var allowedTypes = type === 'image' 
        ? ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg+xml']
        : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
           'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
           'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
    
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
        var typeText = type === 'image' ? 'hình ảnh (JPG, PNG, GIF, WebP, BMP, SVG)' : 'tài liệu (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX)';
        showToast('error', 'Chỉ chấp nhận file ' + typeText);
        input.value = '';
        return;
    }
    
    // Validate file size
    if (file.size > maxSize) {
        var sizeText = type === 'image' ? '5MB' : '10MB';
        showToast('error', 'File không được vượt quá ' + sizeText);
        input.value = '';
        return;
    }
    
    // Show preview
    showFilePreview(file, type);
}

function showFilePreview(file, type) {
    var dropZone = $('#' + type + 'DropZone');
    var preview = $('#' + type + 'Preview');
    var fileName = $('#' + type + 'FileName');
    
    fileName.text(file.name + ' (' + formatFileSize(file.size) + ')');
    
    if (type === 'image') {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#previewImage').attr('src', e.target.result);
        };
        reader.readAsDataURL(file);
    }
    
    dropZone.hide();
    preview.show();
}

function removeFilePreview(type) {
    var input = $('#' + type + 'File');
    var dropZone = $('#' + type + 'DropZone');
    var preview = $('#' + type + 'Preview');
    
    input.val('');
    preview.hide();
    dropZone.show();
}

function initializeDragAndDrop() {
    // Prevent default drag behaviors
    $(document).on('dragenter dragover drop', function(e) {
        e.preventDefault();
    });
    
    // Image drop zone
    $('#imageDropZone').on('dragenter dragover', function(e) {
        e.preventDefault();
        $(this).addClass('drag-over');
    });
    
    $('#imageDropZone').on('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('drag-over');
    });
    
    $('#imageDropZone').on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('drag-over');
        
        var files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            var input = $('#imageFile')[0];
            input.files = files;
            handleFileUpload(input, 'image');
        }
    });
    
    // Document drop zone
    $('#documentDropZone').on('dragenter dragover', function(e) {
        e.preventDefault();
        $(this).addClass('drag-over');
    });
    
    $('#documentDropZone').on('dragleave', function(e) {
        e.preventDefault();
        $(this).removeClass('drag-over');
    });
    
    $('#documentDropZone').on('drop', function(e) {
        e.preventDefault();
        $(this).removeClass('drag-over');
        
        var files = e.originalEvent.dataTransfer.files;
        if (files.length > 0) {
            var input = $('#documentFile')[0];
            input.files = files;
            handleFileUpload(input, 'document');
        }
    });
}

// Table Interactions
function initializeTableInteractions() {
    // Toggle switches
    $('.toggle-switch input').on('change', function() {
        var checkbox = $(this);
        var projectId = checkbox.closest('tr').data('project-id');
        var isPublish = checkbox.attr('id').includes('publish');
        var endpoint = isPublish ? 'toggle-publish' : 'toggle-featured';
        
        toggleProjectStatus(projectId, endpoint, checkbox);
    });
    
    // Delete buttons
    $('.btn-danger').on('click', function(e) {
        e.preventDefault();
        var projectId = $(this).closest('tr').data('project-id');
        confirmDeleteProject(projectId);
    });
}

function toggleProjectStatus(projectId, endpoint, checkbox) {
    var originalState = checkbox.prop('checked');
    
    $.ajax({
        url: '/admin/projects/' + endpoint + '/' + projectId,
        type: 'POST',
        data: {
            __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },
        success: function(response) {
            if (response.success) {
                showToast('success', response.message);
            } else {
                showToast('error', response.message);
                // Revert checkbox state
                checkbox.prop('checked', !originalState);
            }
        },
        error: function() {
            showToast('error', 'Có lỗi xảy ra khi cập nhật trạng thái');
            // Revert checkbox state
            checkbox.prop('checked', !originalState);
        }
    });
}

function confirmDeleteProject(projectId) {
    if (confirm('Bạn có chắc chắn muốn xóa dự án này?\n\nDự án sẽ được chuyển vào thùng rác và có thể khôi phục sau.')) {
        deleteProject(projectId);
    }
}

function deleteProject(projectId) {
    $.ajax({
        url: '/admin/projects/delete/' + projectId,
        type: 'POST',
        data: {
            __RequestVerificationToken: $('input[name="__RequestVerificationToken"]').val()
        },
        success: function(response) {
            if (response.success) {
                showToast('success', response.message);
                // Remove row from table
                $('tr[data-project-id="' + projectId + '"]').fadeOut(500, function() {
                    $(this).remove();
                    updateTableStats();
                });
            } else {
                showToast('error', response.message);
            }
        },
        error: function() {
            showToast('error', 'Có lỗi xảy ra khi xóa dự án');
        }
    });
}

// Search and Filters
function initializeSearchAndFilters() {
    // Auto-submit search form with delay
    var searchTimeout;
    $('#search').on('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            $('.filters-form').submit();
        }, 500);
    });
    
    // Auto-submit on filter change
    $('.filters-form select').on('change', function() {
        $('.filters-form').submit();
    });
}

// Utility Functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showToast(type, message) {
    // Remove existing toasts
    $('.toast').remove();
    
    // Create new toast
    var toast = $('<div class="toast toast-' + type + '">' + message + '</div>');
    $('body').append(toast);
    
    // Show toast with animation
    toast.fadeIn(300).delay(4000).fadeOut(300, function() {
        $(this).remove();
    });
}

function updateTableStats() {
    // Update statistics after row removal
    var totalRows = $('.projects-table tbody tr').length;
    $('.table-header h3').text('Danh sách Dự án (' + totalRows + ')');
    
    // Update stat cards if they exist
    var totalCard = $('.stat-card').first().find('h3');
    if (totalCard.length) {
        totalCard.text(totalRows);
    }
}

// Media Viewers
function viewImage(imageUrl, title) {
    var modal = $('#imageModal');
    modal.find('#modalImage').attr('src', imageUrl).attr('alt', title);
    modal.find('#downloadImage').attr('href', imageUrl);
    modal.find('.modal-title').text('Xem Hình ảnh: ' + title);
    modal.modal('show');
}

function viewDocument(documentUrl, title) {
    var modal = $('#documentModal');
    modal.find('#documentName').text(title);
    modal.find('#openDocument').attr('href', documentUrl);
    modal.find('.modal-title').text('Xem Tài liệu: ' + title);
    modal.modal('show');
}

// Progress Range Slider
$(document).on('input', '#progressRange', function() {
    var value = $(this).val();
    $('#progressValue').text(value + '%');
});

// Character Counter
$(document).on('input', '#Title', function() {
    var length = $(this).val().length;
    var counter = $('#title-count');
    counter.text(length);
    
    if (length > 450) {
        counter.addClass('text-warning');
    } else {
        counter.removeClass('text-warning');
    }
});

// Category Management (if needed)
function loadCategories() {
    $.ajax({
        url: '/admin/projects/api/project-categories',
        type: 'GET',
        success: function(data) {
            updateCategoryDropdown(data);
        },
        error: function() {
            showToast('error', 'Không thể tải danh sách danh mục');
        }
    });
}

function updateCategoryDropdown(categories) {
    var dropdown = $('#Category');
    if (dropdown.length) {
        var currentValue = dropdown.val();
        dropdown.empty().append('<option value="">-- Chọn danh mục --</option>');
        
        categories.forEach(function(category) {
            var option = $('<option></option>')
                .attr('value', category.CategoryCode)
                .text(category.CategoryName);
            
            if (category.CategoryCode === currentValue) {
                option.prop('selected', true);
            }
            
            dropdown.append(option);
        });
    }
}

// Export functions for global access
window.AdminProjects = {
    viewImage: viewImage,
    viewDocument: viewDocument,
    deleteProject: confirmDeleteProject,
    togglePublish: function(projectId) {
        var checkbox = $('#publish-' + projectId);
        toggleProjectStatus(projectId, 'toggle-publish', checkbox);
    },
    toggleFeatured: function(projectId) {
        var checkbox = $('#featured-' + projectId);
        toggleProjectStatus(projectId, 'toggle-featured', checkbox);
    },
    removeImagePreview: function() {
        removeFilePreview('image');
    },
    removeDocumentPreview: function() {
        removeFilePreview('document');
    },
    showToast: showToast
};

// Make functions available globally for inline event handlers
window.viewImage = viewImage;
window.viewDocument = viewDocument;
window.deleteProject = confirmDeleteProject;
window.togglePublish = function(projectId) {
    AdminProjects.togglePublish(projectId);
};
window.toggleFeatured = function(projectId) {
    AdminProjects.toggleFeatured(projectId);
};
window.removeImagePreview = function() {
    AdminProjects.removeImagePreview();
};
window.removeDocumentPreview = function() {
    AdminProjects.removeDocumentPreview();
};
