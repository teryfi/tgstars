// === main.js ===
// === stars-bg.js ===
const canvas = document.getElementById('stars-bg');
const ctx = canvas.getContext('2d');
let stars = [];
const STAR_COLOR = 'rgba(255, 179, 0, 0.85)';
const STAR_GLOW = 'rgba(255, 179, 0, 0.25)';
const STAR_COUNT = 60;
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
function random(min, max) {
    return Math.random() * (max - min) + min;
}
function createStar() {
    const size = random(1.5, 4.5);
    return {
        x: random(0, canvas.width),
        y: random(0, canvas.height),
        r: size,
        speed: random(0.08, 0.22),
        angle: random(0, Math.PI * 2),
        twinkle: random(0.7, 1),
        twinkleSpeed: random(0.002, 0.008),
        phase: random(0, Math.PI * 2)
    };
}
function drawStar(star, t) {
    // Мерцание
    const tw = 0.7 + 0.3 * Math.sin(t * star.twinkleSpeed + star.phase);
    ctx.save();
    ctx.globalAlpha = tw * star.twinkle;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = STAR_COLOR;
    ctx.shadowColor = STAR_GLOW;
    ctx.shadowBlur = 16;
    ctx.fill();
    ctx.restore();
    // Рисуем "лучики" (простая имитация)
    ctx.save();
    ctx.globalAlpha = 0.18 * tw;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = STAR_GLOW;
    ctx.fill();
    ctx.restore();
}
function updateStars() {
    for (let star of stars) {
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        // Зацикливаем
        if (star.x < -10) star.x = canvas.width + 10;
        if (star.x > canvas.width + 10) star.x = -10;
        if (star.y < -10) star.y = canvas.height + 10;
        if (star.y > canvas.height + 10) star.y = -10;
    }
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = performance.now();
    for (let star of stars) {
        drawStar(star, t);
    }
    updateStars();
    requestAnimationFrame(animate);
}
function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(createStar());
    }
}
window.addEventListener('resize', () => {
    resizeCanvas();
    initStars();
});
resizeCanvas();
initStars();
animate();
// === script.js ===
let selectedPackage = null;
let selectedStars = 0;
let selectedPrice = 0;
document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeFAQ();
    initializeScrollAnimations();
    initializeFormValidation();
    renderReviews();
    initializeSectionFadeIn();
});
function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        mobileToggle.classList.toggle('active');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });
}
function initializeSectionFadeIn() {
    document.querySelectorAll('section').forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${i * 0.1}s`;
    });
    document.querySelectorAll('.step-card').forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${i * 0.1 + 0.2}s`;
    });
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('section, .step-card').forEach(el => observer.observe(el));
}
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
    const elementsToAnimate = document.querySelectorAll('.pricing-card, .step-card, .faq-item');
    elementsToAnimate.forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}
function initializeFormValidation() {
    const form = document.getElementById('orderForm');
    const telegramInput = document.getElementById('telegramId');
    const starsInput = document.getElementById('starsCount');
    const emailInput = document.getElementById('email');
    telegramInput.addEventListener('input', function() {
        const value = this.value.trim();
        if (value && !isValidTelegramId(value)) {
            this.setCustomValidity('Введите корректный Telegram ID или @username');
        } else {
            this.setCustomValidity('');
        }
    });
    emailInput.addEventListener('input', function() {
        const value = this.value.trim();
        if (value && !isValidEmail(value)) {
            this.setCustomValidity('Введите корректный email адрес');
        } else {
            this.setCustomValidity('');
        }
    });
    starsInput.addEventListener('input', function() {
        const value = parseInt(this.value);
        if (!value || value < 1) {
            this.setCustomValidity('Введите количество звёзд (от 1)');
        } else {
            this.setCustomValidity('');
        }
    });
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            processOrder();
        }
    });
}
function isValidTelegramId(value) {
    return /^@?[a-zA-Z0-9_]{5,32}$/.test(value) || /^\d{6,10}$/.test(value);
}
function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function validateForm() {
    const telegramId = document.getElementById('telegramId').value.trim();
    const starsCount = parseInt(document.getElementById('starsCount').value);
    const email = document.getElementById('email').value.trim();
    if (!telegramId) {
        showNotification('Введите Telegram ID или @username', 'error');
        return false;
    }
    if (!isValidTelegramId(telegramId)) {
        showNotification('Некорректный формат Telegram ID', 'error');
        return false;
    }
    if (!starsCount || starsCount < 1) {
        showNotification('Введите количество звёзд (от 1)', 'error');
        return false;
    }
    if (!email) {
        showNotification('Введите email адрес', 'error');
        return false;
    }
    if (!isValidEmail(email)) {
        showNotification('Некорректный формат email', 'error');
        return false;
    }
    return true;
}
function processOrder() {
    const formData = new FormData(document.getElementById('orderForm'));
    const orderData = {
        telegramId: formData.get('telegramId'),
        starsCount: formData.get('starsCount'),
        email: formData.get('email')
    };
    const payButton = document.querySelector('.pay-button');
    const originalText = payButton.innerHTML;
    payButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка...';
    payButton.disabled = true;
    setTimeout(() => {
        showNotification('Перенаправление на страницу оплаты...', 'info');
        payButton.innerHTML = originalText;
        payButton.disabled = false;
        setTimeout(() => {
            alert('Здесь будет перенаправление на платёжную систему');
        }, 2000);
    }, 2000);
}
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}
function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .pricing-card.selected {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .nav-link.active {
        color: #3b82f6;
    }
    .nav-link.active::after {
        width: 100%;
    }
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-card-dark);
            padding: 1rem;
            border-top: 1px solid var(--border-dark);
        }
        .light-theme .nav-menu.active {
            background: var(--bg-card-light);
            border-top: 1px solid var(--border-light);
        }
        .mobile-menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        .mobile-menu-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        .mobile-menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;
document.head.appendChild(notificationStyles);
const reviews = [
    {
        author: 'Алексей',
        rating: 5,
        text: 'Очень быстро получил звёзды, всё супер! Спасибо Terstars!'
    },
    {
        author: 'Мария',
        rating: 5,
        text: 'Удобный сервис, всё понятно, поддержка отвечает моментально.'
    },
    {
        author: 'Иван',
        rating: 4,
        text: 'Звёзды пришли за 2 минуты, всё честно. Буду брать ещё.'
    }
];
function renderReviews() {
    const list = document.getElementById('reviews-list');
    list.innerHTML = '';
    reviews.forEach(r => {
        let stars = '';
        for (let i = 0; i < 5; i++) {
            if (i < r.rating) {
                stars += '<i class="fas fa-star" style="color:#ffb300"></i>';
            } else {
                stars += '<i class="far fa-star" style="color:#ffb300"></i>';
            }
        }
        const card = document.createElement('div');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="review-rating" style="color:#ffb300; font-size:1.4rem; letter-spacing:0.08em;">${stars}</div>
            <div>${r.text}</div>
            <div class="review-author">${r.author}</div>
        `;
        list.appendChild(card);
    });
} 