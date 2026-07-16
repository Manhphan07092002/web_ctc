/**
 * Header Responsive JavaScript
 * Handles mobile menu, scroll effects, and responsive behavior
 * Author: AI Assistant
 * Date: 2025-10-07
 */

(function() {
    'use strict';
    
    console.log('🎯 Header Responsive JS - Loading...');
    
    // Configuration
    const config = {
        scrollThreshold: 50,
        hideThreshold: 100,
        debounceDelay: 10,
        animationDuration: 300
    };
    
    // State management
    let isScrolled = false;
    let isMenuOpen = false;
    let lastScrollTop = 0;
    let scrollTimeout = null;
    
    // DOM elements
    let header = null;
    let menuToggle = null;
    let navCollapse = null;
    let languageSwitcher = null;
    
    // Initialize when DOM is ready
    function init() {
        // Cache DOM elements
        header = document.querySelector('.cb-header');
        menuToggle = document.querySelector('.navbar-toggle');
        navCollapse = document.querySelector('.navbar-collapse');
        languageSwitcher = document.querySelector('.language-switcher');
        
        if (!header) {
            console.warn('⚠️ Header element not found');
            return;
        }
        
        // Setup event listeners
        setupScrollHandler();
        setupMobileMenu();
        setupLanguageSwitcher();
        setupOutsideClickHandler();
        setupKeyboardNavigation();
        setupResizeHandler();
        setupHeaderHeightDetection();
        
        // Initial height check
        checkHeaderHeight();
        
        console.log('✅ Header Responsive JS - Initialized');
    }
    
    // Scroll handler with performance optimization
    function setupScrollHandler() {
        let ticking = false;
        
        function updateScrollState() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add/remove scrolled class
            if (scrollTop > config.scrollThreshold && !isScrolled) {
                header.classList.add('scrolled');
                isScrolled = true;
            } else if (scrollTop <= config.scrollThreshold && isScrolled) {
                header.classList.remove('scrolled');
                isScrolled = false;
            }
            
            // Auto-hide on mobile when scrolling down
            if (window.innerWidth <= 768) {
                if (scrollTop > lastScrollTop && scrollTop > config.hideThreshold) {
                    // Scrolling down
                    header.classList.add('header-hidden');
                } else {
                    // Scrolling up
                    header.classList.remove('header-hidden');
                }
            }
            
            lastScrollTop = scrollTop;
            ticking = false;
        }
        
        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(updateScrollState);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', onScroll, { passive: true });
    }
    
    // Mobile menu functionality
    function setupMobileMenu() {
        if (!menuToggle || !navCollapse) return;
        
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
        
        // Close menu when clicking on menu items
        const menuLinks = navCollapse.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        });
    }
    
    function toggleMobileMenu() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }
    
    function openMobileMenu() {
        navCollapse.classList.add('in');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        const firstMenuItem = navCollapse.querySelector('a');
        if (firstMenuItem) {
            setTimeout(() => firstMenuItem.focus(), 100);
        }
        
        isMenuOpen = true;
    }
    
    function closeMobileMenu() {
        navCollapse.classList.remove('in');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        isMenuOpen = false;
    }
    
    // Language switcher functionality
    function setupLanguageSwitcher() {
        if (!languageSwitcher) return;
        
        const toggle = languageSwitcher.querySelector('.dropdown-toggle');
        const menu = languageSwitcher.querySelector('.dropdown-menu');
        
        if (!toggle || !menu) return;
        
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleLanguageMenu();
        });
        
        // Handle language selection
        const languageOptions = menu.querySelectorAll('a, .language-option');
        languageOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                closeLanguageMenu();
            });
        });
    }
    
    function toggleLanguageMenu() {
        const isOpen = languageSwitcher.classList.contains('open');
        
        if (isOpen) {
            closeLanguageMenu();
        } else {
            openLanguageMenu();
        }
    }
    
    function openLanguageMenu() {
        // Close other dropdowns first
        closeAllDropdowns();
        
        languageSwitcher.classList.add('open');
        
        // Focus management
        const firstOption = languageSwitcher.querySelector('.dropdown-menu a');
        if (firstOption) {
            setTimeout(() => firstOption.focus(), 100);
        }
    }
    
    function closeLanguageMenu() {
        languageSwitcher.classList.remove('open');
    }
    
    function closeAllDropdowns() {
        closeLanguageMenu();
    }
    
    // Outside click handler
    function setupOutsideClickHandler() {
        document.addEventListener('click', function(e) {
            // Close mobile menu if clicking outside
            if (isMenuOpen && !header.contains(e.target)) {
                closeMobileMenu();
            }
            
            // Close language switcher if clicking outside
            if (languageSwitcher && !languageSwitcher.contains(e.target)) {
                closeLanguageMenu();
            }
        });
    }
    
    // Keyboard navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            // ESC key closes menus
            if (e.key === 'Escape') {
                if (isMenuOpen) {
                    closeMobileMenu();
                    menuToggle.focus();
                }
                closeAllDropdowns();
            }
            
            // Enter/Space on toggle buttons
            if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('dropdown-toggle')) {
                e.preventDefault();
                toggleLanguageMenu();
            }
        });
    }
    
    // Resize handler
    function setupResizeHandler() {
        let resizeTimeout = null;
        
        function handleResize() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                // Close mobile menu on desktop
                if (window.innerWidth > 768 && isMenuOpen) {
                    closeMobileMenu();
                }
                
                // Remove header-hidden class on desktop
                if (window.innerWidth > 768) {
                    header.classList.remove('header-hidden');
                }
                
                // Close all dropdowns on resize
                closeAllDropdowns();
                
                // Check header height after resize
                checkHeaderHeight();
            }, 250);
        }
        
        window.addEventListener('resize', handleResize);
    }
    
    // Header height detection
    function setupHeaderHeightDetection() {
        // Monitor header height changes
        if (window.ResizeObserver) {
            const resizeObserver = new ResizeObserver(function(entries) {
                for (let entry of entries) {
                    checkHeaderHeight();
                }
            });
            
            resizeObserver.observe(header);
        }
    }
    
    // Check if header needs multi-line class
    function checkHeaderHeight() {
        if (!header) return;
        
        const container = header.querySelector('.container');
        if (!container) return;
        
        const navbar = container.querySelector('.navbar-nav');
        const navbarRight = container.querySelector('.navbar-right');
        
        if (!navbar) return;
        
        // Get container and content dimensions
        const containerWidth = container.offsetWidth;
        const containerPadding = window.innerWidth >= 1400 ? 40 : 32; // Adjust padding for large screens
        const availableWidth = containerWidth - containerPadding;
        
        // Calculate total width needed
        let totalContentWidth = 0;
        
        // Logo width
        const logo = header.querySelector('.logo-pc');
        if (logo) {
            totalContentWidth += logo.offsetWidth + 20; // Logo + margin
        }
        
        // Navigation items width
        const navItems = navbar.querySelectorAll('li');
        navItems.forEach(function(item) {
            totalContentWidth += item.offsetWidth + 8; // Item + gap
        });
        
        // Right side elements width
        if (navbarRight) {
            const rightItems = navbarRight.children;
            for (let i = 0; i < rightItems.length; i++) {
                totalContentWidth += rightItems[i].offsetWidth + 16; // Item + gap
            }
        }
        
        // Add/remove multi-line class based on content width
        if (totalContentWidth > availableWidth && window.innerWidth > 768) {
            header.classList.add('multi-line');
            updateBodyPadding();
        } else {
            header.classList.remove('multi-line');
            updateBodyPadding();
        }
    }
    
    // Update body padding based on header height
    function updateBodyPadding() {
        const headerHeight = header.offsetHeight;
        document.body.style.paddingTop = headerHeight + 'px';
    }
    
    // Smooth scroll to sections (if needed)
    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            const headerHeight = header.offsetHeight;
            const elementPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }
    
    // Public API
    window.HeaderResponsive = {
        init: init,
        toggleMobileMenu: toggleMobileMenu,
        closeMobileMenu: closeMobileMenu,
        toggleLanguageMenu: toggleLanguageMenu,
        closeLanguageMenu: closeLanguageMenu,
        smoothScrollTo: smoothScrollTo,
        checkHeaderHeight: checkHeaderHeight,
        updateBodyPadding: updateBodyPadding
    };
    
    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Close all menus when page becomes hidden
            closeMobileMenu();
            closeAllDropdowns();
        }
    });
    
    // Performance monitoring
    if (window.performance && window.performance.mark) {
        window.performance.mark('header-responsive-loaded');
    }
    
})();

