/**
 * GT Translate Integrator - Optimized Version
 * Supports: Vietnamese, English, Japanese, Korean, Chinese
 * Features: Live translation without page reload, UI hiding, performance optimization
 */
(function () {
    'use strict';
    
    console.log('🌐 GT Translate Integrator v2.0 - Loading...');
    
    // Add jQuery error handler to catch selector errors
    if (window.jQuery) {
        const originalFind = jQuery.fn.find;
        jQuery.fn.find = function(selector) {
            try {
                if (typeof selector === 'string' && (selector === '#' || selector === '' || selector.trim() === '#')) {
                    console.warn('⚠️ Invalid jQuery selector detected:', selector);
                    return jQuery();
                }
                return originalFind.call(this, selector);
            } catch (e) {
                console.warn('⚠️ jQuery selector error:', selector, e.message);
                return jQuery();
            }
        };
        
        const originalJQuery = window.jQuery;
        window.jQuery = window.$ = function(selector, context) {
            try {
                if (typeof selector === 'string' && (selector === '#' || selector === '' || selector.trim() === '#')) {
                    console.warn('⚠️ Invalid jQuery selector detected:', selector);
                    return originalJQuery();
                }
                return originalJQuery(selector, context);
            } catch (e) {
                console.warn('⚠️ jQuery selector error:', selector, e.message);
                return originalJQuery();
            }
        };
        
        Object.setPrototypeOf(window.jQuery, originalJQuery);
        Object.assign(window.jQuery, originalJQuery);
    }
    
    // ---- Cấu hình có thể chỉnh sửa ----
    const PAGE_LANGUAGE = 'vi';        // Supported languages configuration
    const SUPPORTED_LANGUAGES = ['vi', 'en', 'ja', 'ko', 'zh']; // Các ngôn ngữ bạn hỗ trợ
    const FLAG_PATHS = {               // Map đường dẫn cờ
        vi: '/Image/flags/vn.png',
        en: '/Image/flags/us.png',
        ja: '/Image/flags/jp.png',     // Nhật Bản
        ko: '/Image/flags/kr.png',     // Hàn Quốc
        zh: '/Image/flags/cn.png'      // Trung Quốc
    };
    const LANGUAGE_LABELS = { 
        vi: 'VN', 
        en: 'EN',
        ja: '日本',    // Nhật Bản  
        ko: '한국',    // Hàn Quốc
        zh: '中文'     // Trung Quốc
    };

    // ---- Các hàm tiện ích ----
    function getCookie(name) {
        const value = '; ' + document.cookie;
        const parts = value.split('; ' + name + '=');
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // --- Helper: set googtrans đúng chuẩn và bền vững ---
    function setGoogTransCookie(lang) {
        var pageLang = PAGE_LANGUAGE || 'vi';
        var value = '/' + pageLang + '/' + lang;

        // cookie mặc định
        document.cookie = 'googtrans=' + value + '; path=/; samesite=lax';

        // cố gắng set theo domain gốc (cho www., subdomain)
        var host = window.location.hostname;
        var parts = host.split('.');
        if (parts.length >= 2) {
            var root = '.' + parts.slice(-2).join('.');
            document.cookie = 'googtrans=' + value + '; path=/; domain=' + host + '; samesite=lax';
            document.cookie = 'googtrans=' + value + '; path=/; domain=' + root + '; samesite=lax';
        }
    }

    // ---- Save language preference ----
    function saveLanguagePreference(lang) {
        try {
            localStorage.setItem('user_language_preference', lang);
            sessionStorage.setItem('cubetech_language', lang);
        } catch (e) {
            console.warn('Could not save language to localStorage/sessionStorage.');
        }
        // ❗ Dùng chuẩn /<PAGE_LANGUAGE>/<lang>, không dùng /auto/<lang>
        setGoogTransCookie(lang);
        // Language preference saved: lang
    }

    // ---- Load language preference ----
    function loadLanguagePreference() {
        try {
            // Ưu tiên localStorage vì nhanh hơn
            const savedLang = localStorage.getItem('user_language_preference');
            if (savedLang && SUPPORTED_LANGUAGES.indexOf(savedLang) !== -1) {
                return savedLang;
            }
            
            // Fallback to sessionStorage
            const sessionLang = sessionStorage.getItem('cubetech_language');
            if (sessionLang && SUPPORTED_LANGUAGES.indexOf(sessionLang) !== -1) {
                return sessionLang;
            }
        } catch (e) { /* Bỏ qua */ }

        // Nếu không có, đọc cookie của Google
        const cookie = getCookie('googtrans');
        if (cookie) {
            const langCode = cookie.split('/').pop();
            if (SUPPORTED_LANGUAGES.indexOf(langCode) !== -1) {
                return langCode;
            }
        }
        
        return PAGE_LANGUAGE; // Mặc định
    }

    // ---- Optimized Google Translate Detection with Caching ----
    let cachedSelect = null;
    let lastCheckTime = 0;
    const CHECK_DEBOUNCE = 50; // Debounce checks
    
    function whenGoogleTranslateReady(callback, timeout) {
        timeout = timeout || 5000; // Further reduced timeout for faster fallback
        let startTime = Date.now();
        let attempts = 0;
        const maxAttempts = 50; // Significantly reduced attempts
        
        // Return cached select if available and valid
        if (cachedSelect && cachedSelect.options && cachedSelect.options.length > 1) {
            // Using cached Google Translate element
            return callback(cachedSelect);
        }
        
        function check() {
            attempts++;
            const now = Date.now();
            
            // Debounce checks for better performance
            if (now - lastCheckTime < CHECK_DEBOUNCE) {
                if (window.requestAnimationFrame) {
                    requestAnimationFrame(check);
                } else {
                    setTimeout(check, CHECK_DEBOUNCE);
                }
                return;
            }
            lastCheckTime = now;
            
            // Optimized selector priority (most likely first)
            const selectors = [
                'select.goog-te-combo',
                '#google_translate_element select',
                '.goog-te-combo'
            ];
            
            let select = null;
            
            // Fast direct selector check
            for (let i = 0; i < selectors.length; i++) {
                select = document.querySelector(selectors[i]);
                if (select && select.options && select.options.length > 1) {
                    cachedSelect = select; // Cache for future use
                    break;
                }
                select = null;
            }
            
            if (select) {
                // Google Translate ready
                return callback(select);
            }
            
            // Early timeout for better performance
            if (now - startTime > timeout || attempts > maxAttempts) {
                console.warn('⚠️ Google Translate timeout after ' + attempts + ' attempts');
                
                // Quick fallback
                if (window.google && window.google.translate) {
                    // Using alternative approach...
                    tryAlternativeTranslation(callback);
                }
                return;
            }
            
            // Optimized frame timing
            if (window.requestAnimationFrame) {
                requestAnimationFrame(check);
            } else {
                setTimeout(check, 16); // 60fps
            }
        }
        
        check();
    }

    // ---- Page Reload Translation Method ----
    function tryAlternativeTranslation(callback) {
        try {
            // Using page reload translation method...

            const reloadSelect = {
                value: PAGE_LANGUAGE,
                options: [
                    { value: 'vi' }, 
                    { value: 'en' }, 
                    { value: 'zh' }, 
                    { value: 'ja' }, 
                    { value: 'ko' }
                ],
                dispatchEvent: function () {
                    var targetLang = this.value;
                    // Page reload translation to: targetLang

                    // Prevent reload loop - check if we just reloaded
                    const lastReload = sessionStorage.getItem('last_translation_reload');
                    const now = Date.now();
                    if (lastReload && (now - parseInt(lastReload)) < 3000) {
                        console.log('⚠️ Preventing reload loop - too soon since last reload');
                        return false;
                    }

                    // Mark this reload
                    sessionStorage.setItem('last_translation_reload', now.toString());

                    // Xóa cookie cũ rồi set cookie chuẩn
                    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
                    setGoogTransCookie(targetLang);

                    const elements = cacheElements();
                    if (elements.switcher) elements.switcher.classList.add('translating');

                    setTimeout(function () { window.location.reload(); }, 500);
                    return true;
                }
            };

            callback(reloadSelect);
        } catch (error) {
            console.error('❌ Page reload translation failed:', error.message);
            callback({
                value: PAGE_LANGUAGE,
                options: [
                    { value: 'vi' }, 
                    { value: 'en' }, 
                    { value: 'zh' }, 
                    { value: 'ja' }, 
                    { value: 'ko' }
                ],
                dispatchEvent: function () {
                    setTimeout(function () { window.location.reload(); }, 300);
                    return true;
                }
            });
        }
    }

    // ---- Optimized Language Application ----
    function applyLanguage(lang) {
        if (SUPPORTED_LANGUAGES.indexOf(lang) === -1) lang = PAGE_LANGUAGE;

        // Applying language: lang

        // Cập nhật UI + lưu trạng thái trước (feedback tức thì)
        updateDisplayUI(lang);
        saveLanguagePreference(lang);

        whenGoogleTranslateReady(function (select) {
            // Phân biệt: DOM select thật của Google hay "reload select" fallback
            var isDomSelect = !!(select && select.tagName === 'SELECT');

            // 👉 LẤY GIÁ TRỊ CŨ TRƯỚC KHI GÁN
            var prev = isDomSelect ? select.value : null;

            // Đặt giá trị mục tiêu
            select.value = lang;

            // Với select của Google:
            if (isDomSelect) {
                // Luôn dispatch "change" để buộc re-apply (kể cả prev === lang)
                var ev;
                if (typeof Event === 'function') {
                    ev = new Event('change', { bubbles: true, cancelable: true });
                } else {
                    ev = document.createEvent('Event');
                    ev.initEvent('change', true, true);
                }
                select.dispatchEvent(ev);

                addLoadingState();
                setTimeout(function () {
                    removeLoadingState();
                    // Language applied via Google select
                }, 1000);
                return;
            }

            // Với reloadSelect fallback: gọi dispatchEvent() không tham số
            // Using page reload approach for: lang
            select.dispatchEvent(); // sẽ set cookie + reload
        }, 5000);
    }

    // ---- Optimized UI Update with Caching ----
    function updateDisplayUI(lang) {
        try {
            const elements = cacheElements();
            
            // Batch DOM updates for better performance
            if (elements.flag && FLAG_PATHS[lang]) {
                elements.flag.src = FLAG_PATHS[lang];
                elements.flag.alt = lang === 'en' ? 'English' : 'Tiếng Việt';
            }
            if (elements.text && LANGUAGE_LABELS[lang]) {
                elements.text.textContent = LANGUAGE_LABELS[lang];
            }
            
            // UI updated for language
        } catch (e) {
            console.warn('⚠️ Could not update UI:', e);
        }
    }

    // ---- Hàm khởi tạo của Google (bắt buộc) ----
    window.googleTranslateElementInit = function () {
        // Google Translate initializing...
        
        try {
            new google.translate.TranslateElement({
                pageLanguage: PAGE_LANGUAGE,
                includedLanguages: SUPPORTED_LANGUAGES.join(','), // vi,en,zh,ja,ko
                autoDisplay: false,
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                gaTrack: false,
                gaId: null
            }, 'google_translate_element');

            // Google Translate initialized - Manual activation required
            
        } catch (error) {
            console.error('❌ Google Translate initialization failed:', error);
        }
    };

    // ---- Lazy-load script của Google ----
    function loadGoogleScript() {
        if (window.google && google.translate) {
            // Google Translate already loaded
            return; // Đã tải rồi
        }
        
        // Loading Google Translate script...
        const script = document.createElement('script');
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        script.onerror = function() {
            console.warn('⚠️ Google Translate script failed to load - continuing without translation');
            // Fallback: Initialize basic functionality without Google Translate
            if (typeof googleTranslateElementInit === 'function') {
                googleTranslateElementInit();
            }
        };
        script.onload = function() {
            console.log('✅ Google Translate script loaded successfully');
        };
        document.head.appendChild(script);
    }
    
    // ---- Cached DOM Elements for Performance ----
    let cachedElements = {
        switcher: null,
        toggle: null,
        options: null,
        flag: null,
        text: null
    };
    
    function cacheElements() {
        if (!cachedElements.switcher) {
            cachedElements.switcher = document.querySelector('.language-switcher');
            if (cachedElements.switcher) {
                cachedElements.toggle = cachedElements.switcher.querySelector('.dropdown-toggle');
                cachedElements.options = cachedElements.switcher.querySelectorAll('.language-option');
                cachedElements.flag = document.getElementById('current-flag');
                cachedElements.text = document.getElementById('current-lang');
            }
        }
        return cachedElements;
    }
    
    // ---- Optimized Event Listeners with Debouncing ----
    let clickDebounce = null;
    
    function setupEventListeners() {
        // Setting up optimized event listeners...
        
        const elements = cacheElements();
        
        if (elements.switcher) {
            // Language switcher found
            
            if (elements.toggle) {
                // Dropdown toggle found
                elements.toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Debounce rapid clicks
                    if (clickDebounce) return;
                    clickDebounce = setTimeout(() => clickDebounce = null, 200);
                    
                    // Dropdown toggle clicked
                    elements.switcher.classList.toggle('open');
                }, { passive: false });
            }
            
            // Optimized language options with event delegation
            if (elements.options) {
                elements.options.forEach(function(option) {
                    option.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Debounce language changes
                        if (clickDebounce) return;
                        clickDebounce = setTimeout(() => clickDebounce = null, 300);
                        
                        const selectedLang = this.getAttribute('data-lang');
                        // Language option clicked: selectedLang
                        
                        // Close dropdown immediately
                        elements.switcher.classList.remove('open');
                        
                        // Apply language with minimal delay
                        loadGoogleScript();
                        applyLanguage(selectedLang);
                        
                    }, { passive: false });
                });
            }
        } else {
            console.warn('⚠️ Language switcher not found');
        }

        // Optimized outside click handler
        document.addEventListener('click', function(e) {
            const elements = cachedElements;
            if (elements.switcher && !elements.switcher.contains(e.target)) {
                elements.switcher.classList.remove('open');
            }
        }, { passive: true });
        
        // Optimized event listeners setup complete
    }
    
    // ---- Khởi chạy khi trang đã tải xong ----
    function initializeWhenReady() {
        // Initializing GT Translate Integrator...
        
        const preferredLang = loadLanguagePreference();
        // Loaded language preference: preferredLang

        // Cập nhật UI ngay lập tức để người dùng thấy đúng cờ
        updateDisplayUI(preferredLang);

        // Setup event listeners
        setupEventListeners();

        // Chỉ load Google Script, KHÔNG tự động apply translation để tránh reload loop
        if (preferredLang !== PAGE_LANGUAGE) {
            // Non-default language detected, loading Google Translate...
            // Auto-translation disabled to prevent reload loop
            loadGoogleScript();
            // Không gọi applyLanguage() tự động để tránh reload loop
        }

        // GT Translate Integrator initialized
    }

    // Prevent duplicate initialization
    let isInitialized = false;
    
    function safeInitialize() {
        if (isInitialized) {
            // GT Integrator already initialized, skipping...
            return;
        }
        isInitialized = true;
        initializeWhenReady();
    }
    
    // Single initialization method
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', safeInitialize);
    } else {
        safeInitialize();
    }

    // ---- Global functions for testing ----
    window.changeLanguage = function(langCode) {
        // Global changeLanguage called: langCode
        loadGoogleScript();
        setTimeout(function() {
            applyLanguage(langCode);
        }, 100);
        return true;
    };
    
    // ---- Debug function for translation issues ----
    window.debugTranslation = function() {
        console.log('🔍 DEBUG: Current translation state');
        console.log('📍 Current URL:', window.location.href);
        console.log('🍪 Current cookies:', document.cookie);
        console.log('💾 localStorage language:', localStorage.getItem('user_language_preference'));
        console.log('💾 sessionStorage language:', sessionStorage.getItem('cubetech_language'));
        
        // Check Google Translate cookie specifically
        const googtrans = getCookie('googtrans');
        console.log('🌐 Google Translate cookie:', googtrans);
        
        // Check current page language
        const htmlLang = document.documentElement.lang || document.documentElement.getAttribute('lang');
        console.log('📄 HTML lang attribute:', htmlLang);
        
        console.log('🔧 Google Translate loaded:', !!(window.google && window.google.translate));
        
        // Check for Google Translate elements
        const gtElements = document.querySelectorAll('[id*="google"], [class*="goog"], [class*="skiptranslate"]');
        console.log('🎯 Google Translate elements found:', gtElements.length);
        
        return {
            url: window.location.href,
            cookies: document.cookie,
            googtrans: googtrans,
            localStorage: localStorage.getItem('user_language_preference'),
            sessionStorage: sessionStorage.getItem('cubetech_language'),
            htmlLang: htmlLang,
            googleLoaded: !!(window.google && window.google.translate),
            gtElements: gtElements.length
        };
    };
    
    // ---- Force translation function ----
    window.forceTranslation = function(langCode) {
        // Global forceTranslation called: langCode

        // Xóa cookie cũ ở mọi scope hợp lý
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
        var parts = window.location.hostname.split('.');
        if (parts.length >= 2) {
            var root = '.' + parts.slice(-2).join('.');
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + root + ';';
        }

        // Set cookie chuẩn rồi reload cứng
        setGoogTransCookie(langCode);
        updateDisplayUI(langCode);
        saveLanguagePreference(langCode);

        console.log('🔄 Force reloading page...');
        setTimeout(function() { window.location.reload(true); }, 100);
    };

    window.testLanguageSwitcher = function() {
        console.log('🧪 Testing language switcher...');
        
        const tests = [
            {
                name: 'Change to English',
                test: function() { return window.changeLanguage('en'); }
            },
            {
                name: 'Change to Vietnamese', 
                test: function() { return window.changeLanguage('vi'); }
            },
            {
                name: 'UI elements exist',
                test: function() {
                    const flag = document.getElementById('current-flag');
                    const lang = document.getElementById('current-lang');
                    return flag && lang;
                }
            }
        ];
        
        let passed = 0;
        tests.forEach(function(test) {
            try {
                const result = test.test();
                if (result) {
                    passed++;
                    console.log('✅ ' + test.name);
                } else {
                    console.log('❌ ' + test.name);
                }
            } catch (e) {
                console.log('💥 ' + test.name + ' - ERROR: ' + e.message);
            }
        });
        
        const successRate = Math.round((passed / tests.length) * 100);
        console.log('🎯 Test Results: ' + successRate + '% (' + passed + '/' + tests.length + ')');
        
        return { passed: passed, total: tests.length, successRate: successRate };
    };

    // ---- Loading State Management ----
    function addLoadingState() {
        const switcher = document.querySelector('.language-switcher');
        const currentLang = document.getElementById('current-lang');
        
        if (switcher) {
            switcher.classList.add('translating');
        }
        
        if (currentLang) {
            currentLang.style.opacity = '0.6';
            currentLang.style.transform = 'scale(0.95)';
        }
        
        // Add subtle loading animation
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity = '0.95';
    }
    
    function removeLoadingState() {
        const switcher = document.querySelector('.language-switcher');
        const currentLang = document.getElementById('current-lang');
        
        if (switcher) {
            switcher.classList.remove('translating');
        }
        
        if (currentLang) {
            currentLang.style.opacity = '1';
            currentLang.style.transform = 'scale(1)';
        }
        
        // Remove loading animation
        document.body.style.opacity = '1';
        
        // Clean up styles after animation
        setTimeout(function() {
            document.body.style.transition = '';
            if (currentLang) {
                currentLang.style.transition = '';
            }
        }, 300);
    }

    // ---- Enhanced Performance Monitoring ----
    const performanceMetrics = {
        translationTime: 0,
        uiUpdateTime: 0,
        scriptLoadTime: 0
    };
    
    function logPerformance(action, startTime) {
        if (window.performance && window.performance.now) {
            const duration = window.performance.now() - startTime;
            performanceMetrics[action + 'Time'] = duration;
            
            console.log('⚡ ' + action + ' completed in ' + Math.round(duration) + 'ms');
            
            // Performance warnings
            if (duration > 500) {
                console.warn('⚠️ Slow performance detected for ' + action + ': ' + Math.round(duration) + 'ms');
            }
        }
    }
    
    // ---- Memory Cleanup ----
    function cleanup() {
        // Clear cached elements if needed
        if (cachedElements.switcher && !document.contains(cachedElements.switcher)) {
            cachedElements = {
                switcher: null,
                toggle: null,
                options: null,
                flag: null,
                text: null
            };
        }
        
        // Clear cached select if invalid
        if (cachedSelect && (!cachedSelect.options || cachedSelect.options.length <= 1)) {
            cachedSelect = null;
        }
    }
    
    // Periodic cleanup
    setInterval(cleanup, 30000); // Every 30 seconds

    console.log('✅ GT Translate Integrator v2.0: Ready (VI|EN|JA|KO|ZH) - Optimized Performance');

})();
