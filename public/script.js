// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.innerHTML = navLinks.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

// Close menu when clicking on links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Improved Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.feature-card, .gallery-item').forEach(el => {
    observer.observe(el);
});

// Optimized Wallpaper Slider
let wallpaperInterval;

function startWallpaperSlider() {
    wallpaperInterval = setInterval(changeWallpaper, 3000);
}

function pauseWallpaperSlider() {
    clearInterval(wallpaperInterval);
}

// Pause on mobile when not visible
const phoneMockup = document.querySelector('.phone-mockup');
const observerPhone = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startWallpaperSlider();
        } else {
            pauseWallpaperSlider();
        }
    });
}, { threshold: 0.5 });

if (phoneMockup) {
    observerPhone.observe(phoneMockup);
}

document.addEventListener('DOMContentLoaded', function() {
    // Wallpaper slider animation
    const wallpapers = document.querySelectorAll('.wallpaper-slider img');
    let currentWallpaper = 0;
    
    function changeWallpaper() {
        wallpapers[currentWallpaper].classList.remove('active');
        currentWallpaper = (currentWallpaper + 1) % wallpapers.length;
        wallpapers[currentWallpaper].classList.add('active');
    }
    
    setInterval(changeWallpaper, 3000);
    
    // Scroll animations
    const animateElements = document.querySelectorAll('.animate__animated');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.opacity = 1;
                element.classList.add(element.getAttribute('data-animation'));
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on load
    
    // Email form submission
    const emailForm = document.getElementById('email-form');
    const formMessage = document.querySelector('.form-message');
    
    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        
        // Here you would typically send this to your backend
        // For demo purposes, we'll just show a success message
        formMessage.textContent = 'Thanks for your interest! We\'ll notify you when we launch.';
        formMessage.style.color = 'white';
        
        // Reset form
        emailForm.reset();
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
        }, 5000);
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});