// ===== AUTO-WRAP DETECTION SCRIPT =====
(function () {
    function applyHeaderWrap(){
        var header = document.querySelector('.cb-header');
        if(!header) return;

        var left  = header.querySelector('.cb_collapse .nav.navbar-nav');
        var right = header.querySelector('.cb_collapse .navbar-right');
        if(!left || !right) return;

        // Nếu top của khối phải > top của khối trái => đã rớt xuống hàng
        var wrapped = right.getBoundingClientRect().top - left.getBoundingClientRect().top > 10;
        header.classList.toggle('multi-line', wrapped);

        // Cập nhật padding-top cho body theo chiều cao header hiện tại
        document.body.style.paddingTop = header.offsetHeight + 'px';
        
        console.log('🔄 Header wrap detection:', wrapped ? 'Multi-line' : 'Single-line', 'Height:', header.offsetHeight + 'px');
    }

    // Gọi khi load, resize, và sau khi font tải xong (tránh "nhảy chữ")
    window.addEventListener('load', applyHeaderWrap, { once: true });
    window.addEventListener('resize', applyHeaderWrap);
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(applyHeaderWrap);
    }

    // Nếu bạn có toggle menu mobile, có thể gọi thêm mỗi khi mở/đóng:
    document.addEventListener('click', function(e){
        // ví dụ: khi người dùng bấm mở menu hoặc đổi ngôn ngữ… sau 1 tick đo lại
        setTimeout(applyHeaderWrap, 50);
    });
    
    // Initial call
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyHeaderWrap);
    } else {
        applyHeaderWrap();
    }
})();
