// Admin Activity Form JavaScript
$(document).ready(function() {
    initializeActivityForm();
});

function initializeActivityForm() {
    setupFileUploads();
    setupFormValidation();
    setupDateTimeHandling();
    setupCharacterCounters();
}

// Setup file uploads with drag & drop
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
    
    // Drag and drop events
    $uploadArea.on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('dragover');
    });
    
    $uploadArea.on('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('dragover');
    });
    
    $uploadArea.on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
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
    
    // Drag and drop events
    $uploadArea.on('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('dragover');
    });
    
    $uploadArea.on('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('dragover');
    });
    
    $uploadArea.on('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
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

// File validation functions
function validateImageFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
        showError('Chỉ hỗ trợ file ảnh: JPG, PNG, GIF, WebP, BMP');
        return false;
    }
    
    if (file.size > maxSize) {
        showError('File ảnh không được vượt quá 5MB');
        return false;
    }
    
    return true;
}

function validateDocumentFile(file) {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.substring(fileName.lastIndexOf('.'));
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!allowedExtensions.includes(fileExtension)) {
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
        $('#imagePreview').show().addClass('fade-in');
        $('#imageUploadArea').hide();
        
        // Show file info
        const fileSize = (file.size / 1024).toFixed(2);
        $('#imageInfo').html(`
            <small class="text-muted">
                <i class="fas fa-file-image"></i> ${file.name} (${fileSize} KB)
            </small>
        `);
    };
    reader.readAsDataURL(file);
}

function showDocumentPreview(file) {
    const fileSize = (file.size / 1024).toFixed(2);
    const fileIcon = getFileIcon(file.name);
    
    $('#documentName').html(`
        <i class="fas ${fileIcon}"></i> ${file.name}
        <small class="d-block text-muted">${fileSize} KB</small>
    `);
    $('#documentPreview').show().addClass('fade-in');
    $('#documentUploadArea').hide();
}

// Get file icon based on extension
function getFileIcon(fileName) {
    const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    const icons = {
        '.pdf': 'fa-file-pdf',
        '.doc': 'fa-file-word',
        '.docx': 'fa-file-word',
        '.xls': 'fa-file-excel',
        '.xlsx': 'fa-file-excel',
        '.ppt': 'fa-file-powerpoint',
        '.pptx': 'fa-file-powerpoint'
    };
    return icons[extension] || 'fa-file-alt';
}

// Remove file previews
function removeImagePreview() {
    $('#imageFile').val('');
    $('#imagePreview').hide().removeClass('fade-in');
    $('#imageUploadArea').show();
    $('#imageInfo').empty();
}

function removeDocumentPreview() {
    $('#documentFile').val('');
    $('#documentPreview').hide().removeClass('fade-in');
    $('#documentUploadArea').show();
}

// Setup form validation
function setupFormValidation() {
    const $form = $('.activity-form');
    
    // Real-time validation
    $form.find('input[required], textarea[required], select[required]').on('blur', function() {
        validateField($(this));
    });
    
    $form.find('input, textarea').on('input', function() {
        const $field = $(this);
        if ($field.hasClass('is-invalid')) {
            validateField($field);
        }
    });
    
    // Form submission
    $form.on('submit', function(e) {
        let isValid = true;
        
        // Validate all required fields
        $(this).find('input[required], textarea[required], select[required]').each(function() {
            if (!validateField($(this))) {
                isValid = false;
            }
        });
        
        // Validate dates
        if (!validateDates()) {
            isValid = false;
        }
        
        if (!isValid) {
            e.preventDefault();
            showError('Vui lòng kiểm tra lại thông tin đã nhập');
            
            // Scroll to first error
            const $firstError = $('.is-invalid').first();
            if ($firstError.length) {
                $('html, body').animate({
                    scrollTop: $firstError.offset().top - 100
                }, 500);
            }
        } else {
            // Show loading state
            const $submitBtn = $form.find('button[type="submit"]');
            $submitBtn.prop('disabled', true);
            $submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Đang lưu...');
        }
    });
}

// Validate individual field
function validateField($field) {
    const field = $field[0];
    let isValid = field.checkValidity();
    
    // Custom validation rules
    if (isValid && $field.attr('name') === 'Title') {
        const title = $field.val().trim();
        if (title.length < 5) {
            isValid = false;
            field.setCustomValidity('Tiêu đề phải có ít nhất 5 ký tự');
        } else if (title.length > 300) {
            isValid = false;
            field.setCustomValidity('Tiêu đề không được vượt quá 300 ký tự');
        } else {
            field.setCustomValidity('');
        }
    }
    
    // Update field appearance
    if (isValid) {
        $field.removeClass('is-invalid').addClass('is-valid');
        $field.siblings('.invalid-feedback').hide();
    } else {
        $field.removeClass('is-valid').addClass('is-invalid');
        
        // Show custom error message
        let errorMsg = field.validationMessage;
        let $feedback = $field.siblings('.invalid-feedback');
        
        if (!$feedback.length) {
            $feedback = $('<div class="invalid-feedback"></div>');
            $field.after($feedback);
        }
        
        $feedback.text(errorMsg).show();
    }
    
    return isValid;
}

