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
    
    // Start the typing animation for the main title
    if (document.querySelector('.typing-title')) {
        new Typed('.typing-title', typingOptions);
    }

    // Initialize Typed.js for the quote in the about section
    const quoteTypingOptions = {
        strings: ['Votre image est un actif sur lequel capitaliser pour atteindre vos ambitions.'],
        typeSpeed: 0,
        backSpeed: 0,
        startDelay: 500,
        loop: false,
        showCursor: false,
        autoInsertCss: true
    };

    // Create an intersection observer for the quote element
    const quoteObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the quote is in the viewport
            if (entry.isIntersecting && !entry.target.hasAttribute('data-typed-initialized')) {
                // Start the typing animation for the quote
                new Typed(entry.target, quoteTypingOptions);
                // Mark the element as initialized to prevent re-initialization
                entry.target.setAttribute('data-typed-initialized', 'true');
            }
        });
    }, { threshold: 0.5 });

    // Observe the quote element
    const quoteElement = document.querySelector('.quote-text');
    if (quoteElement) {
        quoteElement.innerHTML = '';  // Clear existing content for Typed.js to work
        quoteObserver.observe(quoteElement);
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

    // Gestion de l'expansion des cartes
    const cardHeaders = document.querySelectorAll('.card-header');
    
    cardHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const card = this.closest('.service-card');
            card.classList.toggle('expanded');
        });
    });
});