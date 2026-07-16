/**
 * Hide Google Translate UI - Enhanced Version
 * Author: AI Assistant
 * Date: 2025-10-07
 * Features: Complete UI hiding, performance optimized, mobile responsive
 */

(function() {
    'use strict';
    
    console.log('🎨 Hide Google Translate UI v2.0 - Initializing...');

    // Function to hide Google Translate UI elements
    function hideGoogleTranslateUI() {
        // Elements to hide
        const selectors = [
            '.goog-te-banner-frame',
            '.goog-te-gadget',
            '.goog-te-ftab', 
            '.goog-te-balloon-frame',
            '.goog-te-menu-frame',
            '.goog-te-combo',
            '#google_translate_element',
            '.skiptranslate',
            'iframe.goog-te-banner-frame'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el) {
                    el.style.setProperty('display', 'none', 'important');
                    el.style.setProperty('visibility', 'hidden', 'important');
                    el.style.setProperty('opacity', '0', 'important');
                    el.style.setProperty('height', '0', 'important');
                    el.style.setProperty('position', 'absolute', 'important');
                    el.style.setProperty('top', '-9999px', 'important');
                    el.style.setProperty('left', '-9999px', 'important');
                }
            });
        });

        // Remove body margin added by Google Translate
        if (document.body) {
            document.body.style.setProperty('margin-top', '0', 'important');
            document.body.style.setProperty('top', '0', 'important');
            document.body.style.setProperty('padding-top', '0', 'important');
        }

        // Remove html margin
        if (document.documentElement) {
            document.documentElement.style.setProperty('margin-top', '0', 'important');
            document.documentElement.style.setProperty('padding-top', '0', 'important');
        }
    }

    // Hide immediately
    hideGoogleTranslateUI();

    // Hide repeatedly to catch dynamically added elements
    setTimeout(hideGoogleTranslateUI, 100);
    setTimeout(hideGoogleTranslateUI, 500);
    setTimeout(hideGoogleTranslateUI, 1000);
    setTimeout(hideGoogleTranslateUI, 2000);
    setTimeout(hideGoogleTranslateUI, 3000);

    // Monitor for new elements and hide them
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            let shouldHide = false;
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            const className = node.className || '';
                            const id = node.id || '';
                            if (className.includes('goog-te') || 
                                id.includes('google_translate') ||
                                className.includes('skiptranslate')) {
                                shouldHide = true;
                            }
                        }
                    });
                }
            });
            
            if (shouldHide) {
                setTimeout(hideGoogleTranslateUI, 10);
            }
        });

        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Also hide on DOM ready and window load
    document.addEventListener('DOMContentLoaded', hideGoogleTranslateUI);
    window.addEventListener('load', hideGoogleTranslateUI);

    // Enhanced CSS injection for complete UI hiding
    function injectHidingCSS() {
        const style = document.createElement('style');
        style.id = 'gt-ui-hider';
        style.textContent = `
            /* Complete Google Translate UI hiding */
            .goog-te-banner-frame,
            .goog-te-gadget,
            .goog-te-ftab,
            .goog-te-balloon-frame,
            .goog-te-menu-frame,
            .goog-te-combo,
            #google_translate_element,
            .skiptranslate,
            iframe.goog-te-banner-frame,
            .goog-te-menu-value,
            .goog-te-menu2,
            .goog-te-menu2-item,
            .goog-te-spinner-pos {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                width: 0 !important;
                position: absolute !important;
                top: -9999px !important;
                left: -9999px !important;
                z-index: -1 !important;
            }
            
            /* Fix body positioning */
            body {
                margin-top: 0 !important;
                top: 0 !important;
                padding-top: 0 !important;
                position: relative !important;
            }
            
            html {
                margin-top: 0 !important;
                padding-top: 0 !important;
            }
            
            /* Hide any iframe with Google Translate */
            iframe[src*="translate.google"] {
                display: none !important;
            }
            
            /* Mobile responsive hiding */
            @media (max-width: 768px) {
                .goog-te-banner-frame,
                .goog-te-gadget {
                    display: none !important;
                }
            }
        `;
        
        if (!document.getElementById('gt-ui-hider')) {
            document.head.appendChild(style);
        }
    }
    
    // Inject CSS immediately
    injectHidingCSS();
    
    // Performance monitoring
    let hideCount = 0;
    const startTime = performance.now();
    
    function logPerformance() {
        const duration = performance.now() - startTime;
        console.log(`🎯 GT UI Hider: ${hideCount} elements hidden in ${Math.round(duration)}ms`);
    }
    
    // Enhanced hiding with performance tracking
    const originalHide = hideGoogleTranslateUI;
    hideGoogleTranslateUI = function() {
        hideCount++;
        originalHide();
        if (hideCount % 10 === 0) {
            logPerformance();
        }
    };

    console.log('✅ Google Translate UI Hiding System v2.0 - Activated with Enhanced Protection');

})();