// Validate date range
function validateDates() {
    const startDate = $('#StartDate').val();
    const endDate = $('#EndDate').val();
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (end < start) {
            $('#EndDate').addClass('is-invalid');
            let $feedback = $('#EndDate').siblings('.invalid-feedback');
            if (!$feedback.length) {
                $feedback = $('<div class="invalid-feedback"></div>');
                $('#EndDate').after($feedback);
            }
            $feedback.text('Ngày kết thúc phải sau ngày bắt đầu').show();
            return false;
        } else {
            $('#EndDate').removeClass('is-invalid');
            $('#EndDate').siblings('.invalid-feedback').hide();
        }
    }
    
    return true;
}

// Setup date/time handling
function setupDateTimeHandling() {
    // Set default start date to today
    const today = new Date();
    const todayString = today.toISOString().slice(0, 16);
    
    const $startDate = $('#StartDate');
    if (!$startDate.val()) {
        $startDate.val(todayString);
    }
    
    // Auto-set end date when start date changes
    $startDate.on('change', function() {
        const startDate = new Date($(this).val());
        const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // Add 2 hours
        
        const $endDate = $('#EndDate');
        if (!$endDate.val() || new Date($endDate.val()) < startDate) {
            $endDate.val(endDate.toISOString().slice(0, 16));
        }
    });
}

// Setup character counters
function setupCharacterCounters() {
    const counters = [
        { field: '#Title', max: 300, target: '#titleCounter' },
        { field: '#Description', max: 1000, target: '#descriptionCounter' },
        { field: '#Location', max: 200, target: '#locationCounter' }
    ];
    
    counters.forEach(counter => {
        const $field = $(counter.field);
        const $target = $(counter.target);
        
        if ($field.length && $target.length) {
            // Create counter if doesn't exist
            if (!$target.length) {
                $field.after(`<small id="${counter.target.substring(1)}" class="form-text text-muted character-counter"></small>`);
            }
            
            // Update counter on input
            $field.on('input', function() {
                updateCharacterCounter($field, counter.max, counter.target);
            });
            
            // Initial update
            updateCharacterCounter($field, counter.max, counter.target);
        }
    });
}

function updateCharacterCounter($field, maxLength, targetSelector) {
    const currentLength = $field.val().length;
    const remaining = maxLength - currentLength;
    const $counter = $(targetSelector);
    
    if (!$counter.length) {
        $counter = $(`<small class="form-text text-muted character-counter">${currentLength}/${maxLength}</small>`);
        $field.after($counter);
    }
    
    $counter.text(`${currentLength}/${maxLength}`);
    
    if (remaining < 0) {
        $counter.addClass('text-danger').removeClass('text-muted text-warning');
    } else if (remaining < maxLength * 0.1) {
        $counter.addClass('text-warning').removeClass('text-muted text-danger');
    } else {
        $counter.addClass('text-muted').removeClass('text-danger text-warning');
    }
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

// Auto-save functionality (optional)
function setupAutoSave() {
    let autoSaveTimer;
    const AUTOSAVE_DELAY = 30000; // 30 seconds
    
    $('.activity-form input, .activity-form textarea, .activity-form select').on('input change', function() {
        clearTimeout(autoSaveTimer);
        autoSaveTimer = setTimeout(function() {
            autoSaveForm();
        }, AUTOSAVE_DELAY);
    });
}

function autoSaveForm() {
    const formData = $('.activity-form').serialize();
    
    // Save to localStorage
    localStorage.setItem('activity_form_autosave', formData);
    localStorage.setItem('activity_form_autosave_time', new Date().toISOString());
    
    // Show auto-save indicator
    showAutoSaveIndicator();
}

function showAutoSaveIndicator() {
    const $indicator = $('#autoSaveIndicator');
    if (!$indicator.length) {
        $('.admin-header').append('<div id="autoSaveIndicator" class="auto-save-indicator"><i class="fas fa-save"></i> Đã lưu tự động</div>');
    }
    
    $('#autoSaveIndicator').fadeIn().delay(2000).fadeOut();
}

// Load auto-saved data
function loadAutoSavedData() {
    const savedData = localStorage.getItem('activity_form_autosave');
    const savedTime = localStorage.getItem('activity_form_autosave_time');
    
    if (savedData && savedTime) {
        const saveTime = new Date(savedTime);
        const now = new Date();
        const timeDiff = (now - saveTime) / (1000 * 60); // minutes
        
        // Only restore if saved within last hour
        if (timeDiff < 60) {
            if (confirm('Có dữ liệu đã lưu tự động. Bạn có muốn khôi phục không?')) {
                // Parse and restore form data
                const params = new URLSearchParams(savedData);
                for (let [key, value] of params) {
                    const $field = $(`[name="${key}"]`);
                    if ($field.length) {
                        if ($field.is(':checkbox')) {
                            $field.prop('checked', value === 'true');
                        } else {
                            $field.val(value);
                        }
                    }
                }
            }
        }
    }
}

// Clear auto-saved data
function clearAutoSavedData() {
    localStorage.removeItem('activity_form_autosave');
    localStorage.removeItem('activity_form_autosave_time');
}

// Global functions
window.removeImagePreview = removeImagePreview;
window.removeDocumentPreview = removeDocumentPreview;
