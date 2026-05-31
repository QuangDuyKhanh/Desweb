/* HAPPY PAWS TRAINING CENTER - PREMIUM INTERACTION SCRIPT
   UI/UX Engine: Pure ES6 Javascript (No Heavy External Libraries)
   Author: Senior UI/UX Designer & Frontend Developer */

document.addEventListener('DOMContentLoaded', () => {
    // Tự động phát hiện môi trường Chrome Extension và gán class vào body
    if (window.chrome && chrome.runtime && chrome.runtime.id) {
        document.body.classList.add('chrome-extension-mode');
    }
    
    // Khai báo khuyết danh cho trình đóng menu để tránh lỗi ReferenceError ở phạm vi ngoài
    let closeMenu = () => {};

    // 1. CHÀO & TỰ ĐỘNG TẮT MÀN HÌNH LOADING (PREMIUM LOADER)
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

    // 2. DYNAMIC STICKY HEADER
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

    // 3. MOBILE MENU CONTROLLER (BURGER NAVIGATION)
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

    // 4. OVERLAY SEARCH CONTROLLER
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

    // 5. INTERSECTION OBSERVER FOR HIGH PERFORMANCE SCROLL ANIMATIONS
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

    // 6. CHALKBOARD SCHEDULE TABS SWITCHER (INTERACTIVE CLASSES)
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

    // 7. TOUCH-FRIENDLY BLOG SLIDER CAROUSEL (JS CAROUSEL PRO)
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

    // 8. BACK TO TOP BUTTON WITH SCROLL MONITORING
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

    // 9. ACTIVE LINK HIGHLIGHTER ON SCROLL (ONE-PAGE ARCHITECTURE)
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

    // 10. PREMIUM GLASSMORPHIC LOGIN/REGISTER POPUP CONTROLLER
    const loginTrigger = document.getElementById('login-trigger');
    const mobileLoginTrigger = document.getElementById('mobile-login-trigger');
    const authContainer = document.getElementById('auth-container');
    const authClose = document.getElementById('auth-close');
    const tabLoginBtn = document.getElementById('tab-login-btn');
    const tabRegisterBtn = document.getElementById('tab-register-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    const openAuthModal = () => {
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
            closeMenu(); // Đóng menu di động thông qua hàm đã khai báo an toàn ở phạm vi ngoài
            setTimeout(openAuthModal, 300); // Mở modal popup sau khi đóng drawer mượt mà
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

    // --- HIỆU ỨNG THÔNG BÁO TOAST SANG TRỌNG (UI/UX SIMULATOR) ---
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
            background: linear-gradient(135deg, rgba(15, 118, 110, 0.95) 0%, rgba(63, 143, 128, 0.95) 100%);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            color: #FFFFFF;
            padding: 16px 36px;
            border-radius: 100px;
            font-family: var(--font-primary);
            font-weight: 600;
            font-size: 0.95rem;
            box-shadow: var(--shadow-deep), 0 0 20px rgba(15, 118, 110, 0.2);
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

    // 11. AI ASSISTANT CHAT WIDGET CONTROLLER (PAWSIE ASSISTANT)
    const aiChatTrigger = document.getElementById('ai-chat-trigger');
    const aiChatWindow = document.getElementById('ai-chat-window');
    const aiChatClose = document.getElementById('ai-chat-close');
    const aiChatMessages = document.getElementById('ai-chat-messages');
    const aiChatInput = document.getElementById('ai-chat-input');
    const aiChatSend = document.getElementById('ai-chat-send');
    const suggestBtns = document.querySelectorAll('.suggest-btn');

    // Cơ sở dữ liệu câu trả lời của AI về dịch vụ Spa & Ưu đãi
    const aiDatabase = {
        spa: `✂️ **KHOA SPA & TÙY CHỈNH DIỆN MẠO HAPPY PAWS:**<br>
              Chúng tôi có đầy đủ 3 gói dịch vụ Spa chuyên nghiệp bằng sản phẩm hữu cơ cao cấp:<br><br>
              1. **Gói Tắm Vệ Sinh Căn Bản:** Tắm 2 lần dầu gội khử mùi, sấy khô, chải lông rụng, cắt và mài móng, vệ sinh tai, vắt tuyến hôi.<br>
              2. **Gói Cắt Tỉa Tạo Kiểu (Combo):** Bao gồm toàn bộ gói tắm + Thiết kế kiểu lông theo yêu cầu (Cắt tỉa bo tròn Teddy, kiểu Boo, xả mượt lông sư tử...).<br>
              3. **Gói Trị Liệu & Phục Hồi:** Ngâm bồn sục Microbubble, dưỡng lông chuyên sâu bằng Serum Collagen phục hồi lông xơ rối, tắm lá thuốc trị viêm da, nấm.`,
        
        promotion: `🎁 **CHƯƠNG TRÌNH ƯU ĐÃI KHAI TRƯƠNG PREMIUM 2026:**<br><br>
                    • **Giảm ngay 15%** cho tất cả các gói dịch vụ Spa cắt tỉa tạo kiểu khi đăng ký đặt lịch trước qua Hotline hoặc Website.<br>
                    • **Combo Đi học đi Spa:** Giảm ngay **30% giá Spa** cho cún đang theo học các khóa nội trú *Board & Train* hoặc *Puppy Preschool* tại trung tâm.<br>
                    • **Thứ 4 Vui Vẻ:** Đồng giá cắt móng và vệ sinh tai chỉ **50k** vào khung giờ 9h00 - 11h00 sáng thứ Tư hàng tuần.`,
                    
        price: `💰 **BẢNG GIÁ SPA (Tính theo cân nặng cún):**<br><br>
                • **Dưới 5kg:** Gói Tắm: 150k | Gói Cắt tỉa tạo kiểu: 300k<br>
                • **Từ 5kg - 10kg:** Gói Tắm: 250k | Gói Cắt tỉa tạo kiểu: 450k<br>
                • **Từ 10kg - 20kg:** Gói Tắm: 350k | Gói Cắt tỉa tạo kiểu: 600k<br>
                • *(Đối với cún trên 20kg hoặc lông rối nặng, các chuyên gia sẽ báo giá trực tiếp sau khi đo tình trạng lông).*`,
                
        default: `Gâu! Cảm ơn bạn đã nhắn tin. Hiện tại tôi có sẵn các thông tin chính xác về:<br>
                  1. **Dịch vụ Spa** (Gõ "spa" hoặc "cắt tỉa")<br>
                  2. **Chương trình ưu đãi** (Gõ "ưu đãi" hoặc "khuyến mãi")<br>
                  3. **Bảng giá chi tiết** (Gõ "giá" hoặc "chi phí")<br><br>
                  Bạn có thể gõ các từ khóa trên hoặc click chọn các nút gợi ý nhanh bên dưới nhé!`
    };

    // Đóng/Mở khung chat bằng cách thêm/bớt class 'active'
    if (aiChatTrigger) {
        aiChatTrigger.addEventListener('click', () => {
            if (aiChatWindow) aiChatWindow.classList.toggle('active');
        });
    }
    if (aiChatClose) {
        aiChatClose.addEventListener('click', () => {
            if (aiChatWindow) aiChatWindow.classList.remove('active');
        });
    }

    // Hàm chèn tin nhắn mới vào khung chat
    function appendMessage(text, sender) {
        if (!aiChatMessages) return;
        const msgWrapper = document.createElement('div');
        msgWrapper.classList.add('msg-wrapper', sender);
        
        const msgBubble = document.createElement('div');
        msgBubble.classList.add('msg-bubble');
        msgBubble.innerHTML = text; // Dùng innerHTML để hiển thị được định dạng thẻ dòng
        
        msgWrapper.appendChild(msgBubble);
        aiChatMessages.appendChild(msgWrapper);
        
        // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
    }

    // Hàm hiển thị bong bóng động đang gõ chữ "..." của AI (Premium UI)
    function showTypingIndicator() {
        if (!aiChatMessages) return null;
        const msgWrapper = document.createElement('div');
        msgWrapper.classList.add('msg-wrapper', 'ai', 'typing-indicator');
        
        const msgBubble = document.createElement('div');
        msgBubble.classList.add('msg-bubble');
        msgBubble.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        
        msgWrapper.appendChild(msgBubble);
        aiChatMessages.appendChild(msgWrapper);
        aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
        
        return msgWrapper;
    }

    // Hàm xử lý phân tích cú pháp câu hỏi và phản hồi
    function handleAIResponse(userText) {
        const text = userText.toLowerCase();
        let reply = aiDatabase.default;

        if (text.includes('spa') || text.includes('tắm') || text.includes('cắt tỉa') || text.includes('dịch vụ')) {
            reply = aiDatabase.spa;
        } else if (text.includes('ưu đãi') || text.includes('khuyến mãi') || text.includes('giảm giá') || text.includes('quà')) {
            reply = aiDatabase.promotion;
        } else if (text.includes('giá') || text.includes('nhiêu') || text.includes('tiền') || text.includes('chi phí')) {
            reply = aiDatabase.price;
        }

        // Kích hoạt hiển thị dấu 3 chấm động đang gõ chữ
        const typingBubble = showTypingIndicator();

        // Tạo hiệu ứng trễ nhẹ (giả lập AI đang suy nghĩ)
        setTimeout(() => {
            if (typingBubble) typingBubble.remove(); // Xóa dấu 3 chấm
            appendMessage(reply, 'ai');
        }, 800);
    }

    // Sự kiện gửi tin nhắn khi bấm nút gửi hoặc nhấn Enter
    function sendMessage() {
        if (!aiChatInput) return;
        const query = aiChatInput.value.trim();
        if (!query) return;
        
        appendMessage(query, 'user');
        aiChatInput.value = '';
        handleAIResponse(query);
    }

    if (aiChatSend) {
        aiChatSend.addEventListener('click', sendMessage);
    }
    
    if (aiChatInput) {
        aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Xử lý sự kiện click vào các nút gợi ý nhanh (Quick Replies)
    if (suggestBtns && suggestBtns.length > 0) {
        suggestBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.getAttribute('data-query');
                if (query) {
                    appendMessage(query, 'user');
                    handleAIResponse(query);
                }
            });
        });
    }

    // 12. FORM SUBMISSION EMULATION (TOAST NOTIFICATIONS)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = loginForm.querySelector('input[type="email"]');
            const email = emailInput ? emailInput.value : '';
            closeAuthModal();
            showToast(`Chào mừng quay trở lại! Bạn đã đăng nhập thành công bằng email ${email}.`, 'success');
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = registerForm.querySelector('input[placeholder="Họ và tên của bạn"]');
            const name = nameInput ? nameInput.value : '';
            closeAuthModal();
            showToast(`Chúc mừng ${name}! Tài khoản của bạn đã được khởi tạo thành công.`, 'success');
        });
    }
});

