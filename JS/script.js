document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    // Hamburger menu functionality
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('nav ul');
    const menuOverlay = document.querySelector('.menu-overlay');
    
    if (hamburgerMenu && navMenu && menuOverlay) {
        // Toggle menu when hamburger is clicked
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on overlay
        menuOverlay.addEventListener('click', function() {
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
        
        // Close menu when clicking on a navigation link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                navMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }

    // Initialize Typed.js for the main title
    const typingOptions = {
        strings: ['Vous avez <br /> un objectif ?'],
        typeSpeed: 50,
        backSpeed: 0,
        startDelay: 300,
        loop: false,
        showCursor: true,
        cursorChar: '|',
        autoInsertCss: true
    };
    
    // Start the typing animation
    if (document.querySelector('.typing-title')) {
        new Typed('.typing-title', typingOptions);
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
    
    // Language toggle functionality
    const langToggle = document.querySelector('.lang-toggle');
    let currentLang = 'fr'; // Default language is French

    langToggle.addEventListener('click', function() {
        if (currentLang === 'fr') {
            currentLang = 'en';
            langToggle.textContent = '🇫🇷';
            // Here you would add code to change the website content to English
        } else {
            currentLang = 'fr';
            langToggle.textContent = '🇬🇧';
            // Here you would add code to change the website content to French
        }
    });
});