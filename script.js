// ===== DOM Elements =====
const header = document.querySelector('.glass-header');
const navLinks = document.querySelectorAll('.nav-menu a');
const contactButtons = document.querySelectorAll('.btn-purple, .btn-primary');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const filterButtons = document.querySelectorAll('.project-tags .tag');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contact-form');
const fullNameInput = document.getElementById('full-name');
const emailInput = document.getElementById('email-address');
const messageInput = document.getElementById('project-brief');
const formMessage = document.getElementById('form-message');
const sendButton = contactForm ? contactForm.querySelector('.btn-purple.btn-full') : null;
const sendButtonOriginalHTML = sendButton ? sendButton.innerHTML : '';

// Mark body as loaded for initial hero animation
window.addEventListener('load', () => {
    document.body.classList.add('is-loaded');
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }

        // Close mobile nav after clicking a link
        if (navMenu && navToggle && navMenu.classList.contains('is-open')) {
            navMenu.classList.remove('is-open');
            navToggle.classList.remove('is-open');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// ===== Header Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.background = 'rgba(5, 5, 5, 0.95)';
        header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    } else {
        header.style.background = 'rgba(5, 5, 5, 0.8)';
        header.style.boxShadow = 'none';
    }
});

// ===== Mobile Navigation Toggle =====
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('is-open');
        navToggle.classList.toggle('is-open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
}

// ===== Project Tag Filtering =====
if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter || 'all';

            // Active state
            filterButtons.forEach(b => b.classList.remove('active'));
            button.classList.add('active');

            // Filter projects
            projectCards.forEach(card => {
                const category = card.dataset.category || '';
                if (filter === 'all' || category === filter) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== Simple Form Interaction =====
const contactInputs = document.querySelectorAll('input, textarea');

contactInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
    });
});

// ===== Contact Form Validation & Feedback =====
function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

if (sendButton && contactForm && fullNameInput && emailInput && messageInput && formMessage) {
    sendButton.addEventListener('click', () => {
        // Clear previous states
        formMessage.textContent = '';
        formMessage.className = 'form-message';
        [fullNameInput, emailInput, messageInput].forEach(input => {
            const group = input.closest('.form-group');
            if (group) group.classList.remove('error');
        });

        let hasError = false;

        if (!fullNameInput.value.trim()) {
            const group = fullNameInput.closest('.form-group');
            if (group) group.classList.add('error');
            hasError = true;
        }

        if (!validateEmail(emailInput.value)) {
            const group = emailInput.closest('.form-group');
            if (group) group.classList.add('error');
            hasError = true;
        }

        if (!messageInput.value.trim()) {
            const group = messageInput.closest('.form-group');
            if (group) group.classList.add('error');
            hasError = true;
        }

        if (hasError) {
            formMessage.textContent = 'Please fill in all fields with a valid email.';
            formMessage.classList.add('error');
            return;
        }

        // Simulate sending
        if (sendButtonOriginalHTML) {
            sendButton.innerHTML = 'Sending...';
        }
        sendButton.disabled = true;
        formMessage.textContent = 'Sending your message...';

        setTimeout(() => {
            if (sendButtonOriginalHTML) {
                sendButton.innerHTML = sendButtonOriginalHTML;
            }
            sendButton.disabled = false;
            formMessage.textContent = "Thanks for reaching out! I’ll get back to you soon.";
            formMessage.classList.add('success');
            contactForm.reset();
        }, 800);
    });
}

// Button Click Ripple Effect (Simulation)
contactButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        // Just a simple scale effect on click
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
    });
});

// ===== Intersection Observer for Fade In =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Select elements to animate
const animatableElements = document.querySelectorAll('.project-card, .bento-card, .timeline-item, .cta-cardglass');

animatableElements.forEach((el, index) => {
    const delay = (index % 4) * 0.12;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`;
    observer.observe(el);
});
