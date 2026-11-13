// ==================== МОБИЛЬНОЕ МЕНЮ ====================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', e => {
            e.preventDefault(); e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
            menuToggle.classList.toggle('active');
        });
        document.querySelectorAll('[data-close-menu]').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuToggle.classList.remove('active');
            });
        });
    }

    initCalendar('booking-calendar');
    initCalendar('sms-calendar');

    const animated = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (animated.length) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('active');
                else e.target.classList.remove('active');
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
        animated.forEach(el => obs.observe(el));
    }

    const scrollBtn = document.getElementById('scrollTopBtn');
    if (scrollBtn) {
        window.addEventListener('scroll', () => {
            scrollBtn.classList.toggle('visible', window.scrollY > 400);
        });
        scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    loadWorkGallery();
    renderServiceCards();
    populateServiceSelect();

    // See more / See less для отзывов
    document.querySelectorAll('.review-card').forEach(card => {
        const text = card.querySelector('.review-text');
        const toggle = card.querySelector('.review-toggle');
        if (!text || !toggle) return;

        const isClamped = text.scrollHeight > text.clientHeight + 2;

        if (isClamped) {
            toggle.classList.remove('hidden');
        }

        toggle.addEventListener('click', () => {
            const expanded = text.classList.toggle('expanded');
            toggle.textContent = expanded ? 'See less...' : 'See more...';
        });
    });
});

// ==================== КАСТОМНЫЙ КАЛЕНДАРЬ ====================
function initCalendar(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let current = new Date();
    current.setDate(1);
    let selectedDate = null;

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const dayNames = ['Mo','Tu','We','Th','Fr','Sa','Su'];

    function isPast(date) {
        const today = new Date();
        today.setHours(0,0,0,0);
        return date < today;
    }

    function render() {
        const y = current.getFullYear(), m = current.getMonth();
        const first = new Date(y, m, 1);
        const lastDay = new Date(y, m + 1, 0).getDate();
        const startDow = (first.getDay() + 6) % 7;

        const now = new Date();
        const canGoBack = !(y === now.getFullYear() && m === now.getMonth());

        let html = `
            <div class="custom-calendar">
                <div class="cal-header">
                    <button type="button" class="cal-nav" data-nav="-1" ${canGoBack ? '' : 'disabled'}>
                        <i class="fa-solid fa-chevron-left"></i>
                    </button>
                    <span>${monthNames[m]} ${y}</span>
                    <button type="button" class="cal-nav" data-nav="1">
                        <i class="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
                <div class="cal-grid">
                    ${dayNames.map(d => `<div class="cal-dow">${d}</div>`).join('')}
        `;

        for (let i = 0; i < startDow; i++) html += `<div class="cal-day empty"></div>`;

        for (let d = 1; d <= lastDay; d++) {
            const date = new Date(y, m, d);
            const iso = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
            const past = isPast(date);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSel = selectedDate === iso;

            let cls = 'cal-day';
            if (past) cls += ' disabled';
            if (isSel) cls += ' selected';
            if (isToday) cls += ' today';

            html += `<button type="button" class="${cls}" data-date="${iso}" ${past ? 'disabled' : ''}>${d}</button>`;
        }

        html += `</div></div>`;

        if (selectedDate) {
            const [yy, mm, dd] = selectedDate.split('-');
            const dateObj = new Date(yy, mm-1, dd);
            const formatted = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            html += `<div class="selected-date-display"><i class="fa-solid fa-calendar-check"></i>${formatted}</div>`;
        }

        container.innerHTML = html;

        container.querySelectorAll('[data-nav]').forEach(btn => {
            btn.addEventListener('click', () => {
                current.setMonth(current.getMonth() + parseInt(btn.dataset.nav));
                render();
            });
        });

        container.querySelectorAll('.cal-day:not(.empty):not(.disabled)').forEach(btn => {
            btn.addEventListener('click', () => {
                selectedDate = btn.dataset.date;
                render();
            });
        });
    }

    render();
    container.getSelectedDate = () => selectedDate;
}

// ==================== ФОРМАТ ДАТЫ ====================
function formatDateForMessage(isoDate) {
    if (!isoDate) return 'Not specified';
    const [y, m, d] = isoDate.split('-');
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
}

