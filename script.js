/* 
================================================================
   HAPPY PAWS TRAINING CENTER - PREMIUM INTERACTION SCRIPT
   UI/UX Engine: Pure ES6 Javascript (No Heavy External Libraries)
   Author: Senior UI/UX Designer & Frontend Developer
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // Tự động phát hiện môi trường Chrome Extension và gán class vào body
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        document.body.classList.add('chrome-extension-mode');
    }
    
    // ================================================================
    // 1. CHÀO & TỰ ĐỘNG TẮT MÀN HÌNH LOADING (PREMIUM LOADER)
    // ================================================================
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600); // Khớp thời gian với CSS transition (0.6s)
        }, 800); // Tạo khoảng dừng ngắn sang trọng ban đầu
    });

    // Trường hợp sự kiện 'load' đã xảy ra trước khi DOMContentLoaded hoàn thành
    if (document.readyState === 'complete') {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600);
        }, 800);
    }

    // ================================================================
    // 2. DYNAMIC STICKY HEADER
    // ================================================================
    const header = document.getElementById('main-header');
    const scrollThreshold = 50;

    const handleScrollHeader = () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };

    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Gọi ngay lập tức phòng trường hợp F5 giữa trang

    // ================================================================
    // 3. MOBILE MENU CONTROLLER (BURGER NAVIGATION)
    // ================================================================
    const hamburger = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-navigation');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = () => {
        hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open');
        menuBackdrop.classList.toggle('active');
        
        // Ngăn cuộn trang phía sau khi menu đang mở
        if (mobileNav.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    const closeMenu = () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        menuBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', toggleMenu);
    menuBackdrop.addEventListener('click', closeMenu);

    // Đóng menu khi nhấp vào bất kỳ link liên kết nào
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Cập nhật trạng thái active
            mobileLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            closeMenu();
        });
    });

    // ================================================================
    // 4. OVERLAY SEARCH CONTROLLER
    // ================================================================
    const searchTrigger = document.getElementById('search-trigger');
    const searchClose = document.getElementById('search-close');
    const searchContainer = document.getElementById('search-container');
    const searchInput = searchContainer.querySelector('.search-input');

    searchTrigger.addEventListener('click', () => {
        searchContainer.classList.add('open');
        setTimeout(() => {
            searchInput.focus(); // Tự động focus vào thanh tìm kiếm sang trọng
        }, 400);
    });

    searchClose.addEventListener('click', () => {
        searchContainer.classList.remove('open');
    });

    // Đóng ô tìm kiếm khi nhấn ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchContainer.classList.contains('open')) {
            searchContainer.classList.remove('open');
        }
    });

    // ================================================================
    // 5. INTERSECTION OBSERVER FOR HIGH PERFORMANCE SCROLL ANIMATIONS
    // ================================================================
    const animatedElements = document.querySelectorAll('.fade-in-up');

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Tùy chọn: ngừng quan sát sau khi phần tử đã hiện (chạy animation 1 lần)
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1, // Kích hoạt khi ít nhất 10% phần tử xuất hiện trên khung hình
        rootMargin: '0px 0px -40px 0px' // Trì hoãn nhẹ để tạo cảm giác cuộn mượt mà
    });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // ================================================================
    // 6. CHALKBOARD SCHEDULE TABS SWITCHER (INTERACTIVE CLASSES)
    // ================================================================
    const tabButtons = document.querySelectorAll('.schedule-tab');
    const panels = document.querySelectorAll('.schedule-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            
            // Xóa active cũ ở nút
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Xử lý ẩn hiện panel mượt mà
            panels.forEach(panel => {
                if (panel.id === targetId) {
                    panel.classList.add('active');
                } else {
                    panel.classList.remove('active');
                }
            });
        });
    });

    // ================================================================
    // 7. TOUCH-FRIENDLY BLOG SLIDER CAROUSEL (JS CAROUSEL PRO)
    // ================================================================
    const slider = document.getElementById('blog-slider');
    const dotsContainer = document.getElementById('slider-dots');
    const cards = slider.querySelectorAll('.blog-card');
    
    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth;
    let gap = 32; // Khớp với CSS gap của .blog-carousel là 32px
    let itemsPerView = 3; // Mặc định hiển thị 3 cột trên desktop

    // Xác định số lượng cột thực tế dựa trên kích thước màn hình
    const updateLayoutMetrics = () => {
        cardWidth = cards[0].offsetWidth;
        const width = window.innerWidth;
        if (width <= 767) {
            itemsPerView = 1;
            gap = 0; // Trên mobile card chiếm 100%
        } else if (width <= 1200) {
            itemsPerView = 2;
            gap = 32;
        } else {
            itemsPerView = 3;
            gap = 32;
        }
    };

    // Tạo các chấm tròn chấm active thuốc nhộng
    const createDots = () => {
        dotsContainer.innerHTML = '';
        const totalSlides = Math.max(1, cards.length - itemsPerView + 1);
        
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            dotsContainer.appendChild(dot);
        }
    };

    const updateDotsState = (activeIndex) => {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, idx) => {
            if (idx === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    const goToSlide = (index) => {
        updateLayoutMetrics();
        const totalSlides = Math.max(1, cards.length - itemsPerView + 1);
        
        // Giới hạn chỉ số hợp lệ
        if (index < 0) index = 0;
        if (index >= totalSlides) index = totalSlides - 1;
        
        currentIndex = index;
        
        // Tính toán dịch chuyển translate
        const moveAmount = currentIndex * (cardWidth + gap);
        slider.style.transform = `translateX(-${moveAmount}px)`;
        
        updateDotsState(currentIndex);
    };

    // Lắng nghe sự kiện thay đổi kích thước màn hình (Resize)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateLayoutMetrics();
            createDots();
            goToSlide(Math.min(currentIndex, cards.length - itemsPerView));
        }, 150);
    });

    // Khởi tạo slider đầu tiên
    setTimeout(() => {
        updateLayoutMetrics();
        createDots();
        goToSlide(0);
    }, 300);

    // --- HỖ TRỢ SWIPE VUỐT BẰNG TAY (MOBILE/TABLET TOUCH) ---
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        slider.style.transition = 'none'; // Tắt animation để kéo theo tay lập tức
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        
        // Tính toán khoảng dịch chuyển tạm thời
        const currentMoveAmount = currentIndex * (cardWidth + gap);
        slider.style.transform = `translateX(${-currentMoveAmount + diffX}px)`;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        slider.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'; // Khôi phục transition mượt mà
        
        const diffX = currentX - startX;
        const swipeThreshold = 50; // Quãng đường vuốt tối thiểu (px) để đổi slide

        if (diffX < -swipeThreshold) {
            // Vuốt sang trái -> xem slide tiếp theo
            goToSlide(currentIndex + 1);
        } else if (diffX > swipeThreshold) {
            // Vuốt sang phải -> xem slide trước đó
            goToSlide(currentIndex - 1);
        } else {
            // Không đủ ngưỡng vuốt -> hồi phục vị trí cũ
            goToSlide(currentIndex);
        }
    });

    // ================================================================
    // 8. BACK TO TOP BUTTON WITH SCROLL MONITORING
    // ================================================================
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollDisplayThreshold = 400;

    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollDisplayThreshold) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // ================================================================
    // 9. ACTIVE LINK HIGHLIGHTER ON SCROLL (ONE-PAGE ARCHITECTURE)
    // ================================================================
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const highlightActiveLink = () => {
        let currentSectionId = '';
        
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 140; // Trừ đi chiều cao header sticky và khoảng đệm
            const secHeight = sec.offsetHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink();
});
