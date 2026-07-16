/**
 * Bootstrap Compatibility Fix
 * Ensures Bootstrap button plugin works correctly
 * Author: AI Assistant
 * Date: 2025-10-07
 */

(function() {
    'use strict';
    
    console.log('🔧 Bootstrap Compatibility Fix - Loading...');
    
    // Wait for jQuery to be available
    function waitForjQuery(callback) {
        if (typeof jQuery !== 'undefined') {
            callback();
        } else {
            setTimeout(function() {
                waitForjQuery(callback);
            }, 100);
        }
    }
    
    // Wait for Bootstrap to be available
    function waitForBootstrap(callback) {
        if (typeof jQuery !== 'undefined' && jQuery.fn.button) {
            callback();
        } else {
            setTimeout(function() {
                waitForBootstrap(callback);
            }, 100);
        }
    }
    
    // Initialize compatibility fixes
    waitForjQuery(function() {
        console.log('✅ jQuery loaded');
        
        // Check if Bootstrap button plugin is available
        waitForBootstrap(function() {
            console.log('✅ Bootstrap button plugin available');
        });
        
        // Fallback button function if Bootstrap is not available
        setTimeout(function() {
            if (typeof jQuery.fn.button === 'undefined') {
                console.warn('⚠️ Bootstrap button plugin not found, creating fallback...');
                
                jQuery.fn.button = function(action) {
                    return this.each(function() {
                        var $this = jQuery(this);
                        var originalText = $this.data('original-text') || $this.text();
                        
                        if (!$this.data('original-text')) {
                            $this.data('original-text', originalText);
                        }
                        
                        switch(action) {
                            case 'loading':
                                $this.prop('disabled', true)
                                     .text('Đang tải...')
                                     .addClass('disabled');
                                break;
                            case 'reset':
                                $this.prop('disabled', false)
                                     .text(originalText)
                                     .removeClass('disabled');
                                break;
                            default:
                                // Handle other actions or no action
                                break;
                        }
                    });
                };
                
                console.log('✅ Bootstrap button fallback created');
            }
        }, 500);
    });
    
    // Additional compatibility for common Bootstrap components
    document.addEventListener('DOMContentLoaded', function() {
        // Ensure all buttons have proper data attributes
        var buttons = document.querySelectorAll('button[data-loading-text], .btn[data-loading-text]');
        buttons.forEach(function(button) {
            var $btn = jQuery(button);
            if (!$btn.data('original-text')) {
                $btn.data('original-text', $btn.text());
            }
        });
        
        console.log('🔧 Bootstrap Compatibility Fix - Ready');
    });
    
})();