// ==================== КАРТОЧКИ УСЛУГ С МЕДИА ====================
function renderServiceCards() {
    const grid = document.getElementById('services-grid');
    if (!grid) return;

    const services = typeof SERVICES_CONFIG !== 'undefined' ? SERVICES_CONFIG : [];

    if (!services.length) {
        grid.innerHTML = '<p class="col-span-full text-center text-gray-500 text-sm">No services configured.</p>';
        return;
    }

    grid.innerHTML = services.map(svc => `
        <div onclick="openBookingModal('${svc.name}')" class="service-card bg-cardBg hover:bg-cardHover border border-gray-800 hover:border-safetyYellow p-6 rounded-2xl text-center transition duration-300 shadow-md cursor-pointer group reveal">
            <div class="service-media" data-service="${svc.file}" data-icon="${svc.icon}">
                <i class="fa-solid ${svc.icon} fallback-icon"></i>
            </div>
            <h3 class="font-heading font-bold text-sm sm:text-base text-white">${svc.name}</h3>
        </div>
    `).join('');

    document.querySelectorAll('.service-media').forEach(media => {
        tryLoadMedia(media, 0);
    });

    const newAnimated = grid.querySelectorAll('.reveal');
    if (newAnimated.length) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('active');
                else e.target.classList.remove('active');
            });
        }, { threshold: 0.1 });
        newAnimated.forEach(el => obs.observe(el));
    }
}

// ==================== ЗАПОЛНЕНИЕ SELECT В ФОРМЕ ====================
function populateServiceSelect() {
    const select = document.getElementById('b-service');
    if (!select) return;

    const services = (typeof SERVICES_CONFIG !== 'undefined' ? SERVICES_CONFIG : [])
        .filter(svc => svc.showInForm !== false);

    select.innerHTML = '';

    services.forEach(svc => {
        const opt = document.createElement('option');
        opt.value = svc.name;
        opt.textContent = svc.name;
        select.appendChild(opt);
    });

    const optOther = document.createElement('option');
    optOther.value = 'Other';
    optOther.textContent = 'Other / Custom Problem';
    select.appendChild(optOther);
}

// ==================== ЗАГРУЗКА МЕДИА ====================
function tryLoadMedia(mediaEl, formatIndex) {
    const formats = ['gif', 'webp', 'mp4', 'webm'];
    const service = mediaEl.dataset.service;

    if (formatIndex >= formats.length) return;

    const ext = formats[formatIndex];
    const src = `img/services/${service}.${ext}`;

    if (ext === 'mp4' || ext === 'webm') {
        const video = document.createElement('video');
        video.src = src;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.onloadeddata = () => {
            mediaEl.innerHTML = '';
            mediaEl.appendChild(video);
        };
        video.onerror = () => tryLoadMedia(mediaEl, formatIndex + 1);
        return;
    }

    const img = new Image();
    img.onload = () => {
        mediaEl.innerHTML = '';
        mediaEl.appendChild(img);
    };
    img.onerror = () => tryLoadMedia(mediaEl, formatIndex + 1);
    img.src = src;
}

// ==================== ОБРАБОТКА "OTHER" ====================
function toggleOtherService() {
    const select = document.getElementById('b-service');
    const wrapper = document.getElementById('other-service-wrapper');
    const textarea = document.getElementById('b-other-service');
    if (!select || !wrapper || !textarea) return;

    if (select.value === 'Other') {
        wrapper.classList.remove('hidden');
        textarea.required = true;
        setTimeout(() => textarea.focus(), 100);
    } else {
        wrapper.classList.add('hidden');
        textarea.required = false;
        textarea.value = '';
    }
}

// ==================== BOOKING MODAL ====================
function openBookingModal(serviceName = '') {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.remove('hidden');
    if (serviceName) {
        const select = document.getElementById('b-service');
        if (select) {
            for (let i = 0; i < select.options.length; i++) {
                if (select.options[i].text.toLowerCase().includes(serviceName.toLowerCase())) {
                    select.selectedIndex = i; break;
                }
            }
            toggleOtherService();
        }
    }
}

function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (modal) modal.classList.add('hidden');
}

function handleBookingSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('b-name').value.trim();
    const phone = document.getElementById('b-phone').value.trim();
    const serviceValue = document.getElementById('b-service').value;
    const location = document.getElementById('b-location').value.trim();
    const dateEl = document.getElementById('booking-calendar');
    const dateRaw = dateEl.getSelectedDate ? dateEl.getSelectedDate() : null;
    const dateFormatted = formatDateForMessage(dateRaw);

    let finalService = serviceValue;
    if (serviceValue === 'Other') {
        const otherText = document.getElementById('b-other-service').value.trim();
        if (!otherText) {
            alert('Please describe your problem.');
            return;
        }
        finalService = `Other: ${otherText}`;
    }

    const message =
`Hi Aleks, I'd like to book a service.

👤 Name: ${name}
📞 Phone: ${phone}
🔧 Service: ${finalService}
📍 Location: ${location}
📅 Preferred date: ${dateFormatted}

Please confirm. Thanks!`;

    window.location.href = `sms:+19168606330?body=${encodeURIComponent(message)}`;
    closeBookingModal();
    event.target.reset();
    const wrapper = document.getElementById('other-service-wrapper');
    if (wrapper) wrapper.classList.add('hidden');
    if (dateEl.getSelectedDate) initCalendar('booking-calendar');
}

// ==================== SMS MODAL ====================
function openSmsModal() {
    const modal = document.getElementById('sms-modal');
    if (modal) modal.classList.remove('hidden');
}

function closeSmsModal() {
    const modal = document.getElementById('sms-modal');
    if (modal) modal.classList.add('hidden');
}

function handleSmsSubmit(event) {
    event.preventDefault();

    const brand = document.getElementById('sms-brand').value.trim();
    const model = document.getElementById('sms-model').value.trim();
    const year = document.getElementById('sms-year').value.trim();
    const problem = document.getElementById('sms-problem').value.trim();
    const dateEl = document.getElementById('sms-calendar');
    const dateRaw = dateEl.getSelectedDate ? dateEl.getSelectedDate() : null;
    const dateFormatted = formatDateForMessage(dateRaw);

    const message =
`Hi Aleks, I need help with my car.

🚗 Vehicle: ${brand} ${model} (${year})
🔧 Problem: ${problem}
📅 Preferred date: ${dateFormatted}

Please let me know if this works. Thanks!`;

    window.location.href = `sms:+19168606330?body=${encodeURIComponent(message)}`;
    closeSmsModal();
}

// ==================== FAQ ====================
function toggleFaq(id) {
    const c = document.getElementById(`faq-content-${id}`);
    const i = document.getElementById(`faq-icon-${id}`);
    if (c) c.classList.toggle('hidden');
    if (i) i.classList.toggle('rotate-180');
}

// ==================== CLICK ВНЕ МОДАЛОК ====================
document.addEventListener('click', e => {
    const b = document.getElementById('booking-modal');
    const s = document.getElementById('sms-modal');
    if (b && e.target === b) closeBookingModal();
    if (s && e.target === s) closeSmsModal();
});

// ==================== TOAST ====================
function showToast() {
    const t = document.getElementById('toast');
    if (!t) return;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 4000);
}

// ==================== АВТО-ГАЛЕРЕЯ РАБОТ ====================
function loadWorkGallery() {
    const gallery = document.getElementById('work-gallery');
    if (!gallery) return;
    const MAX = 50, EXT = 'jpg', FOLDER = 'img/work/', PREFIX = 'work-';
    const TITLES = ['On-Site Tire Installation','Fully Equipped Van','Precision Care','Wheel Balancing','TPMS Service','Brake Service','Suspension Repair','Oil Change','Computer Diagnostics'];
    let found = 0;
    function tryLoad(i) {
        if (i > MAX) return;
        const src = `${FOLDER}${PREFIX}${i}.${EXT}`;
        const img = new Image();
        img.onload = () => {
            found++;
            const title = TITLES[(i - 1) % TITLES.length];
            const card = document.createElement('div');
            card.className = 'bg-cardBg border border-gray-800 rounded-2xl overflow-hidden shadow-xl reveal active';
            // БЕЗ ТЕКСТА — только фото в рамке
            card.innerHTML = `
                <img src="${src}" alt="${title}" class="w-full h-64 object-cover hover:scale-105 transition duration-500">
            `;
            gallery.appendChild(card);
            tryLoad(i + 1);
        };
        img.onerror = () => { if (found === 0) gallery.innerHTML = '<p class="col-span-full text-center text-gray-500 text-sm">Photos coming soon…</p>'; };
        img.src = src;
    }
    tryLoad(1);
}