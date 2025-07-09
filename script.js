
// Navbar scroll effect
let lastScroll = 0;
const navbar = document.getElementById('navbar');
const navHeight = navbar.offsetHeight;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class
    if (currentScroll > 50) {
        navbar.classList.add('nav-scrolled');
    } else {
        navbar.classList.remove('nav-scrolled');
    }

    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > navHeight * 2) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
let isMenuOpen = false;

mobileMenuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;

    if (isMenuOpen) {
        mobileMenuBtn.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        mobileMenuBtn.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        isMenuOpen = false;
        mobileMenuBtn.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Active nav link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - navHeight;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add magnetic effect to nav links (optional)
document.querySelectorAll('.nav-link, button').forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
        const rect = elem.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        elem.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    elem.addEventListener('mouseleave', () => {
        elem.style.transform = 'translate(0, 0)';
    });
});


// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Hero Slider Enhanced
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const slideInterval = 6000; // 6 seconds
let autoSlideTimer;

function resetAnimations(slide) {
    const animatedElements = slide.querySelectorAll('.slide-up, .slide-fade-in');
    animatedElements.forEach(el => {
        el.style.animation = 'none';
        el.offsetHeight; // Trigger reflow
        el.style.animation = null;
    });
}

function updateSlideCounter() {
    const counter = document.querySelector('.current-slide');
    if (counter) {
        counter.textContent = String(currentSlide + 1).padStart(2, '0');
    }
}

function updateProgressBars() {
    document.querySelectorAll('.slide-dot').forEach((dot, index) => {
        const progressBar = dot.querySelector('div');
        if (index === currentSlide) {
            progressBar.style.width = '100%';
            progressBar.style.transition = `width ${slideInterval}ms linear`;
        } else {
            progressBar.style.width = '0%';
            progressBar.style.transition = 'width 300ms ease';
        }
    });
}

function showSlide(index, direction = 'next') {
    // Hide all slides
    slides.forEach((slide, i) => {
        if (i === currentSlide) {
            slide.style.opacity = '0';
            slide.style.transform = direction === 'next' ? 'translateX(-50px)' : 'translateX(50px)';
        }
    });

    // Update current slide
    currentSlide = index;

    // Show current slide
    setTimeout(() => {
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.style.opacity = '1';
                slide.style.transform = 'translateX(0)';
                resetAnimations(slide);
            }
        });
    }, 50);

    updateSlideCounter();
    updateProgressBars();
}

function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    showSlide(next, 'next');
    resetAutoSlide();
}

function prevSlide() {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prev, 'prev');
    resetAutoSlide();
}

function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    autoSlideTimer = setInterval(nextSlide, slideInterval);
}

// Event Listeners
document.querySelector('.next-slide').addEventListener('click', nextSlide);
document.querySelector('.prev-slide').addEventListener('click', prevSlide);

// Indicator click handlers
document.querySelectorAll('.slide-dot').forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (index !== currentSlide) {
            showSlide(index, index > currentSlide ? 'next' : 'prev');
            resetAutoSlide();
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Initialize
showSlide(0);
resetAutoSlide();

// Pause on hover
const heroSection = document.getElementById('home');
heroSection.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
heroSection.addEventListener('mouseleave', resetAutoSlide);

// Initialize first slide animation
window.addEventListener('load', () => {
    showSlide(0);
});

// Form submission handler
document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(this);
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const message = this.querySelector('textarea').value;

    // Show success message (you can replace this with actual form submission)
    alert('Thank you for your message! We will contact you soon.');

    // Reset form
    this.reset();
});

// Service card hover effects
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add loading animation
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

// Parallax effect for hero section - FIXED
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const activeSlide = document.querySelector('.hero-slide.active');

    // Only apply parallax to the currently active slide
    if (activeSlide) {
        const speed = 0.5;
        const currentTransform = activeSlide.style.transform;

        // Preserve any existing transforms and add parallax
        if (currentTransform && !currentTransform.includes('translateY')) {
            activeSlide.style.transform = `${currentTransform} translateY(${scrolled * speed}px)`;
        } else if (!currentTransform.includes('translateY')) {
            activeSlide.style.transform = `translateY(${scrolled * speed}px)`;
        }
    }
});

// Add intersection observer for counting animation
const countingElements = document.querySelectorAll('.text-3xl.font-bold');

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const finalValue = target.textContent.replace(/\D/g, ''); // Extract numbers
            const suffix = target.textContent.replace(/\d/g, ''); // Extract non-numbers

            if (finalValue) {
                animateCount(target, 0, parseInt(finalValue), suffix, 2000);
            }

            countObserver.unobserve(target);
        }
    });
}, { threshold: 1 });

countingElements.forEach(el => {
    countObserver.observe(el);
});

function animateCount(element, start, end, suffix, duration) {
    const startTime = performance.now();

    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);

        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCount);
        }
    }

    requestAnimationFrame(updateCount);
}

// Add click handlers for service buttons
document.querySelectorAll('.service-card button').forEach(button => {
    button.addEventListener('click', function () {
        const card = this.closest('.service-card');
        const title = card.querySelector('h3').textContent;

        // Scroll to contact section
        document.getElementById('contact').scrollIntoView({
            behavior: 'smooth'
        });

        // Pre-fill the message textarea
        setTimeout(() => {
            const textarea = document.querySelector('textarea');
            textarea.value = `Hi, I'm interested in your ${title} service. Please provide me with more details and a quote.`;
            textarea.focus();
        }, 1000);
    });
});

// Add typing effect for hero text
function typeWriter(element, text, delay = 100) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, delay);
        }
    }

    type();
}

// Enhanced scroll reveal with stagger effect
const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('show');
            }, index * 200); // Stagger by 200ms
        }
    });
}, { threshold: 0.1 });

// Apply stagger effect to service cards
document.querySelectorAll('.service-card').forEach(card => {
    staggerObserver.observe(card);
});

function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            // Add + or % suffix back
            if (element.getAttribute('data-target') === '500') {
                element.textContent = '500+';
            } else if (element.getAttribute('data-target') === '15') {
                element.textContent = '15+';
            } else if (element.getAttribute('data-target') === '100') {
                element.textContent = '100%';
            }
        }
    };
    window.requestAnimationFrame(step);
}

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            animateCounter(counter, 0, target, 2000);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

// Observe all counters
document.querySelectorAll('.counter').forEach(counter => {
    counterObserver.observe(counter);
});
