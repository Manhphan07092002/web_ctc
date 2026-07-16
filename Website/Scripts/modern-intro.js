// Modern Introduction Page JavaScript
// Smooth animations and interactions

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all animations and interactions
    initScrollAnimations();
    initCounterAnimations();
    initSmoothScrolling();
    initParallaxEffects();
    initHoverEffects();
    initReactBitsAnimations();
    initStaggerAnimations();
    
    // Scroll Animations using Intersection Observer
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = element.getAttribute('data-delay') || '0s';
                    
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, parseFloat(delay) * 1000);
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);
        
        // Observe all animated elements
        const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .bounce-in, .slide-scale, .rotate-in, .blur-in, .elastic-scale, .flip-in, .stagger-item');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Counter Animations for Statistics
    function initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    animateCounter(counter, target);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
    
    function animateCounter(element, target) {
        let current = 0;
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutQuart)
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            current = Math.floor(target * easeProgress);
            
            element.textContent = formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = formatNumber(target);
                // Add plus sign for certain counters
                if (target >= 50) {
                    element.textContent = formatNumber(target) + '+';
                }
            }
        }
        
        requestAnimationFrame(updateCounter);
    }
    
    // Format number with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    
    // Smooth Scrolling
    function initSmoothScrolling() {
        // Scroll indicator click
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', function() {
                const overviewSection = document.querySelector('#overview');
                if (overviewSection) {
                    overviewSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
        
        // Smooth scroll for all internal links
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        internalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Parallax Effects
    function initParallaxEffects() {
        let ticking = false;
        
        function updateParallax() {
            const scrolled = window.pageYOffset;
            
            // Hero floating elements parallax
            const floatingElements = document.querySelectorAll('.floating-element');
            floatingElements.forEach((element, index) => {
                const speed = 0.3 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            // Background patterns parallax
            const bgPatterns = document.querySelectorAll('.bg-pattern, .cta-pattern');
            bgPatterns.forEach(pattern => {
                const yPos = -(scrolled * 0.2);
                pattern.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    }
    
    // Enhanced Hover Effects
    function initHoverEffects() {
        // Card tilt effect
        const cards = document.querySelectorAll('.stat-card, .mission-card, .value-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) rotateX(5deg)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateX(0)';
            });
        });
        
        // Button ripple effect
        const modernButtons = document.querySelectorAll('.btn-modern');
        modernButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple-effect');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Image hover effects
        const heroImage = document.querySelector('.hero-image-wrapper');
        if (heroImage) {
            heroImage.addEventListener('mouseenter', function() {
                const decorations = this.querySelectorAll('.decoration-circle, .decoration-square');
                decorations.forEach(decoration => {
                    decoration.style.transform += ' scale(1.2)';
                });
            });
            
            heroImage.addEventListener('mouseleave', function() {
                const decorations = this.querySelectorAll('.decoration-circle, .decoration-square');
                decorations.forEach(decoration => {
                    decoration.style.transform = decoration.style.transform.replace(' scale(1.2)', '');
                });
            });
        }
    }
    
    // Navbar scroll effect (if exists)
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', function() {
                if (window.scrollY > 100) {
                    navbar.classList.add('navbar-scrolled');
                } else {
                    navbar.classList.remove('navbar-scrolled');
                }
            });
        }
    }
    
    // Loading animation for images
    function initImageLoading() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.complete) {
                img.style.opacity = '0';
                img.addEventListener('load', function() {
                    this.style.transition = 'opacity 0.5s ease';
                    this.style.opacity = '1';
                });
            }
        });
    }
    
    // Initialize additional features
    initNavbarScroll();
    initImageLoading();
    
    // Performance optimization for mobile
    if (window.innerWidth <= 768) {
        // Reduce animation complexity on mobile
        const style = document.createElement('style');
        style.textContent = `
            .floating-element {
                animation-duration: 8s !important;
            }
            .stat-card:hover,
            .mission-card:hover,
            .value-card:hover {
                transform: translateY(-4px) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Preload critical images
    const criticalImages = [
        '/Image/company-intro.jpg',
        '/Image/mission-vision.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Add custom cursor effect for interactive elements
    const interactiveElements = document.querySelectorAll('.btn-modern, .stat-card, .mission-card, .value-card');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            document.body.style.cursor = 'pointer';
        });
        
        element.addEventListener('mouseleave', function() {
            document.body.style.cursor = 'default';
        });
    });
    
    // Scroll progress indicator
    function initScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #1E88E5, #0066CC);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
    
    initScrollProgress();
    
    // React Bits Inspired Animations
    function initReactBitsAnimations() {
        // Magnetic effect for interactive elements
        const magneticElements = document.querySelectorAll('.magnetic');
        magneticElements.forEach(element => {
            element.addEventListener('mouseenter', function(e) {
                this.style.transform = 'scale(1.05) translateY(-2px)';
            });
            
            element.addEventListener('mouseleave', function(e) {
                this.style.transform = 'scale(1) translateY(0)';
            });
            
            element.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
            });
        });
        
        // Morphing button effects
        const morphingBtns = document.querySelectorAll('.morphing-btn');
        morphingBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                // Create ripple effect
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('morphing-ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
        
        // Glitch effect on hover
        const glitchElements = document.querySelectorAll('.glitch');
        glitchElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                this.style.animation = 'glitch 0.3s infinite';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.animation = 'none';
            });
        });
    }
    
    // Stagger Animations
    function initStaggerAnimations() {
        const staggerContainers = document.querySelectorAll('.values-grid, .stats-grid, .achievements-grid');
        
        staggerContainers.forEach(container => {
            const items = container.querySelectorAll('.stagger-item, .stat-card, .achievement-item');
            
            const staggerObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        items.forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('visible');
                            }, index * 100); // 100ms delay between each item
                        });
                        staggerObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            staggerObserver.observe(container);
        });
    }
    
    // Typewriter effect
    function initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            element.style.width = '0';
            
            let i = 0;
            const timer = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    element.style.width = ((i + 1) / text.length * 100) + '%';
                    i++;
                } else {
                    clearInterval(timer);
                    element.style.borderRight = 'none';
                }
            }, 100);
        });
    }
    
    // Initialize typewriter when elements are visible
    const typewriterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    initTypewriter();
                }, 500);
                typewriterObserver.unobserve(entry.target);
            }
        });
    });
    
    const typewriterElements = document.querySelectorAll('.typewriter');
    typewriterElements.forEach(element => {
        typewriterObserver.observe(element);
    });
});

// Add morphing ripple CSS
const morphingRippleStyle = document.createElement('style');
morphingRippleStyle.textContent = `
    .morphing-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: morphing-ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes morphing-ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(morphingRippleStyle);

// Add ripple effect CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(30, 136, 229, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .scroll-progress {
        box-shadow: 0 2px 10px rgba(30, 136, 229, 0.3);
    }
`;
document.head.appendChild(rippleStyle);
