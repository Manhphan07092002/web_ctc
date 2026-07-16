// Modern UI Interactions and Animations
// Enhanced user experience with smooth animations and micro-interactions

class ModernUIManager {
    constructor() {
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParallaxEffects();
        this.setupMicroInteractions();
        this.setupSmartLoading();
        this.setupAdvancedSearch();
        this.setupThemeToggle();
        this.setupPerformanceOptimizations();
    }

    // Scroll-based animations
    setupScrollAnimations() {
        // Check if IntersectionObserver is supported
        if (!window.IntersectionObserver) {
            console.warn('IntersectionObserver not supported');
            return;
        }

        // Intersection Observer for reveal animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Add staggered animation for children
                    const children = entry.target.querySelectorAll('.stagger-child');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('revealed');
                        }, index * 100);
                    });
                }
            });
        }, this.observerOptions);

        // Observe elements for scroll animations
        const elementsToObserve = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right');
        if (elementsToObserve.length > 0) {
            elementsToObserve.forEach(el => {
                observer.observe(el);
            });
        }

        // Smooth scroll behavior
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Parallax effects for hero section
    setupParallaxEffects() {
        const hero = document.querySelector('.activities-hero');
        if (!hero) return;

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            hero.style.transform = `translateY(${parallax}px)`;
            
            // Update hero content opacity
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent) {
                const opacity = Math.max(0, 1 - scrolled / (hero.offsetHeight * 0.8));
                heroContent.style.opacity = opacity;
            }
            
            ticking = false;
        };

        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // Micro-interactions for better UX
    setupMicroInteractions() {
        // Ripple effect for buttons
        this.addRippleEffect();
        
        // Magnetic effect for cards
        this.addMagneticEffect();
        
        // Floating labels
        this.setupFloatingLabels();
        
        // Progress indicators
        this.setupProgressIndicators();
        
        // Haptic feedback simulation
        this.setupHapticFeedback();
    }

    addRippleEffect() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('.btn-primary, .btn-secondary, .filter-tab');
            if (!button) return;

            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
                z-index: 1000;
            `;

            // Add ripple animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);

            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    addMagneticEffect() {
        const cards = document.querySelectorAll('.activity-card, .stat-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.1;
                const moveY = y * 0.1;
                
                card.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    setupFloatingLabels() {
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
        
        inputs.forEach(input => {
            const wrapper = document.createElement('div');
            wrapper.className = 'floating-label-wrapper';
            
            const label = document.createElement('label');
            label.textContent = input.placeholder;
            label.className = 'floating-label';
            
            input.parentNode.insertBefore(wrapper, input);
            wrapper.appendChild(input);
            wrapper.appendChild(label);
            
            input.addEventListener('focus', () => {
                label.classList.add('active');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.classList.remove('active');
                }
            });
            
            // Check if input has value on load
            if (input.value) {
                label.classList.add('active');
            }
        });
    }

    setupProgressIndicators() {
        // Reading progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
        document.body.appendChild(progressBar);

        const updateProgress = () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            const fill = progressBar.querySelector('.reading-progress-fill');
            fill.style.width = `${Math.min(scrollPercent, 100)}%`;
        };

        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    setupHapticFeedback() {
        // Simulate haptic feedback with subtle animations
        const interactiveElements = document.querySelectorAll('button, .activity-card, .notification-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('click', () => {
                element.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    element.style.transform = '';
                }, 100);
                
                // Vibrate if supported
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
    }

    // Smart loading states
    setupSmartLoading() {
        // Skeleton loading for cards
        this.createSkeletonLoaders();
        
        // Progressive image loading
        this.setupProgressiveImages();
        
        // Lazy loading for heavy content
        this.setupLazyLoading();
    }

    createSkeletonLoaders() {
        const containers = document.querySelectorAll('.activities-grid, .notifications-grid');
        
        containers.forEach(container => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // Remove skeleton when real content is added
                        container.querySelectorAll('.skeleton-card').forEach(skeleton => {
                            skeleton.remove();
                        });
                    }
                });
            });
            
            observer.observe(container, { childList: true });
        });
    }

    setupProgressiveImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const placeholder = img.previousElementSibling;
                    
                    img.src = img.dataset.src;
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                        if (placeholder && placeholder.classList.contains('image-placeholder')) {
                            placeholder.remove();
                        }
                    });
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }

    setupLazyLoading() {
        // Lazy load heavy components
        const lazyComponents = document.querySelectorAll('[data-lazy]');
        
        const componentObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const component = entry.target;
                    const componentType = component.dataset.lazy;
                    
                    this.loadComponent(componentType, component);
                    componentObserver.unobserve(component);
                }
            });
        });
        
        lazyComponents.forEach(component => componentObserver.observe(component));
    }

    loadComponent(type, container) {
        switch (type) {
            case 'charts':
                this.loadCharts(container);
                break;
            case 'calendar':
                this.loadCalendar(container);
                break;
            case 'timeline':
                this.loadTimeline(container);
                break;
        }
    }

    // Advanced search with real-time suggestions
    setupAdvancedSearch() {
        const searchInput = document.getElementById('advancedSearchInput');
        if (!searchInput) return;

        let searchTimeout;
        
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            
            searchTimeout = setTimeout(() => {
                this.performAdvancedSearch(e.target.value);
            }, 300);
        });

        // Voice search support
        if ('webkitSpeechRecognition' in window) {
            this.setupVoiceSearch(searchInput);
        }
    }

    performAdvancedSearch(query) {
        if (!query.trim()) return;

        // Highlight search terms
        this.highlightSearchTerms(query);
        
        // Update search analytics
        this.trackSearchAnalytics(query);
        
        // Show search suggestions
        this.showSearchSuggestions(query);
    }

    highlightSearchTerms(query) {
        const terms = query.toLowerCase().split(' ');
        const textElements = document.querySelectorAll('.activity-title, .activity-description, .notification-title');
        
        textElements.forEach(element => {
            let html = element.innerHTML;
            
            terms.forEach(term => {
                if (term.length > 2) {
                    const regex = new RegExp(`(${term})`, 'gi');
                    html = html.replace(regex, '<mark class="search-highlight">$1</mark>');
                }
            });
            
            element.innerHTML = html;
        });
    }

    setupVoiceSearch(input) {
        const voiceBtn = document.createElement('button');
        voiceBtn.className = 'voice-search-btn';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.title = 'Tìm kiếm bằng giọng nói';
        
        input.parentNode.appendChild(voiceBtn);
        
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'vi-VN';
        recognition.continuous = false;
        
        voiceBtn.addEventListener('click', () => {
            recognition.start();
            voiceBtn.classList.add('listening');
        });
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            input.value = transcript;
            input.dispatchEvent(new Event('input'));
            voiceBtn.classList.remove('listening');
        };
        
        recognition.onerror = () => {
            voiceBtn.classList.remove('listening');
        };
    }

    // Theme toggle functionality
    setupThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = 'Chuyển đổi chế độ tối';
        
        // Add to header or create floating button
        const header = document.querySelector('header') || document.body;
        header.appendChild(themeToggle);
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            const icon = themeToggle.querySelector('i');
            icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            
            // Animate transition
            document.body.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 300);
        });
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Debounce scroll events
        this.debounceScrollEvents();
        
        // Optimize animations
        this.optimizeAnimations();
        
        // Preload critical resources
        this.preloadResources();
        
        // Monitor performance
        this.monitorPerformance();
    }

    debounceScrollEvents() {
        let scrollTimer = null;
        
        window.addEventListener('scroll', () => {
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }
            
            scrollTimer = setTimeout(() => {
                // Scroll ended
                document.body.classList.remove('scrolling');
            }, 150);
            
            document.body.classList.add('scrolling');
        }, { passive: true });
    }

    optimizeAnimations() {
        // Reduce animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            document.documentElement.classList.add('reduced-animations');
        }
        
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.documentElement.classList.add('paused-animations');
            } else {
                document.documentElement.classList.remove('paused-animations');
            }
        });
    }

    preloadResources() {
        // Preload critical images
        const criticalImages = [
            '/Content/images/hero-bg.jpg',
            '/Content/images/activity-placeholder.jpg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    monitorPerformance() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(console.log);
                getFID(console.log);
                getFCP(console.log);
                getLCP(console.log);
                getTTFB(console.log);
            });
        }
        
        // Monitor memory usage
        if (performance.memory) {
            setInterval(() => {
                const memoryInfo = performance.memory;
                if (memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize > 0.9) {
                    console.warn('High memory usage detected');
                }
            }, 30000);
        }
    }

    // Utility methods
    trackSearchAnalytics(query) {
        // Track search queries for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search', {
                search_term: query
            });
        }
    }

    showSearchSuggestions(query) {
        // Implementation for search suggestions
        const suggestions = this.generateSuggestions(query);
        const suggestionsContainer = document.getElementById('searchSuggestions');
        
        if (suggestionsContainer && suggestions.length > 0) {
            suggestionsContainer.innerHTML = suggestions.map(suggestion => 
                `<div class="suggestion-item">${suggestion}</div>`
            ).join('');
            suggestionsContainer.classList.add('active');
        }
    }

    generateSuggestions(query) {
        // Generate smart suggestions based on query
        const commonSuggestions = [
            'Đại hội cổ đông',
            'Thông báo nghỉ lễ',
            'Chuyển đổi số',
            'An toàn lao động',
            'Đào tạo nhân viên'
        ];
        
        return commonSuggestions.filter(suggestion => 
            suggestion.toLowerCase().includes(query.toLowerCase())
        );
    }
}

// Initialize modern UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        const modernUI = new ModernUIManager();
        window.modernUI = modernUI;
    } catch (error) {
        console.warn('Modern UI initialization failed:', error);
        // Fallback to basic functionality
    }
});

// Add CSS for additional components
const additionalStyles = `
    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(99, 102, 241, 0.2);
        z-index: 9999;
    }
    
    .reading-progress-fill {
        height: 100%;
        background: var(--gradient-primary);
        width: 0%;
        transition: width 0.3s ease;
    }
    
    .floating-label-wrapper {
        position: relative;
        margin-bottom: 1rem;
    }
    
    .floating-label {
        position: absolute;
        top: 50%;
        left: 1rem;
        transform: translateY(-50%);
        background: var(--bg-primary);
        padding: 0 0.5rem;
        color: var(--text-muted);
        transition: all 0.3s ease;
        pointer-events: none;
    }
    
    .floating-label.active {
        top: 0;
        font-size: 0.8rem;
        color: var(--primary-color);
    }
    
    .search-highlight {
        background: rgba(255, 235, 59, 0.3);
        padding: 0.1em 0.2em;
        border-radius: 0.2em;
    }
    
    .theme-toggle {
        position: fixed;
        bottom: 2rem;
        left: 2rem;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: var(--gradient-primary);
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    
    .theme-toggle:hover {
        transform: scale(1.1);
    }
    
    .voice-search-btn {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 1.1rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .voice-search-btn:hover {
        background: var(--bg-secondary);
        color: var(--primary-color);
    }
    
    .voice-search-btn.listening {
        color: var(--danger-color);
        animation: pulse 1s infinite;
    }
    
    [data-theme="dark"] {
        --bg-primary: #1f2937;
        --bg-secondary: #111827;
        --bg-tertiary: #374151;
        --text-primary: #f9fafb;
        --text-secondary: #d1d5db;
        --text-muted: #9ca3af;
    }
    
    .reduced-animations *,
    .reduced-animations *::before,
    .reduced-animations *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
    
    .paused-animations * {
        animation-play-state: paused !important;
    }
    
    .scrolling .parallax-element {
        will-change: transform;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);
