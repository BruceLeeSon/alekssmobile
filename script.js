// ==================== МОБИЛЬНОЕ МЕНЮ ====================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeLinks = document.querySelectorAll('[data-close-menu]');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
            menuToggle.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        closeLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                menuToggle.classList.remove('active');
            });
        });
    }
});

// ==================== МОДАЛКА ====================
function openBookingModal(serviceName = '') {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.remove('hidden');
    
    if (serviceName) {
        const select = document.getElementById('b-service');
        if (select) {
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
                    select.selectedIndex = i;
                    break;
                }
            }
        }
    }
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.add('hidden');
}

function handleBookingSubmit(event) {
    event.preventDefault();
    closeBookingModal();
    
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }
    
    const form = document.getElementById('booking-form');
    if (form) form.reset();
}

// ==================== FAQ ====================
function toggleFaq(id) {
    const content = document.getElementById(`faq-content-${id}`);
    const icon = document.getElementById(`faq-icon-${id}`);
    if (content) content.classList.toggle('hidden');
    if (icon) icon.classList.toggle('rotate-180');
}

// ==================== КЛИК ВНЕ МОДАЛКИ ====================
document.addEventListener('click', function(event) {
    const modal = document.getElementById('booking-modal');
    if (modal && event.target === modal) {
        closeBookingModal();
    }
});

// ==================== АНИМАЦИИ + КНОПКА НАВЕРХ ====================
document.addEventListener('DOMContentLoaded', function() {
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Анимации появления в обе стороны
    const animatedElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -30px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }
});

// ==================== АВТО-ГАЛЕРЕЯ "OUR WORK" ====================
// Подставляет фото из img/work/work-1.jpg, work-2.jpg, ... пока не найдёт отсутствующее
(function loadWorkGallery() {
    const gallery = document.getElementById('work-gallery');
    if (!gallery) return;

    const MAX_PHOTOS = 50;           // максимум фото
    const EXT = 'jpg';               // расширение: jpg / png / webp
    const FOLDER = 'img/work/';      // папка с фото
    const PREFIX = 'work-';          // префикс имени файла
    const TITLES = [                 // подписи (можно менять/дополнять)
        'On-Site Tire Installation',
        'Fully Equipped Van',
        'Precision Care',
        'Wheel Balancing',
        'TPMS Service',
        'Brake Service',
        'Suspension Repair',
        'Oil Change',
        'Computer Diagnostics'
    ];

    let found = 0;

    function tryLoad(index) {
        if (index > MAX_PHOTOS) return;

        const src = `${FOLDER}${PREFIX}${index}.${EXT}`;
        const img = new Image();

        img.onload = function() {
            found++;
            const title = TITLES[(index - 1) % TITLES.length];
            const card = document.createElement('div');
            card.className = 'bg-cardBg border border-gray-800 rounded-2xl overflow-hidden shadow-xl reveal active';
            card.innerHTML = `
                <img src="${src}" alt="${title}" class="w-full h-64 object-cover hover:scale-105 transition duration-500">
                <div class="p-5">
                    <h4 class="font-heading font-bold text-white text-lg mb-1">${title}</h4>
                    <p class="text-xs text-gray-400">Professional mobile service in action.</p>
                </div>
            `;
            gallery.appendChild(card);
            tryLoad(index + 1);
        };

        img.onerror = function() {
            // Файла нет — прекращаем поиск
            if (found === 0) {
                gallery.innerHTML = '<p class="col-span-full text-center text-gray-500 text-sm">Photos coming soon…</p>';
            }
        };

        img.src = src;
    }

    tryLoad(1);
})();