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
    
    // Khai báo khuyết danh cho trình đóng menu để tránh lỗi ReferenceError ở phạm vi ngoài
    let closeMenu = () => {};

    // ================================================================
    // 1. CHÀO & TỰ ĐỘNG TẮT MÀN HÌNH LOADING (PREMIUM LOADER)
    // ================================================================
    const loader = document.getElementById('loader');
    if (loader) {
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
    }

    // ================================================================
    // 2. DYNAMIC STICKY HEADER
    // ================================================================
    const header = document.getElementById('main-header');
    if (header) {
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
    }

    // ================================================================
    // 3. MOBILE MENU CONTROLLER (BURGER NAVIGATION)
    // ================================================================
    const hamburger = document.getElementById('hamburger-menu');
    const mobileNav = document.getElementById('mobile-navigation');
    const menuBackdrop = document.getElementById('menu-backdrop');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (hamburger && mobileNav && menuBackdrop) {
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

        // Gán logic đóng menu thực tế vào biến ở phạm vi bên ngoài
        closeMenu = () => {
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
    }

    // ================================================================
    // 4. OVERLAY SEARCH CONTROLLER
    // ================================================================
    const searchTrigger = document.getElementById('search-trigger');
    const searchClose = document.getElementById('search-close');
    const searchContainer = document.getElementById('search-container');
    const searchInput = searchContainer ? searchContainer.querySelector('.search-input') : null;

    if (searchTrigger && searchClose && searchContainer) {
        searchTrigger.addEventListener('click', () => {
            searchContainer.classList.add('open');
            if (searchInput) {
                setTimeout(() => {
                    searchInput.focus(); // Tự động focus vào thanh tìm kiếm sang trọng
                }, 400);
            }
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
    }

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
    const cards = slider ? slider.querySelectorAll('.blog-card') : [];
    
    let currentIndex = 0;
    let cardWidth = (cards && cards.length > 0) ? cards[0].offsetWidth : 0;
    let gap = 32; // Khớp với CSS gap của .blog-carousel là 32px
    let itemsPerView = 3; // Mặc định hiển thị 3 cột trên desktop

    // Xác định số lượng cột thực tế dựa trên kích thước màn hình
    const updateLayoutMetrics = () => {
        if (!cards || cards.length === 0) return;
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
        if (!dotsContainer || !cards || cards.length === 0) return;
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
        if (!dotsContainer) return;
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
        if (!slider || !cards || cards.length === 0) return;
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
            if (cards && cards.length > 0) {
                goToSlide(Math.min(currentIndex, cards.length - itemsPerView));
            }
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

    if (slider && cards && cards.length > 0) {
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
    }

    // ================================================================
    // 8. BACK TO TOP BUTTON WITH SCROLL MONITORING
    // ================================================================
    const backToTopBtn = document.getElementById('back-to-top');
    const scrollDisplayThreshold = 400;

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollDisplayThreshold) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
    }

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

    // ================================================================
    // 10. PREMIUM GLASSMORPHIC LOGIN/REGISTER POPUP CONTROLLER & API INTEGRATION
    // ================================================================
    const loginTrigger = document.getElementById('login-trigger');
    const mobileLoginTrigger = document.getElementById('mobile-login-trigger');
    const authContainer = document.getElementById('auth-container');
    const authClose = document.getElementById('auth-close');
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabRegisterBtn = document.getElementById('tab-register-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const API_BASE_URL = 'http://localhost:5000/api/auth';

    // --- HIỆU ỨNG THÔNG BÁO TOAST SANG TRỌNG ---
    const showToast = (message, type = 'success') => {
        // Xóa các toast cũ nếu có
        const existingToasts = document.querySelectorAll('.custom-toast');
        existingToasts.forEach(t => t.remove());

        const toast = document.createElement('div');
        toast.className = `custom-toast ${type}`;
        
        // CSS Style trực tiếp để đảm bảo tính độc lập và premium
        toast.style.cssText = `
            position: fixed;
            top: 40px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            background: ${type === 'success' 
                ? 'linear-gradient(135deg, rgba(15, 118, 110, 0.95) 0%, rgba(63, 143, 128, 0.95) 100%)' 
                : 'linear-gradient(135deg, rgba(185, 28, 28, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)'};
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: #FFFFFF;
            padding: 16px 36px;
            border-radius: 100px;
            font-family: var(--font-primary);
            font-weight: 600;
            font-size: 0.95rem;
            box-shadow: var(--shadow-deep), 0 0 20px ${type === 'success' ? 'rgba(15, 118, 110, 0.2)' : 'rgba(185, 28, 28, 0.2)'};
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 12px;
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        const icon = document.createElement('i');
        icon.className = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-exclamation';
        icon.style.cssText = `
            color: #FFFFFF;
            font-size: 1.15rem;
        `;
        
        const text = document.createElement('span');
        text.innerText = message;
        
        toast.appendChild(icon);
        toast.appendChild(text);
        document.body.appendChild(toast);
        
        // Kích hoạt animation xuất hiện
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        }, 50);
        
        // Tự động đóng và biến mất
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                toast.remove();
            }, 500);
        }, 3200);
    };

    // Đăng xuất tài khoản
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        updateAuthUI(null);
        showToast('Bạn đã đăng xuất tài khoản thành công!', 'success');
    };

    // Cập nhật giao diện Đăng nhập / Đăng ký dựa trên trạng thái
    const updateAuthUI = (user) => {
        if (user) {
            // Đã đăng nhập - Desktop
            if (loginTrigger) {
                if (!loginTrigger.dataset.originalHtml) {
                    loginTrigger.dataset.originalHtml = loginTrigger.innerHTML;
                }
                loginTrigger.innerHTML = `<i class="fa-solid fa-user-circle"></i> Chào, ${user.name}`;
                loginTrigger.title = "Nhấp để đăng xuất";
                loginTrigger.style.background = 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)';
                loginTrigger.style.borderColor = '#0f766e';
                loginTrigger.classList.add('logged-in');
            }
            // Đã đăng nhập - Mobile
            if (mobileLoginTrigger) {
                if (!mobileLoginTrigger.dataset.originalHtml) {
                    mobileLoginTrigger.dataset.originalHtml = mobileLoginTrigger.innerHTML;
                }
                mobileLoginTrigger.innerHTML = `<i class="fa-solid fa-user-circle"></i> Chào, ${user.name} (Đăng xuất)`;
                mobileLoginTrigger.classList.add('logged-in');
            }
        } else {
            // Chưa đăng nhập / Đã đăng xuất - Desktop
            if (loginTrigger) {
                loginTrigger.innerHTML = loginTrigger.dataset.originalHtml || '<i class="fa-solid fa-user"></i> Login';
                loginTrigger.title = "Đăng nhập";
                loginTrigger.style.background = '';
                loginTrigger.style.borderColor = '';
                loginTrigger.classList.remove('logged-in');
            }
            // Chưa đăng nhập / Đã đăng xuất - Mobile
            if (mobileLoginTrigger) {
                mobileLoginTrigger.innerHTML = mobileLoginTrigger.dataset.originalHtml || '<i class="fa-solid fa-user"></i> Đăng Nhập / Đăng Ký';
                mobileLoginTrigger.classList.remove('logged-in');
            }
        }
    };

    const openAuthModal = () => {
        // Nếu đã đăng nhập, click sẽ là đăng xuất
        if (loginTrigger && loginTrigger.classList.contains('logged-in')) {
            if (confirm('Bạn có muốn đăng xuất tài khoản không?')) {
                handleLogout();
            }
            return;
        }
        if (authContainer) {
            authContainer.classList.add('active');
            document.body.style.overflow = 'hidden'; // Ngăn cuộn trang nền
        }
    };

    const closeAuthModal = () => {
        if (authContainer) {
            authContainer.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Mở popup trên Desktop
    if (loginTrigger) {
        loginTrigger.addEventListener('click', openAuthModal);
    }

    // Mở popup trên Mobile (và tự động đóng menu mobile drawer trước)
    if (mobileLoginTrigger) {
        mobileLoginTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            if (mobileLoginTrigger.classList.contains('logged-in')) {
                closeMenu();
                setTimeout(() => {
                    if (confirm('Bạn có muốn đăng xuất tài khoản không?')) {
                        handleLogout();
                    }
                }, 300);
                return;
            }
            closeMenu(); // Đóng menu di động
            setTimeout(openAuthModal, 300); // Mở modal popup
        });
    }

    // Đóng popup bằng nút X
    if (authClose) {
        authClose.addEventListener('click', closeAuthModal);
    }

    // Đóng popup khi nhấn ra ngoài modal
    if (authContainer) {
        authContainer.addEventListener('click', (e) => {
            if (e.target === authContainer) {
                closeAuthModal();
            }
        });
    }

    // Đóng popup bằng nút ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authContainer && authContainer.classList.contains('active')) {
            closeAuthModal();
        }
    });

    // Chuyển đổi tab Đăng Nhập / Đăng Ký
    if (tabLoginBtn && tabRegisterBtn && loginForm && registerForm) {
        tabLoginBtn.addEventListener('click', () => {
            tabLoginBtn.classList.add('active');
            tabRegisterBtn.classList.remove('active');
            loginForm.style.display = 'flex';
            loginForm.classList.add('visible');
            registerForm.style.display = 'none';
            registerForm.classList.remove('visible');
        });

        tabRegisterBtn.addEventListener('click', () => {
            tabRegisterBtn.classList.add('active');
            tabLoginBtn.classList.remove('active');
            registerForm.style.display = 'flex';
            registerForm.classList.add('visible');
            loginForm.style.display = 'none';
            loginForm.classList.remove('visible');
        });
    }

    // ================================================================
    // 11. FORM SUBMISSION (CONNECT TO REAL BACKEND API)
    // ================================================================
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = loginForm.querySelector('input[type="email"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');

            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!email || !password) {
                showToast('Vui lòng nhập đầy đủ email và mật khẩu!', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    updateAuthUI(data.user);
                    closeAuthModal();
                    showToast(data.message || 'Đăng nhập thành công!', 'success');
                    loginForm.reset();
                } else {
                    showToast(data.message || 'Đăng nhập thất bại!', 'error');
                }
            } catch (error) {
                console.error('Lỗi kết nối API đăng nhập:', error);
                showToast('Không thể kết nối đến máy chủ backend!', 'error');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nameInput = registerForm.querySelector('input[placeholder="Họ và tên của bạn"]');
            const emailInput = registerForm.querySelector('input[placeholder="Địa chỉ Email"]');
            const passwordInput = registerForm.querySelector('input[type="password"]');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const password = passwordInput ? passwordInput.value : '';

            if (!name || !email || !password) {
                showToast('Vui lòng điền đầy đủ các trường thông tin!', 'error');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    showToast(data.message || 'Tạo tài khoản thành công!', 'success');
                    // Reset form đăng ký
                    registerForm.reset();
                    // Tự động chuyển sang Tab đăng nhập để người dùng tiện sử dụng
                    if (tabLoginBtn) tabLoginBtn.click();
                } else {
                    showToast(data.message || 'Đăng ký thất bại!', 'error');
                }
            } catch (error) {
                console.error('Lỗi kết nối API đăng ký:', error);
                showToast('Không thể kết nối đến máy chủ backend!', 'error');
            }
        });
    }

    // Kiểm tra trạng thái đăng nhập khi tải trang
    const checkLoginState = async () => {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr) {
            try {
                // Xác thực token với server để chắc chắn token còn hiệu lực
                const response = await fetch(`${API_BASE_URL}/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    updateAuthUI(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user)); // Cập nhật lại thông tin user
                } else {
                    // Token hết hạn hoặc không hợp lệ, đăng xuất tự động
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    updateAuthUI(null);
                }
            } catch (error) {
                console.warn('Lỗi kết nối backend khi check token, tạm thời sử dụng cache:', error);
                // Nếu backend offline tạm thời, vẫn duy trì UI đăng nhập từ cache cục bộ
                try {
                    updateAuthUI(JSON.parse(userStr));
                } catch (e) {
                    updateAuthUI(null);
                }
            }
        } else {
            updateAuthUI(null);
        }
    };

    // Chạy kiểm tra đăng nhập ngay khi trang tải xong
    checkLoginState();
});
